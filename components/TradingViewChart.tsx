import { useEffect, useRef } from "react";

export default function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadWidget = () => {
      if (typeof window.TradingView === "undefined") {
        setTimeout(loadWidget, 500);
        return;
      }

      new window.TradingView.widget({
        width: "100%",
        height: 400,
        symbol: "NASDAQ:AAPL", // ✅ Confirmed working
        interval: "15",
        timezone: "Asia/Kolkata",
        theme: "light",
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        hide_top_toolbar: false,
        save_image: false,
        container_id: "tradingview_chart_container",
      });
    };

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = loadWidget;

    document.head.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div id="tradingview_chart_container" ref={containerRef} className="w-full h-[400px]" />;
}
