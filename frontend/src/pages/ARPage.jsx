import { useState, useEffect, useRef } from "react";
import ResultComponent from "./ResultComponent";
import { Camera, RefreshCw, Upload } from "lucide-react";

const API_BASE = "http://localhost:8000";

const T = {
  en: {
    navTitle: "Taxila Museum", navSub: "Artifact Recognition",
    camHint: "Frame the artifact inside the box\nthen press the shutter",
    lblGallery: "Gallery", lblSaved: "Saved",
    lblListen: "Listen", lblSave: "Save",
    lblAbout: "About this artifact",
    lblMaterial: "Material", lblOrigin: "Origin", lblDate: "Date", lblReligion: "Religion",
    voiceBarTitle: "Listen in English", voiceBarSub: "Tap to hear the story",
    fbQuestion: "Was this the correct artifact?", fbYes: "✓ Yes", fbNo: "✗ No",
    btnScanAgain: "📷 Scan Another",
    lblFavHeader: "Saved Artifacts", tabScan: "Scan", tabFav: "Saved",
    overlayText: "Analysing artifact…",
    noCamText: "Camera not available. Use gallery to upload a photo.",
    emptyFav: "No saved artifacts yet.",
    offlineToast: "Offline — using cached data",
    feedbackThanks: "Thanks for the feedback!",
    notArtifact: "This doesn't look like a museum artifact. Point at an exhibit.",
    matchLabel: (c) => `${c}% match`,
  },
  ur: {
    navTitle: "ٹیکسلا میوزیم", navSub: "نمونہ شناخت",
    camHint: "نمونہ فریم کے اندر رکھیں\nپھر شٹر دبائیں",
    lblGallery: "گیلری", lblSaved: "محفوظ",
    lblListen: "سنیں", lblSave: "محفوظ کریں",
    lblAbout: "اس نمونے کے بارے میں",
    lblMaterial: "مواد", lblOrigin: "مقام", lblDate: "تاریخ", lblReligion: "مذہب",
    voiceBarTitle: "اردو میں سنیں", voiceBarSub: "نمونے کی کہانی سننے کے لیے دبائیں",
    fbQuestion: "کیا یہ صحیح نمونہ تھا؟", fbYes: "✓ ہاں", fbNo: "✗ نہیں",
    btnScanAgain: "📷 دوبارہ اسکین کریں",
    lblFavHeader: "محفوظ نمونے", tabScan: "اسکین", tabFav: "محفوظ",
    langBtn: "English",
    overlayText: "نمونہ تجزیہ ہو رہا ہے…",
    noCamText: "کیمرہ دستیاب نہیں۔ گیلری استعمال کریں۔",
    emptyFav: "ابھی تک کوئی محفوظ نمونہ نہیں۔",
    offlineToast: "آف لائن — کیشڈ ڈیٹا استعمال ہو رہا ہے",
    feedbackThanks: "آپ کے تاثرات کا شکریہ!",
    notArtifact: "یہ میوزیم کا نمونہ نہیں لگتا۔ کسی نمونے کی طرف کیمرہ کریں۔",
    matchLabel: (c) => `${c}% ملاپ`,
  },
};

