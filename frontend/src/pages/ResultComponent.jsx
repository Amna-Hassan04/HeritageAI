import React from "react";

export default function ResultComponent({
  artifact,
  confidence,
  isUr,
  isPlaying,
  voiceProgress,
  feedbackDone,
  t,
  API_BASE,
  toggleVoice,
  sendFeedback,
  setTab,
  setPreview,
  stopVoice,
}) {
  return (
    <div style={styles.wrap}>

      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.headerText}>
            <p style={styles.section}>
              {isUr ? artifact.sectionUr || artifact.section : artifact.section}
            </p>
            <h2 style={styles.title}>
              {isUr ? artifact.titleUr || artifact.title : artifact.title}
            </h2>
            {/* <div style={styles.confRow}>
              <div style={styles.confTrack}>
                <div style={{ ...styles.confFill, width: `${confidence}%` }} />
              </div>
              <span style={styles.confLabel}>{t("matchLabel", confidence)}</span>
            </div> */}
          </div>

          {/* Play button — right side of header */}
          <button style={styles.playBtnHero} onClick={toggleVoice} aria-label={isPlaying ? "Pause" : "Play"}>
            <span style={{ fontSize: 20 }}>{isPlaying ? "⏸" : "▶"}</span>
          </button>
        </div>
      </div>

      {/* ── VOICE PROGRESS BAR ───────────────────────────────────────────── */}
      {isPlaying && (
        <div style={styles.progBarWrap}>
          <div style={styles.progTrack}>
            <div style={{ ...styles.progFill, width: `${voiceProgress}%` }} />
          </div>
          <span style={styles.progLabel}>{t("voiceBarSub")}</span>
        </div>
      )}

      {/* ── ABOUT CARD ───────────────────────────────────────────────────── */}
      <div style={styles.card}>
        <p style={styles.cardLabel}>{t("lblAbout")}</p>
        <p style={styles.storyText}>
          {isUr ? artifact.storyUr || artifact.story : artifact.story}
        </p>
      </div>

      {/* ── META GRID ────────────────────────────────────────────────────── */}
      <div style={styles.metaGrid}>
        {[
          ["lblMaterial", artifact.extra?.material,  artifact.extra?.materialUr],
          ["lblOrigin",   artifact.extra?.origin,    artifact.extra?.originUr],
          ["lblDate",     artifact.extra?.date,      artifact.extra?.dateUr],
          ["lblReligion", artifact.extra?.religion,  artifact.extra?.religionUr],
        ].map(([key, en, ur]) => (
          <div key={key} style={styles.metaCard}>
            <p style={styles.metaLbl}>{t(key)}</p>
            <p style={styles.metaVal}>{(isUr ? ur : en) || "—"}</p>
          </div>
        ))}
      </div>

      {/* ── FEEDBACK ─────────────────────────────────────────────────────── */}
      {!feedbackDone && (
        <div style={styles.feedbackRow}>
          <span style={{ fontSize: 18 }}>🤔</span>
          <span style={styles.fbQuestion}>{t("fbQuestion")}</span>
          <button style={styles.fbYes} onClick={() => sendFeedback(true)}>{t("fbYes")}</button>
          <button style={styles.fbNo}  onClick={() => sendFeedback(false)}>{t("fbNo")}</button>
        </div>
      )}

      {/* ── SCAN AGAIN ───────────────────────────────────────────────────── */}
      <button
        style={styles.scanAgain}
        onClick={() => { setTab("camera"); setPreview(null); stopVoice(); }}
      >
        {t("btnScanAgain")}
      </button>
    </div>
  );
}

const AMBER        = "#D97706";
const AMBER_DARK   = "#B45309";
const TEXT_PRIMARY   = "#1C1917";
const TEXT_SECONDARY = "#78716C";
const BORDER       = "#E7E5E4";

const styles = {
  wrap: {
    flex: 1,
    overflowY: "auto",
    background: "#FAFAF9",
    color: TEXT_PRIMARY,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    paddingBottom: 40,
  },

  // Header — clean white with amber left border accent
  header: {
    background: "#ffffff",
    borderBottom: `1px solid ${BORDER}`,
    borderLeft: `5px solid ${AMBER}`,
    padding: "20px 18px",
  },
  headerInner: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  headerText: { flex: 1 },
  section: {
    fontSize: 11,
    fontWeight: 700,
    color: AMBER,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    margin: "0 0 4px",
  },
  title: {
    fontSize: 21,
    fontWeight: 700,
    lineHeight: 1.25,
    margin: "0 0 14px",
    color: TEXT_PRIMARY,
  },
  confRow: { display: "flex", alignItems: "center", gap: 10 },
  confTrack: {
    flex: 1,
    height: 5,
    background: "#E7E5E4",
    borderRadius: 4,
    overflow: "hidden",
  },
  confFill: {
    height: "100%",
    borderRadius: 4,
    background: AMBER,
    transition: "width 0.6s ease",
  },
  confLabel: { fontSize: 12, color: TEXT_SECONDARY, fontWeight: 600, whiteSpace: "nowrap" },

  // Play button in header — right side
  playBtnHero: {
    width: 54,
    height: 54,
    borderRadius: "50%",
    background: AMBER,
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    flexShrink: 0,
    boxShadow: "0 3px 10px rgba(217,119,6,0.4)",
  },

  // Progress bar shown only while playing
  progBarWrap: {
    margin: "0 18px",
    padding: "10px 0 4px",
  },
  progTrack: {
    height: 4,
    background: "#E7E5E4",
    borderRadius: 4,
    overflow: "hidden",
  },
  progFill: {
    height: "100%",
    background: AMBER,
    borderRadius: 4,
    transition: "width 0.3s",
  },
  progLabel: {
    fontSize: 11,
    color: TEXT_SECONDARY,
    marginTop: 6,
    display: "block",
  },

  // About card
  card: {
    margin: "14px 16px 0",
    background: "#ffffff",
    border: `1px solid ${BORDER}`,
    borderLeft: `4px solid ${AMBER}`,
    borderRadius: 16,
    padding: 18,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: AMBER,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    margin: "0 0 10px",
  },
  storyText: { fontSize: 14, lineHeight: 1.8, color: TEXT_PRIMARY, margin: 0 },

  // Meta grid
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
    margin: "12px 16px 0",
  },
  metaCard: {
    background: "#ffffff",
    border: `1px solid ${BORDER}`,
    borderRadius: 14,
    padding: "12px 14px",
  },
  metaLbl: {
    fontSize: 11,
    color: AMBER,
    fontWeight: 700,
    margin: "0 0 4px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  metaVal: { fontSize: 14, fontWeight: 600, color: TEXT_PRIMARY, margin: 0 },

  // Feedback
  feedbackRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "12px 16px 0",
    background: "#FFFBEB",
    border: `1px solid #FDE68A`,
    borderRadius: 16,
    padding: "12px 14px",
    fontSize: 13,
  },
  fbQuestion: { flex: 1, color: TEXT_PRIMARY, fontWeight: 500 },
  fbYes: {
    background: AMBER,
    border: "none",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
  },
  fbNo: {
    background: "#fff",
    border: "1px solid #FCA5A5",
    color: "#DC2626",
    padding: "6px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
  },

  // Scan again
  scanAgain: {
    display: "block",
    margin: "16px 16px 0",
    width: "calc(100% - 32px)",
    padding: 15,
    borderRadius: 16,
    background: AMBER,
    border: "none",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(217,119,6,0.35)",
  },
};