import { useState, useEffect } from "react";

export default function ARButton({ onOpen }) {
  const [pulse, setPulse]     = useState(true);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setPulse(true); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleClick = () => {
    setPulse(false);
    onOpen();
  };

  return (
    <div style={styles.wrapper}>
      {tooltip && <div style={styles.tooltip}>Scan Artifact</div>}
      {pulse && <div style={styles.pulseRing} />}
      <button
        style={styles.btn}
        onClick={handleClick}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        aria-label="Open AR artifact scanner"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <ellipse cx="12" cy="5.5" rx="3.2" ry="3.5" />
          <ellipse cx="12" cy="2.2" rx="1.5" ry="1.4" />
          <path d="M7 22 Q6 15 8 12 Q10 10 12 10 Q14 10 16 12 Q18 15 17 22 Z" />
          <ellipse cx="12" cy="17.5" rx="3.5" ry="1.5" opacity="0.6" />
        </svg>
        <span style={styles.label}>AR Scan</span>
      </button>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed", bottom: "28px", left: "24px",
    zIndex: 9999, display: "flex", alignItems: "center", gap: "10px",
  },
  btn: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: "4px", width: "64px", height: "64px",
    borderRadius: "50%", background: "linear-gradient(135deg, #26906e 0%, #0F6E56 100%)",
    border: "none", color: "#fff", cursor: "pointer",
    boxShadow: "0 4px 24px rgba(29,158,117,0.45), 0 1px 4px rgba(0,0,0,0.2)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
    position: "relative", zIndex: 1,
  },
  label: {
    fontSize: "8px", fontWeight: "600",
    letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1,
  },
  pulseRing: {
    position: "absolute", width: "64px", height: "64px",
    borderRadius: "50%", background: "rgba(29,158,117,0.35)",
    animation: "arPulse 2s ease-out infinite", zIndex: 0,
  },
  tooltip: {
    position: "absolute", left: "74px", bottom: "50%",
    transform: "translateY(50%)", background: "rgba(15,15,15,0.92)",
    color: "#fff", fontSize: "12px", fontWeight: "500",
    padding: "6px 12px", borderRadius: "8px", whiteSpace: "nowrap",
    pointerEvents: "none", backdropFilter: "blur(8px)",
    border: "0.5px solid rgba(255,255,255,0.1)",
  },
};

if (typeof document !== "undefined" && !document.getElementById("ar-btn-styles")) {
  const s = document.createElement("style");
  s.id = "ar-btn-styles";
  s.textContent = `
    @keyframes arPulse {
      0%   { transform: scale(1);   opacity: 0.7; }
      70%  { transform: scale(1.7); opacity: 0;   }
      100% { transform: scale(1.7); opacity: 0;   }
    }
  `;
  document.head.appendChild(s);
}