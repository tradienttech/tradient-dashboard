import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TradeHistory({ user, refresh }: { user: any; refresh: boolean }) {
  const [trades, setTrades] = useState<any[]>([]);

 useEffect(() => {
  const fetchTrades = async () => {
    const uid = user?.uid || user?.id || user?.sub;

    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .eq("uid", uid)
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("❌ Failed to fetch trades:", error.message);
    } else {
      setTrades(data || []);
    }
  };

  if (user) fetchTrades(); // ✅ Ensure user exists
}, [refresh, user]); // ✅ Add `refresh` and `user` both as dependencies


  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📊 Trade History</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Symbol</th>
              <th className="p-2 text-left">Strategy</th>
              <th className="p-2 text-left">Entry</th>
              <th className="p-2 text-left">Exit</th>
              <th className="p-2 text-left">PnL</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={trade.id || index} className="border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{trade.symbol}</td>
                <td className="p-2">{trade.strategy || "—"}</td>
                <td className="p-2">{trade.entry_price}</td>
                <td className="p-2">{trade.exit_price}</td>
                <td
                  className={`p-2 ${
                    trade.pnl >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{trade.pnl?.toFixed(2)}
                </td>
                <td className="p-2">
                  {new Date(trade.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {trades.length === 0 && (
          <p className="mt-4 text-center text-gray-500">
            You have not saved any trades yet.
          </p>
        )}
      </div>
    </div>
  );
}
