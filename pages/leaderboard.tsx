import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LeaderboardEntry {
  uid: string;
  total_trades: number;
  total_pnl: number;
  avg_pnl: number;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("leaderboard_view").select("*");

      if (data) {
        setEntries(data.slice(0, 10)); // Top 10
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🏆 Leaderboard</h1>
      <table className="w-full text-sm border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">#</th>
            <th>User</th>
            <th>Total Trades</th>
            <th>Total PnL</th>
            <th>Avg PnL</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={entry.uid} className="border-t text-center">
              <td>{i + 1}</td>
              <td>{entry.uid.slice(0, 5)}...👤</td>
              <td>{entry.total_trades}</td>
              <td className={entry.total_pnl >= 0 ? "text-green-600" : "text-red-600"}>
                ₹{entry.total_pnl.toFixed(2)}
              </td>
              <td className={entry.avg_pnl >= 0 ? "text-green-600" : "text-red-600"}>
                ₹{entry.avg_pnl.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
