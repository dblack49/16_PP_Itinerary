import { projectId, publicAnonKey } from '/utils/supabase/info';

export const PEARLS = [
  "Pearl 1", "Pearl 2", "Pearl 3", "Pearl 4",
  "Pearl 5", "Pearl 6", "Pearl 7", "Pearl 8",
  "Pearl 9", "Pearl 10", "Pearl 11", "Pearl 12",
  "Pearl 13", "Pearl 14", "Pearl 15", "Pearl 16"
];

export async function submitVote(
  category: string,
  pearlName: string,
  selections: string[]
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ce101b60/votes/${category}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          pearlName,
          selections
        })
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error submitting vote for ${category}:`, error);
    return { success: false, error: String(error) };
  }
}

export async function fetchVoteResults(
  category: string
): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ce101b60/results/${category}`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      }
    );
    const data = await response.json();
    
    if (data.success && data.results) {
      return data.results;
    }
    return {};
  } catch (error) {
    console.error(`Error fetching results for ${category}:`, error);
    return {};
  }
}
