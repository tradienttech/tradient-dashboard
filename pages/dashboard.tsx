import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "../lib/firebase"; // ✅ Make sure firebase.ts is correct
import TradingViewChart from "../components/TradingViewChart";
import TradeForm from "../components/TradeForm";
import TradeHistory from "../components/TradeHistory";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [refreshFlag, setRefreshFlag] = useState(false); // 🔁 For re-fetching trade history

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
      } else {
        setUser(firebaseUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const triggerRefresh = () => {
    setRefreshFlag((prev) => !prev); // 🔄 Toggle to re-trigger fetch
  };

  if (!user) return <div className="p-4">🔐 Checking authentication...</div>;

  return (
    <>
      <Head>
        <title>Dashboard | Tradient</title>
      </Head>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">📈 Welcome, {user.email}</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 📊 TradingView Chart */}
          <div className="bg-white p-4 rounded shadow">
            <TradingViewChart />
          </div>

          {/* 📝 Trade Input Form */}
          <div className="bg-white p-4 rounded shadow">
            <TradeForm user={user} onSave={triggerRefresh} />
          </div>
        </div>

        {/* 📜 Trade History */}
        <div className="mt-6 bg-white p-4 rounded shadow">
          <TradeHistory user={user} refresh={refreshFlag} />
        </div>
      </div>
    </>
  );
}
