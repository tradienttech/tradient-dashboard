import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TradeForm({ user, onSave }: { user: any; onSave: () => void }) {
  const [symbol, setSymbol] = useState("NIFTY");
  const [strategy, setStrategy] = useState("Iron Fly");
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const entryNum = parseFloat(entryPrice);
    const exitNum = parseFloat(exitPrice);
    const pnl = exitNum - entryNum;

    const uid = user?.uid || user?.id || user?.sub;

    const { error } = await supabase.from("trades").insert([
      {
        uid,
        email: user.email,
        symbol,
        strategy,
        trade_type: "SIMULATED",
        entry_price: entryNum,
        exit_price: exitNum,
        pnl,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("❌ Trade Save Failed:", error.message);
      setMessage("❌ Failed to save trade.");
    } else {
      setMessage("✅ Trade saved!");
      setEntryPrice("");
      setExitPrice("");
      onSave(); // 🔁 Refresh TradeHistory
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📝 Record Trade</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Symbol</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option>NIFTY</option>
            <option>BANKNIFTY</option>
            <option>FINNIFTY</option>
            <option>SENSEX</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Strategy</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          >
            <option>Iron Fly</option>
            <option>Straddle</option>
            <option>Strangle</option>
            <option>Directional</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Entry Price</label>
          <input
            type="number"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Exit Price</label>
          <input
            type="number"
            value={exitPrice}
            onChange={(e) => setExitPrice(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          💾 Save Trade
        </button>

        {message && <p className="mt-2 text-sm">{message}</p>}
      </form>
    </div>
  );
}
