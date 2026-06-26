// src/components/CuratorResult.jsx
import React, { useState, useEffect } from "react";

import "../styles/curator.css";

const CuratorResult = ({ result }) => {
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [voices, setVoices] = useState([]);

  // Load available voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const v = synth.getVoices();
      if (v && v.length) setVoices(v);
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  // Stop speech when component unmounts or result changes
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [result]);

  const pickBestVoice = () => {
    if (!voices.length) return null;

    // Prefer high‑quality / neural / natural English voices if available
    const preferredKeywords = [
      "Natural",
      "Neural",
      "Online",
      "Google US English",
    ];

    for (const keyword of preferredKeywords) {
      const v = voices.find(
        (voice) =>
          voice.lang.toLowerCase().startsWith("en") &&
          voice.name.toLowerCase().includes(keyword.toLowerCase())
      );
      if (v) return v;
    }

    // Fallback: any English voice
    const english = voices.find((v) =>
      v.lang.toLowerCase().startsWith("en")
    );
    if (english) return english;

    // Last resort: first voice
    return voices[0];
  };

  const handleSpeak = (text, index) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Your browser does not support text-to-speech.");
      return;
    }

    const synth = window.speechSynthesis;

    // Clicking same card while speaking → stop
    if (speakingIndex === index && synth.speaking) {
      synth.cancel();
      setSpeakingIndex(null);
      return;
    }

    synth.cancel();

    const cleanText = text.replace(/^🔊\s*/, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Choose best available voice
    const voice = pickBestVoice();
    if (voice) utterance.voice = voice;

    // Fine‑tune sound (adjust if you like)
    utterance.lang = voice?.lang || "en-US";
    utterance.rate = 0.95;   // slightly slower
    utterance.pitch = 1.02;  // tiny bit higher
    utterance.volume = 1.0;

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    synth.speak(utterance);
  };

  if (!result || !result.interpretations?.length) return null;

  return (
    <div className="result-card">
      <h2 className="result-title">🧠 Curator’s Interpretation</h2>
      <p className="result-subtitle">
        Here are {result.interpretations.length} possible interpretations of your artifact:
      </p>

      <div className="result-grid">
        {result.interpretations.map((item, i) => (
          <div className="interpretation-card" key={i}>
            <div className="interpretation-header">
              <span className="interpretation-index">#{i + 1}</span>
              <h3>{item.title}</h3>
            </div>

            <div className="interpretation-description-row">
              <button
                type="button"
                className={
                  "tts-button" +
                  (speakingIndex === i ? " tts-button--active" : "")
                }
                onClick={() => handleSpeak(item.description, i)}
                aria-label="Play narration"
              >
                🔊
              </button>
              <p className="interpretation-description">
                {item.description.replace(/^🔊\s*/, "")}
              </p>
            </div>

            <div className="interpretation-meta">
              <p><strong>Era:</strong> {item.era}</p>
              <p><strong>Material:</strong> {item.material}</p>
            </div>

            <div className="interpretation-confidence">
              <span>
                Confidence: {(item.confidence * 100).toFixed(1)}%
              </span>
              <div className="confidence-bar-track">
                <div
                  className="confidence-bar-fill"
                  style={{ width: `${item.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CuratorResult;