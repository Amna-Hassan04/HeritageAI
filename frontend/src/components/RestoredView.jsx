import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * RestoredView
 * Generates front + back cartoon illustrations via /ar/illustrate,
 * then mounts them on a rotating Three.js card (BoxGeometry).
 * As it spins you see front → edge → back → edge → front — turntable style.
 */
export default function RestoredView({ artifact, apiBase, amber = "#d97706" }) {
  const [phase, setPhase] = useState("idle");   // idle | loading | ready | error
  const [error, setError] = useState(null);
  const mountRef          = useRef(null);
  const rendererRef       = useRef(null);
  const frameRef          = useRef(null);

  async function handleClick() {
    setPhase("loading");
    setError(null);

    try {
      const res = await fetch(`${apiBase}/ar/illustrate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artifact_id: artifact?.id          || "unknown",
          title:       artifact?.title       || "ancient artifact",
          material:    artifact?.extra?.material || "stone",
          religion:    artifact?.extra?.religion || "",
          date:        artifact?.extra?.date     || "",
          story:       artifact?.story           || "",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      const frontUrl = `data:image/jpeg;base64,${data.front_base64}`;
      const backUrl  = `data:image/jpeg;base64,${data.back_base64}`;
      console.log("front_base64 length:", data.front_base64?.length);
      console.log("back_base64 length:", data.back_base64?.length);
      console.log("front preview:", data.front_base64?.substring(0, 50));

      setPhase("ready");
      // Give React one tick to mount the canvas div
      setTimeout(() => buildScene(frontUrl, backUrl), 60);

    } catch (e) {
      setError(e.message);
      setPhase("error");
    }
  }

  function loadTexture(url) {
    return new Promise((resolve) => {
      new THREE.TextureLoader().load(url, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        resolve(tex);
      });
    });
  }

  async function buildScene(frontUrl, backUrl) {
    const mount = mountRef.current;
    if (!mount) return;

    // Clean up any previous renderer
    if (rendererRef.current) {
      cancelAnimationFrame(frameRef.current);
      rendererRef.current.dispose();
      mount.innerHTML = "";
    }

    const width  = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene
    const scene  = new THREE.Scene();
    scene.background = new THREE.Color(0x0f0f0f);

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 3.4);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Load both textures in parallel
    const [frontTex, backTex] = await Promise.all([
      loadTexture(frontUrl),
      loadTexture(backUrl),
    ]);

    // Card — BoxGeometry: right, left, top, bottom, FRONT, BACK
    const cardW = 1.8, cardH = 2.2, cardD = 0.05;
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });

    const card = new THREE.Mesh(
      new THREE.BoxGeometry(cardW, cardH, cardD),
      [
        edgeMat,  // right
        edgeMat,  // left
        edgeMat,  // top
        edgeMat,  // bottom
        new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.6 }), // front
        new THREE.MeshStandardMaterial({ map: backTex,  roughness: 0.6 }), // back
      ]
    );
    scene.add(card);

    // Pedestal
    const pedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.82, 0.14, 40),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.85, metalness: 0.1 })
    );
    pedestal.position.y = -(cardH / 2) - 0.09;
    scene.add(pedestal);

    // Lighting
    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.3);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xddeeff, 0.4);
    fillLight.position.set(-3, 0, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(amber, 0.55);
    rimLight.position.set(0, -3, -3);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    // Subtle floor reflection
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 1, metalness: 0 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -(cardH / 2) - 0.16;
    scene.add(floor);

    // Animate — steady turntable rotation
    const animate = () => {
      card.rotation.y     += 0.007;
      pedestal.rotation.y += 0.007;

      // Sync key light to stay slightly ahead of camera angle
      keyLight.position.x = Math.sin(card.rotation.y + 0.5) * 4;
      keyLight.position.z = Math.cos(card.rotation.y + 0.5) * 4;

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    animate();
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <div style={{ marginTop: 14 }}>

      {phase === "idle" && (
        <button onClick={handleClick} style={{
          width: "100%", padding: 14, borderRadius: 14,
          background: amber, border: "none", color: "#fff",
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          🎨 Generate Illustrated View
        </button>
      )}

      {phase === "loading" && (
        <div style={{
          padding: 20, borderRadius: 14, background: "rgba(0,0,0,0.3)",
          border: `1px solid ${amber}30`, textAlign: "center",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            border: `3px solid ${amber}30`, borderTopColor: amber,
            animation: "rv-spin 0.8s linear infinite",
            margin: "0 auto 12px",
          }} />
          <p style={{ color: amber, fontSize: 13, fontWeight: 600, margin: 0 }}>
            Generating front & back illustrations…
          </p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 6 }}>
            This takes about 20–40 seconds · cached after first run
          </p>
        </div>
      )}

      {phase === "error" && (
        <>
          <p style={{ color: "#dc2626", fontSize: 12, marginTop: 8, textAlign: "center" }}>
            {error}
          </p>
          <button onClick={() => setPhase("idle")} style={{
            marginTop: 8, width: "100%", padding: 10, borderRadius: 12,
            background: "transparent", border: `1px solid ${amber}`,
            color: amber, fontSize: 13, cursor: "pointer",
          }}>
            Try Again
          </button>
        </>
      )}

      {phase === "ready" && (
        <div>
          <div ref={mountRef} style={{
            width: "100%", height: 320, borderRadius: 16,
            overflow: "hidden", background: "#0f0f0f",
            border: `1px solid ${amber}20`,
          }} />
          <p style={{
            fontSize: 11, color: "rgba(255,255,255,0.3)",
            textAlign: "center", marginTop: 8,
          }}>
            AI illustrated · front & back · rotating display
          </p>
        </div>
      )}

      <style>{`
        @keyframes rv-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}