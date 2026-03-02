import { Link } from "react-router";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Activity {
  id: string;
  title: string;
  day?: string | null;
  time?: string | null;
  location?: string | null;
}

interface ReadyStatus {
  // IMPORTANT: in this version, readiness keys are participant IDs (e.g. "Pearl_15")
  pearlName: string; // returned by edge fn; should be participant_id OR we normalize below
  isReady: boolean;
  timestamp?: number;
}

interface Participant {
  id: string;   // e.g. "Pearl_15"
  name: string; // e.g. "Pearl 15"
}

const FUNCTIONS_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce101b60`;

export function WhosReadyPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const [selectedActivityId, setSelectedActivityId] = useState<string>("");
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>("");

  // readiness map keyed by participantId: { "Pearl_15": true }
  const [readyByParticipantId, setReadyByParticipantId] = useState<Record<string, boolean>>(
    {},
  );

  const [loading, setLoading] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [loadingStatuses, setLoadingStatuses] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const selectedActivity = useMemo(
    () => activities.find((a) => a.id === selectedActivityId),
    [activities, selectedActivityId],
  );

  useEffect(() => {
    fetchActivities();
    fetchParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedActivityId) fetchReadyStatuses(selectedActivityId);
    else setReadyByParticipantId({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedActivityId]);

  const fetchActivities = async () => {
    setLoadingActivities(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${FUNCTIONS_BASE}/activities`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to fetch activities (${res.status})`);

      if (data.success && Array.isArray(data.activities)) {
        setActivities(data.activities);
        if (!selectedActivityId && data.activities.length > 0) {
          setSelectedActivityId(data.activities[0].id);
        }
      } else {
        throw new Error("Unexpected activities response.");
      }
    } catch (e: any) {
      console.error("Error fetching activities:", e);
      setErrorMsg(e?.message || "Error fetching activities.");
    } finally {
      setLoadingActivities(false);
    }
  };

  const fetchParticipants = async () => {
    setLoadingParticipants(true);
    setErrorMsg("");
    try {
      const res = await fetch(`${FUNCTIONS_BASE}/participants`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to fetch participants (${res.status})`);

      if (data.success && Array.isArray(data.participants)) {
        setParticipants(data.participants);
      } else {
        throw new Error("Unexpected participants response.");
      }
    } catch (e: any) {
      console.error("Error fetching participants:", e);
      setErrorMsg(e?.message || "Error fetching participants.");
    } finally {
      setLoadingParticipants(false);
    }
  };

  const fetchReadyStatuses = async (activityId: string) => {
    setLoadingStatuses(true);
    setErrorMsg("");
    try {
      const res = await fetch(
        `${FUNCTIONS_BASE}/ready-status?activityId=${encodeURIComponent(activityId)}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to fetch readiness (${res.status})`);

      const map: Record<string, boolean> = {};
      if (data.success && Array.isArray(data.statuses)) {
        data.statuses.forEach((s: ReadyStatus) => {
          // We want keys to be participant IDs ("Pearl_15").
          // If your edge fn returns "Pearl 15", normalize to "Pearl_15".
          const participantId = String(s.pearlName).includes("_")
            ? String(s.pearlName)
            : String(s.pearlName).replace(" ", "_");

          map[participantId] = !!s.isReady;
        });
      }
      setReadyByParticipantId(map);
    } catch (e: any) {
      console.error("Error fetching readiness:", e);
      setErrorMsg(e?.message || "Error fetching readiness.");
    } finally {
      setLoadingStatuses(false);
    }
  };

  const toggleReady = async (participant: Participant) => {
    if (!selectedActivityId) {
      alert("Select an activity first.");
      return;
    }

    const newStatus = !readyByParticipantId[participant.id];
    setLoading(true);
    setErrorMsg("");

    try {
      // This assumes your edge function POST expects: { activityId, pearlName, isReady }
      // and it converts pearlName ("Pearl 15") to participant_id ("Pearl_15") internally.
      const res = await fetch(`${FUNCTIONS_BASE}/ready-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          activityId: selectedActivityId,
          pearlName: participant.name, // send display name
          isReady: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Failed to update readiness (${res.status})`);

      if (data.success) {
        setReadyByParticipantId((prev) => ({ ...prev, [participant.id]: newStatus }));
      } else {
        throw new Error("Update failed.");
      }
    } catch (e: any) {
      console.error("Error updating readiness:", e);
      alert("Failed to update status. Please try again.");
      setErrorMsg(e?.message || "Error updating readiness.");
    } finally {
      setLoading(false);
    }
  };

  const totalCount = participants.length;
  const readyCount = participants.filter((p) => readyByParticipantId[p.id]).length;

  const activityLabel = selectedActivity
    ? `${selectedActivity.day ? `${selectedActivity.day} • ` : ""}${
        selectedActivity.time ? `${selectedActivity.time} • ` : ""
      }${selectedActivity.title}${selectedActivity.location ? ` • ${selectedActivity.location}` : ""}`
    : "Choose an activity to track readiness";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 py-8 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="glitter-effect"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white hover:text-green-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-4">
            <Sparkles className="w-12 h-12 text-white" />
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl text-white" style={{ fontFamily: "'Rye', serif" }}>
                Who&apos;s Ready? 🤠✨
              </h1>
              <p className="text-white/90 text-lg mt-2">
                {selectedActivity
                  ? `${readyCount} of ${totalCount || 0} Pearls are ready for ${selectedActivity.title}!`
                  : `${readyCount} of ${totalCount || 0} Pearls are ready!`}
              </p>
              <p className="text-white/80 mt-1">
                <span className="font-semibold">Tracking:</span> {activityLabel}
              </p>
            </div>

            <button
              onClick={() => selectedActivityId && fetchReadyStatuses(selectedActivityId)}
              disabled={!selectedActivityId || loadingStatuses}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
              title="Refresh readiness"
            >
              <RefreshCw className={`w-4 h-4 ${loadingStatuses ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-pink-100 to-green-100 rounded-xl p-6 mb-8 text-center">
          <p className="text-gray-800 text-lg">
            Pick an activity, then mark yourself ready when you&apos;re ready to leave the Airbnb.
            Once enough Pearls are ready… book the Uber! 🚗💨
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mb-6">
            {errorMsg}
          </div>
        )}

        {/* Select Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <label className="block text-lg mb-4 text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Select Activity:
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-pink-300 rounded-xl text-lg focus:outline-none focus:border-green-500"
              disabled={loadingActivities}
            >
              <option value="">
                {loadingActivities ? "Loading activities..." : "Choose an activity..."}
              </option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {(a.day ? `${a.day} • ` : "") + (a.time ? `${a.time} • ` : "") + a.title}
                </option>
              ))}
            </select>

            <button
              onClick={fetchActivities}
              disabled={loadingActivities}
              className="px-5 py-3 rounded-xl border-2 border-green-300 text-green-700 hover:bg-green-50 transition disabled:opacity-50"
            >
              {loadingActivities ? "Refreshing..." : "Refresh Activities"}
            </button>
          </div>
        </div>

        {/* Select Your Name */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <label className="block text-lg mb-4 text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Select Your Name:
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={selectedParticipantId}
              onChange={(e) => setSelectedParticipantId(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-pink-300 rounded-xl text-lg focus:outline-none focus:border-green-500"
              disabled={loadingParticipants}
            >
              <option value="">
                {loadingParticipants ? "Loading participants..." : "Choose your name..."}
              </option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={fetchParticipants}
              disabled={loadingParticipants}
              className="px-5 py-3 rounded-xl border-2 border-green-300 text-green-700 hover:bg-green-50 transition disabled:opacity-50"
            >
              {loadingParticipants ? "Refreshing..." : "Refresh Names"}
            </button>
          </div>

          {selectedParticipantId && selectedActivityId && (
            <p className="text-gray-600 mt-3">
              You&apos;re updating readiness for{" "}
              <span className="font-semibold">
                {participants.find((p) => p.id === selectedParticipantId)?.name ?? "your name"}
              </span>{" "}
              for <span className="font-semibold">{selectedActivity?.title ?? "this activity"}</span>.
            </p>
          )}
        </div>

        {/* Ready Status Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map((p) => {
            const isReady = readyByParticipantId[p.id] || false;
            const isCurrent = p.id === selectedParticipantId;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-xl p-6 shadow-md transition-all ${isCurrent ? "ring-4 ring-pink-400" : ""}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-800">{p.name}</span>
                  {isReady ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <Circle className="w-8 h-8 text-gray-300" />
                  )}
                </div>

                {isCurrent ? (
                  <button
                    onClick={() => toggleReady(p)}
                    disabled={loading || !selectedActivityId}
                    className={`w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 ${
                      isReady
                        ? "bg-gray-200 hover:bg-gray-300 text-gray-700"
                        : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    }`}
                  >
                    {!selectedActivityId
                      ? "Select an activity first"
                      : loading
                      ? "Updating..."
                      : isReady
                      ? "I'm not ready yet"
                      : "I'm ready!"}
                  </button>
                ) : (
                  <div className="text-center py-3 text-gray-500">
                    {isReady ? "✓ Ready!" : "Not ready yet"}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl mb-4 text-center text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Activity Progress
          </h3>

          <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-500 to-green-500 transition-all duration-500"
              style={{
                width: `${totalCount ? (readyCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>

          <p className="text-center mt-4 text-lg text-gray-700">
            {totalCount === 0
              ? "No participants found yet."
              : readyCount === totalCount
              ? "🎉 Everyone is ready! Book the Uber!"
              : `${totalCount - readyCount} more Pearls to go!`}
          </p>
        </div>
      </div>
    </div>
  );
}