export default function ARPage() {
  const [lang, setLang]                   = useState("en");
  const [tab, setTab]                     = useState("camera");
  const [analysing, setAnalysing]         = useState(false);
  const [artifact, setArtifact]           = useState(null);
  const [confidence, setConfidence]       = useState(0);
  const [favorites, setFavorites]         = useState(() =>
    JSON.parse(localStorage.getItem("taxila_favs") || "[]")
  );
  const [toast, setToast]                 = useState("");
  const [isPlaying, setIsPlaying]         = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [feedbackDone, setFeedbackDone]   = useState(false);
  const [preview, setPreview]             = useState(null);
  const [facingMode, setFacingMode]       = useState("environment");

  const videoRef  = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const speechRef = useRef(null);
  const progRef   = useRef(null);
  const fileRef   = useRef(null);

  const t = (key, ...args) => {
    const v = T[lang][key];
    return typeof v === "function" ? v(...args) : (v ?? "");
  };

  // ── Camera startup ───────────────────────────────────────────────────────
  useEffect(() => {
    async function startCam() {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
        setCameraAvailable(true);
      } catch (err) {
        console.error("Camera error:", err);
        setCameraAvailable(false);
      }
    }
    startCam();
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [facingMode]);

  // ── Pre-fetch artifact list for offline cache ────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/ar/artifacts`)
      .then((r) => r.json())
      .then((d) => localStorage.setItem("artifacts_cache", JSON.stringify(d)))
      .catch(() => {});
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const showToast = (msg, ms = 3000) => {
    setToast(msg);
    setTimeout(() => setToast(""), ms);
  };

  function flipCamera() {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  }

  // ── Capture from video stream ────────────────────────────────────────────
  function capturePhoto() {
    const video  = videoRef.current;
    const canvas = canvasRef.current;

    // Fall back to file picker if camera isn't ready
    if (!streamRef.current || !video || video.readyState < 2) {
      fileRef.current?.click();
      return;
    }

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setPreview(canvas.toDataURL("image/jpeg", 0.92));
    canvas.toBlob((blob) => sendToAPI(blob), "image/jpeg", 0.92);
  }

  // ── Upload from gallery / file picker ───────────────────────────────────
  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    sendToAPI(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  // ── Send image to backend ────────────────────────────────────────────────
  async function sendToAPI(blob) {
    setAnalysing(true);
    stopVoice();

    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");

    try {
      // Offline fallback
      if (!navigator.onLine) {
        showToast(t("offlineToast"));
        const cached = JSON.parse(localStorage.getItem("artifacts_cache") || "[]");
        if (cached.length) {
          const pick = cached[Math.floor(Math.random() * cached.length)];
          setArtifact(pick);
          setConfidence(78);
          setFeedbackDone(false);
          setTab("result");
        }
        setAnalysing(false);
        return;
      }

      const res = await fetch(`${API_BASE}/ar/match`, { method: "POST", body: formData });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setAnalysing(false);

      if (!data.recognized) {
        showToast(data.message || t("notArtifact"), 4000);
        setPreview(null);
        return;
      }

      const meta = data.meta || {};
      let matchedCandidate = null;
      let conf = 0;

      if (data.candidates?.length > 0) {
        const sorted = [...data.candidates].sort((a, b) => b.confidence - a.confidence);
        matchedCandidate = sorted[0];
        conf = matchedCandidate.confidence;
      } else if (data.match) {
        matchedCandidate = data.match;
        conf = data.match.confidence || 0;
      }

      const confPct = conf <= 1 ? Math.round(conf * 100) : Math.round(conf);

      setArtifact({
        id:        matchedCandidate?.artifact_id || data.match?.artifact_id,
        title:     meta.title    || "Unknown Artifact",
        section:   meta.section  || "",
        story:     meta.story    || "No description available.",
        image:     meta.image    || null,
        extra:     meta.extra    || {},
        titleUr:   meta.titleUr,
        sectionUr: meta.sectionUr,
        storyUr:   meta.storyUr,
      });
      setConfidence(confPct);
      setFeedbackDone(false);
      setTab("result");

    } catch (err) {
      setAnalysing(false);
      showToast(`Error: ${err.message}`);
      setPreview(null);
    }
  }

  // ── Voice playback ───────────────────────────────────────────────────────
  function toggleVoice() {
    if (isPlaying) { stopVoice(); return; }
    const text = lang === "ur" ? (artifact?.storyUr || artifact?.story) : artifact?.story;
    if (!text || !window.speechSynthesis) return;

    const utt  = new SpeechSynthesisUtterance(text);
    utt.lang   = lang === "ur" ? "ur-PK" : "en-US";
    utt.rate   = 0.9;
    utt.onend  = stopVoice;
    speechRef.current = utt;
    speechSynthesis.speak(utt);
    setIsPlaying(true);
    setVoiceProgress(0);

    let p = 0;
    progRef.current = setInterval(() => {
      p = Math.min(p + 1, 99);
      setVoiceProgress(p);
    }, 300);
  }

  function stopVoice() {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    clearInterval(progRef.current);
    setIsPlaying(false);
    setVoiceProgress(0);
  }

  // ── Favourites ───────────────────────────────────────────────────────────
  function toggleFav() {
    if (!artifact) return;
    const exists  = favorites.some((f) => f.id === artifact.id);
    const updated = exists
      ? favorites.filter((f) => f.id !== artifact.id)
      : [...favorites, artifact];
    setFavorites(updated);
    localStorage.setItem("taxila_favs", JSON.stringify(updated));
  }

  function removeFav(id) {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("taxila_favs", JSON.stringify(updated));
  }

  // ── Feedback ─────────────────────────────────────────────────────────────
  async function sendFeedback(confirmed) {
    setFeedbackDone(true);
    showToast(t("feedbackThanks"));
    try {
      await fetch(`${API_BASE}/ar/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          predicted_id: artifact.id,
          correct_id:   confirmed ? null : "",
          confidence,
          confirmed,
        }),
      });
    } catch { /* ignore network errors for feedback */ }
  }

  const isFav = artifact && favorites.some((f) => f.id === artifact.id);
  const isUr  = lang === "ur";

  // ── Styles ───────────────────────────────────────────────────────────────
  const css = {
    root: {
      height: "calc(100vh - 90px)", width: "100vw", display: "flex",
      flexDirection: "column", background: "#f5f5f5", color: "#f5f5f5",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      overflow: "hidden",
    },
    cameraWrap: {
      position: "relative", flex: 1, background: "#111",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
    },
    video: {
      width: "100%", height: "100%", objectFit: "cover", display: "block",
      transform: facingMode === "user" ? "scaleX(-1)" : "none",
    },
    camUI: {
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", pointerEvents: "none",
    },
    scanBox: { width: "min(260px, 60vw)", height: "min(260px, 60vw)", position: "relative" },
    camHint: {
      color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 24,
      textAlign: "center", lineHeight: 1.5, textShadow: "0 2px 4px rgba(0,0,0,0.8)",
      whiteSpace: "pre-line",
    },
    overlay: {
      position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 16, zIndex: 20,
    },
    spinner: {
      width: 44, height: 44, border: "3px solid rgba(255,255,255,0.15)",
      borderTopColor: "#D97706", borderRadius: "50%",
      animation: "spin 0.75s linear infinite",
    },
    shutterBar: {
      display: "flex", alignItems: "center", justifyContent: "space-around",
      padding: "10px 12px 14px", background: "#ffffff",
      borderTop: "1px solid #e5e7eb", flexShrink: 0,
    },
    shutter: {
      width: 64, height: 64, borderRadius: "50%", background: "#ffffff",
      border: "3px solid #d97706", cursor: "pointer", display: "flex",
      alignItems: "center", justifyContent: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)", flexShrink: 0,
    },
    sideBtn: {
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 4, cursor: "pointer", background: "none", border: "none",
      color: "#6b7280", fontSize: 11, padding: 8, borderRadius: 10,
      minWidth: 56,
    },
    resultWrap:    { flex: 1, overflowY: "auto", paddingBottom: 40 },
    resultHero:    { background: "linear-gradient(160deg, #451a03 0%, #f4ebe5 100%)", padding: "24px 20px", display: "flex", gap: 18, alignItems: "center" },
    resultThumb:   { width: 84, height: 84, borderRadius: 14, background: "rgba(255,255,255,0.08)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, overflow: "hidden" },
    resultSection: { fontSize: 11, fontWeight: 700, color: "#D97706", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 },
    resultTitle:   { fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 10 },
    confRow:       { display: "flex", alignItems: "center", gap: 10 },
    confBar:       { flex: 1, height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 4, overflow: "hidden" },
    confFill:      { height: "100%", borderRadius: 4, background: "#D97706", transition: "width 0.6s ease" },
    confLabel:     { fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 },
    actionRow:     { display: "flex", gap: 12, padding: "16px 20px" },
    actionBtn:     { flex: 1, padding: "12px 8px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#f5f5f5", fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 },
    actionBtnActive: { background: "rgba(217,119,6,0.15)", borderColor: "#D97706", color: "#D97706" },
    card:          { margin: "0 20px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 18 },
    cardLabel:     { fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 },
    storyText:     { fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.85)" },
    voiceBar:      { margin: "0 20px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px", display: "flex", alignItems: "center", gap: 14 },
    voicePlay:     { width: 44, height: 44, borderRadius: "50%", background: "#D97706", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#fff", flexShrink: 0 },
    voiceInfo:     { flex: 1 },
    voiceProg:     { height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4, marginTop: 10, overflow: "hidden" },
    voiceProgFill: { height: "100%", background: "#D97706", borderRadius: 4 },
    metaGrid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "0 20px 16px" },
    metaCard:      { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px" },
    metaLbl:       { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4 },
    metaVal:       { fontSize: 14, fontWeight: 600, color: "#f5f5f5" },
    feedbackRow:   { margin: "0 20px 16px", background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.25)", borderRadius: 16, padding: "14px", display: "flex", alignItems: "center", gap: 12, fontSize: 13 },
    fbCorrect:     { background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "#f5f5f5", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 500 },
    fbWrong:       { background: "none", border: "1px solid rgba(239,68,68,0.4)", color: "#f87171", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontWeight: 500 },
    scanAgain:     { margin: "4px 20px 0", width: "calc(100% - 40px)", padding: 15, borderRadius: 16, background: "#D97706", border: "none", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(217,119,6,0.3)" },
    favHeader:     { padding: "18px 20px", fontSize: 16, fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.08)" },
    favList:       { flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 },
    favItem:       { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer" },
    favThumb:      { width: 52, height: 52, borderRadius: 12, background: "rgba(217,119,6,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, color: "#D97706" },
    favDel:        { background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 18, padding: 4 },
    empty:         { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "80px 24px", color: "rgba(255,255,255,0.4)" },
    toast:         { position: "fixed", bottom: 84, left: "50%", transform: "translateX(-50%)", background: "#D97706", color: "#fff", fontSize: 13, padding: "8px 20px", borderRadius: 24, zIndex: 999, whiteSpace: "nowrap" },
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={css.root}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scan { 0%,100%{top:0} 50%{top:calc(100% - 2px)} }
        .corner { position:absolute;width:24px;height:24px;border-color:#D97706;border-style:solid;border-radius:2px; }
        .corner.tl { top:0;left:0;border-width:3px 0 0 3px; }
        .corner.tr { top:0;right:0;border-width:3px 3px 0 0; }
        .corner.bl { bottom:0;left:0;border-width:0 0 3px 3px; }
        .corner.br { bottom:0;right:0;border-width:0 3px 3px 0; }
        .scan-line { position:absolute;width:100%;height:2px;background:linear-gradient(90deg,transparent,#D97706,transparent);animation:scan 2s ease-in-out infinite;top:0; }
        button:active { opacity: 0.75; }
      `}</style>

      {/* ── CAMERA TAB ── */}
      {tab === "camera" && (
        <>
          <div style={css.cameraWrap}>
            <video ref={videoRef} style={css.video} autoPlay playsInline muted />
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* Hidden file input — required for gallery upload */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />

            {/* Preview snapshot */}
            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 5 }}
              />
            )}

            {/* Scan frame overlay */}
            {!preview && cameraAvailable && (
              <div style={css.camUI}>
                <div style={css.scanBox}>
                  <div className="corner tl" /><div className="corner tr" />
                  <div className="corner bl" /><div className="corner br" />
                  <div className="scan-line" />
                </div>
                <p style={css.camHint}>{t("camHint")}</p>
              </div>
            )}

            {/* No camera message */}
            {!cameraAvailable && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40, flex: 1, textAlign: "center" }}>
                <span style={{ fontSize: 56, opacity: 0.3 }}>📷</span>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>{t("noCamText")}</p>
              </div>
            )}

            {/* Analysing overlay */}
            {analysing && (
              <div style={css.overlay}>
                <div style={css.spinner} />
                <p style={{ fontWeight: 500, letterSpacing: "0.02em" }}>{t("overlayText")}</p>
              </div>
            )}
          </div>

          {/* Shutter bar */}
          <div style={css.shutterBar}>
            {/* Gallery / upload button */}
            <button
              style={css.sideBtn}
              onClick={() => fileRef.current?.click()}
              aria-label="Upload from gallery"
            >
              <Upload size={22} color="#6b7280" />
              <span>{t("lblGallery")}</span>
            </button>

            {/* Shutter / capture button */}
            <button
              style={{
                ...css.shutter,
                opacity: analysing ? 0.5 : 1,
                cursor: analysing ? "not-allowed" : "pointer",
              }}
              onClick={capturePhoto}
              disabled={analysing}
              aria-label="Capture photo"
            >
              <Camera size={26} color="#d97706" />
            </button>

            {/* Flip camera button */}
            <button
              style={{
                ...css.sideBtn,
                opacity: cameraAvailable ? 1 : 0.4,
                cursor: cameraAvailable ? "pointer" : "not-allowed",
              }}
              onClick={flipCamera}
              disabled={!cameraAvailable}
              aria-label="Flip camera"
            >
              <RefreshCw size={22} color="#6b7280" />
              <span>Flip</span>
            </button>
          </div>
        </>
      )}

      {/* ── RESULT TAB ── */}
      {tab === "result" && artifact && (
        <ResultComponent
          artifact={artifact}
          confidence={confidence}
          isUr={isUr}
          isPlaying={isPlaying}
          voiceProgress={voiceProgress}
          feedbackDone={feedbackDone}
          t={t}
          API_BASE={API_BASE}
          toggleVoice={toggleVoice}
          sendFeedback={sendFeedback}
          setTab={setTab}
          setPreview={setPreview}
          stopVoice={stopVoice}
          css={css}
          capturedImage={preview}
        />
      )}

      {/* ── FAVOURITES TAB ── */}
      {tab === "favorites" && (
        <>
          <div style={css.favHeader}>{t("lblFavHeader")}</div>
          <div style={css.favList}>
            {favorites.length === 0 ? (
              <div style={css.empty}>
                <span style={{ fontSize: 44, opacity: 0.3 }}>🤍</span>
                <span>{t("emptyFav")}</span>
              </div>
            ) : (
              favorites.map((a) => (
                <div
                  key={a.id}
                  style={css.favItem}
                  onClick={() => {
                    setArtifact(a);
                    setConfidence(100);
                    setFeedbackDone(false);
                    setTab("result");
                  }}
                >
                  <div style={css.favThumb}>🏛️</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>
                      {isUr ? (a.titleUr || a.title) : a.title}
                    </p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
                      {isUr ? (a.sectionUr || a.section) : a.section}
                    </p>
                  </div>
                  <button
                    style={css.favDel}
                    onClick={(e) => { e.stopPropagation(); removeFav(a.id); }}
                    aria-label="Remove from saved"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ── TOAST ── */}
      {toast && <div style={css.toast}>{toast}</div>}
    </div>
  );
}