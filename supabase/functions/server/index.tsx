import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client (uses Service Role inside the function runtime)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

// Create photo storage bucket on startup
const BUCKET_NAME = "make-ce101b60-photos";
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, { public: false });
      console.log(`Created bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {
    console.log(`Error creating bucket: ${error}`);
  }
})();

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ce101b60/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== VOTING ROUTES ==========

// Get all votes for a specific category
app.get("/make-server-ce101b60/votes/:category", async (c) => {
  try {
    const category = c.req.param("category");
    const votes = await kv.getByPrefix(`vote:${category}:`);
    return c.json({ success: true, votes });
  } catch (error) {
    console.log(`Error fetching votes for category: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Submit a vote
app.post("/make-server-ce101b60/votes/:category", async (c) => {
  try {
    const category = c.req.param("category");
    const body = await c.req.json();
    const { pearlName, selections } = body;

    if (!pearlName || !selections) {
      return c.json(
        { success: false, error: "Missing pearlName or selections" },
        400,
      );
    }

    const key = `vote:${category}:${pearlName}`;
    await kv.set(key, { pearlName, selections, timestamp: Date.now() });

    return c.json({ success: true, message: "Vote recorded successfully" });
  } catch (error) {
    console.log(`Error submitting vote: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get aggregated results for a category
app.get("/make-server-ce101b60/results/:category", async (c) => {
  try {
    const category = c.req.param("category");
    const votes = await kv.getByPrefix(`vote:${category}:`);

    // Aggregate votes
    const results: Record<string, number> = {};
    votes.forEach((vote: any) => {
      if (vote.selections && Array.isArray(vote.selections)) {
        vote.selections.forEach((selection: string) => {
          results[selection] = (results[selection] || 0) + 1;
        });
      }
    });

    return c.json({ success: true, results, totalVoters: votes.length });
  } catch (error) {
    console.log(`Error fetching results: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== ACTIVITIES (DB) ==========

// List activities from Postgres (used by per-activity readiness UI)
app.get("/make-server-ce101b60/activities", async (c) => {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select("id, title, day, time, location")
      .order("day", { ascending: true });

    if (error) {
      console.log(`DB error fetching activities: ${error}`);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, activities: data ?? [] });
  } catch (error) {
    console.log(`Error fetching activities: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== WHO'S READY STATUS (DB, per activity) ==========

// Helper: normalize UI pearl name ("Pearl 15") to participant_id ("Pearl_15").
// If your participants.id is actually "Pearl 15", you can return pearlName as-is.
function pearlNameToParticipantId(pearlName: string) {
  return pearlName.replace(" ", "_");
}

// Get ready statuses for an activity
// GET /ready-status?activityId=<uuid>
app.get("/make-server-ce101b60/ready-status", async (c) => {
  try {
    const activityId = c.req.query("activityId");
    if (!activityId) {
      return c.json({ success: false, error: "Missing activityId" }, 400);
    }

    const { data, error } = await supabase
      .from("readiness_status")
      .select("participant_id, status, updated_at")
      .eq("activity_id", activityId);

    if (error) {
      console.log(`DB error fetching readiness: ${error}`);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Frontend expects: { pearlName, isReady, timestamp }
    // Your participant_id is text; we map it back to "Pearl 15" style for display.
    const statuses = (data ?? []).map((row: any) => ({
      pearlName: String(row.participant_id).replace("_", " "),
      isReady: row.status === "ready",
      timestamp: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
    }));

    return c.json({ success: true, statuses });
  } catch (error) {
    console.log(`Error fetching ready statuses: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update ready status for a pearl for a specific activity
// POST body: { activityId, pearlName, isReady }
app.post("/make-server-ce101b60/ready-status", async (c) => {
  try {
    const body = await c.req.json();
    const { activityId, pearlName, isReady } = body;

    if (!activityId || !pearlName || typeof isReady !== "boolean") {
      return c.json(
        { success: false, error: "Missing activityId, pearlName, or isReady" },
        400,
      );
    }

    const participantId = pearlNameToParticipantId(String(pearlName));

    // Requires UNIQUE(activity_id, participant_id) constraint.
    const { error } = await supabase
      .from("readiness_status")
      .upsert(
        {
          activity_id: activityId,
          participant_id: participantId,
          status: isReady ? "ready" : "not_ready",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "activity_id,participant_id" },
      );

    if (error) {
      console.log(`DB error updating readiness: ${error}`);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, message: "Ready status updated" });
  } catch (error) {
    console.log(`Error updating ready status: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== PHOTO ALBUM ==========

// Upload a photo file
app.post("/make-server-ce101b60/photos/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    const pearlName = formData.get("pearlName") as string;
    const caption = formData.get("caption") as string;
    const day = formData.get("day") as string;

    if (!file || !pearlName) {
      return c.json(
        { success: false, error: "Missing file or pearlName" },
        400,
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}-${pearlName.replace(/\s+/g, "-")}.${fileExt}`;

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.log(`Error uploading file to storage: ${uploadError}`);
      return c.json(
        { success: false, error: `Upload error: ${uploadError.message}` },
        500,
      );
    }

    // Create signed URL (valid for 10 years)
    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 315360000); // 10 years in seconds

    if (!urlData?.signedUrl) {
      return c.json(
        { success: false, error: "Failed to create signed URL" },
        500,
      );
    }

    // Store photo metadata in KV
    const photoId = `photo:${timestamp}-${pearlName}`;
    await kv.set(photoId, {
      pearlName,
      photoUrl: urlData.signedUrl,
      fileName: fileName,
      caption: caption || "",
      day: day || "",
      timestamp,
    });

    return c.json({
      success: true,
      message: "Photo uploaded successfully",
      photoId,
      photoUrl: urlData.signedUrl,
    });
  } catch (error) {
    console.log(`Error uploading photo: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all photos
app.get("/make-server-ce101b60/photos", async (c) => {
  try {
    const photos = await kv.getByPrefix("photo:");
    return c.json({ success: true, photos });
  } catch (error) {
    console.log(`Error fetching photos: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add a photo (legacy endpoint for URL-based photos)
app.post("/make-server-ce101b60/photos", async (c) => {
  try {
    const body = await c.req.json();
    const { pearlName, photoUrl, caption, day } = body;

    if (!pearlName || !photoUrl) {
      return c.json(
        { success: false, error: "Missing pearlName or photoUrl" },
        400,
      );
    }

    const photoId = `photo:${Date.now()}-${pearlName}`;
    await kv.set(photoId, {
      pearlName,
      photoUrl,
      caption: caption || "",
      day: day || "",
      timestamp: Date.now(),
    });

    return c.json({ success: true, message: "Photo added successfully", photoId });
  } catch (error) {
    console.log(`Error adding photo: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete a photo
app.delete("/make-server-ce101b60/photos/:photoId", async (c) => {
  try {
    const photoId = c.req.param("photoId");

    // Get photo data to find the fileName
    const photoData = await kv.get(photoId);

    // Delete from storage if it has a fileName (uploaded files)
    if (photoData && photoData.fileName) {
      const { error: deleteError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([photoData.fileName]);

      if (deleteError) {
        console.log(`Error deleting file from storage: ${deleteError}`);
      }
    }

    // Delete from KV store
    await kv.del(photoId);

    return c.json({ success: true, message: "Photo deleted successfully" });
  } catch (error) {
    console.log(`Error deleting photo: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== SPLIT PAYMENT TRACKER (KV) ==========

// Get all expenses
app.get("/make-server-ce101b60/expenses", async (c) => {
  try {
    const expenses = await kv.getByPrefix("expense:");
    return c.json({ success: true, expenses });
  } catch (error) {
    console.log(`Error fetching expenses: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Add an expense
app.post("/make-server-ce101b60/expenses", async (c) => {
  try {
    const body = await c.req.json();
    const { description, amount, paidBy, splitAmong, status } = body;

    if (!description || !amount || !paidBy || !splitAmong) {
      return c.json({ success: false, error: "Missing required fields" }, 400);
    }

    const expenseId = `expense:${Date.now()}`;
    await kv.set(expenseId, {
      description,
      amount: parseFloat(amount),
      paidBy,
      splitAmong, // array of pearl names
      status: status || "open",
      payments: {}, // tracks who has paid
      timestamp: Date.now(),
    });

    return c.json({ success: true, message: "Expense added successfully", expenseId });
  } catch (error) {
    console.log(`Error adding expense: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update expense (mark payment)
app.put("/make-server-ce101b60/expenses/:expenseId", async (c) => {
  try {
    const expenseId = c.req.param("expenseId");
    const body = await c.req.json();
    const { pearlName, hasPaid } = body;

    const expense = await kv.get(expenseId);
    if (!expense) {
      return c.json({ success: false, error: "Expense not found" }, 404);
    }

    // Update payment status
    expense.payments = expense.payments || {};
    expense.payments[pearlName] = hasPaid;

    // Check if all have paid (except the person who paid initially)
    const allPaid = expense.splitAmong.every((name: string) =>
      name === expense.paidBy || expense.payments[name] === true
    );

    if (allPaid) {
      expense.status = "settled";
    }

    await kv.set(expenseId, expense);

    return c.json({ success: true, message: "Payment status updated", expense });
  } catch (error) {
    console.log(`Error updating expense: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete an expense
app.delete("/make-server-ce101b60/expenses/:expenseId", async (c) => {
  try {
    const expenseId = c.req.param("expenseId");
    await kv.del(expenseId);

    return c.json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    console.log(`Error deleting expense: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get payment summary for all pearls
app.get("/make-server-ce101b60/payment-summary", async (c) => {
  try {
    const expenses = await kv.getByPrefix("expense:");

    // Calculate who owes who
    const summary: Record<
      string,
      { owes: number; owed: number; details: any[] }
    > = {};

    expenses.forEach((expense: any) => {
      const perPersonAmount = expense.amount / expense.splitAmong.length;

      // Initialize summary entries
      if (!summary[expense.paidBy]) {
        summary[expense.paidBy] = { owes: 0, owed: 0, details: [] };
      }

      expense.splitAmong.forEach((pearlName: string) => {
        if (!summary[pearlName]) {
          summary[pearlName] = { owes: 0, owed: 0, details: [] };
        }

        if (pearlName !== expense.paidBy) {
          const hasPaid = expense.payments && expense.payments[pearlName];

          if (!hasPaid) {
            // This pearl owes money
            summary[pearlName].owes += perPersonAmount;
            summary[expense.paidBy].owed += perPersonAmount;

            summary[pearlName].details.push({
              description: expense.description,
              amount: perPersonAmount,
              owesTo: expense.paidBy,
              status: expense.status,
            });
          }
        }
      });
    });

    return c.json({ success: true, summary });
  } catch (error) {
    console.log(`Error calculating payment summary: ${error}`);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);