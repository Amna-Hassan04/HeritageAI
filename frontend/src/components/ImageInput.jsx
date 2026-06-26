// src/components/ImageInput.jsx
import { useRef, useState, useEffect } from "react";

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ImageInput({ label, mode, onSelect }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) return "Unsupported file type.";
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) return "File too large (max 10MB).";
    return null;
  };

  const safeStopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };

  const handleClick = () => {
    setError(null);
    if (mode === "upload") fileInputRef.current?.click();
    else setShowCamera(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateFile(file);
    if (validationError) return setError(validationError);
    onSelect({ file, preview: URL.createObjectURL(file) });
  };

  useEffect(() => {
    if (!showCamera) return;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        setError("Camera access denied.");
        setShowCamera(false);
      });

    return () => safeStopStream();
  }, [showCamera]);

  const capturePhoto = () => {
    if (!videoRef.current) return setError("Camera not ready.");

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return setError("Capture failed.");
      const file = new File([blob], "camera.jpg", { type: "image/jpeg" });
      onSelect({ file, preview: URL.createObjectURL(file) });
      closeCamera();
    }, "image/jpeg");
  };

  const closeCamera = () => {
    safeStopStream();
    setShowCamera(false);
  };

  return (
    <>
      <div className="input-card">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
        <div className="drop-zone" onClick={handleClick}>
          <h3>{label}</h3>
          <p>Click to {mode === "upload" ? "browse files" : "open camera"}</p>
        </div>
        {error && <p style={{ color: "#b91c1c" }}>❌ {error}</p>}
      </div>

      {showCamera && (
        <div className="camera-modal">
          <div className="camera-header">
            <h2>📷 Camera</h2>
            <button onClick={closeCamera}>✕</button>
          </div>
          <video ref={videoRef} autoPlay playsInline className="camera-video" />
          <button onClick={capturePhoto}>📸 Capture</button>
        </div>
      )}
    </>
  );
}
// import { useRef, useState, useEffect } from "react";

// const MAX_FILE_SIZE_MB = 10;
// const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// export default function ImageInput({ label, mode, onSelect }) {
//   const fileInputRef = useRef(null);
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);

//   const [showCamera, setShowCamera] = useState(false);
//   const [error, setError] = useState(null);

//   /* ---------- Helpers ---------- */

//   const validateFile = (file) => {
//     if (!ALLOWED_TYPES.includes(file.type)) {
//       return "Unsupported file type. Use JPG, PNG, or WEBP.";
//     }
//     if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
//       return "File too large (max 10MB).";
//     }
//     return null;
//   };

//   const safeStopStream = () => {
//     streamRef.current?.getTracks().forEach((t) => t.stop());
//     streamRef.current = null;
//   };

//   /* ---------- Upload ---------- */

//   const handleClick = () => {
//     setError(null);
//     if (mode === "upload") {
//       fileInputRef.current?.click();
//     } else {
//       if (!navigator.mediaDevices?.getUserMedia) {
//         setError("Camera not supported in this browser.");
//         return;
//       }
//       setShowCamera(true);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const validationError = validateFile(file);
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     onSelect({
//       file,
//       preview: URL.createObjectURL(file),
//     });
//   };

//   /* ---------- Camera ---------- */

//   useEffect(() => {
//     if (!showCamera) return;

//     navigator.mediaDevices
//       .getUserMedia({ video: { facingMode: "environment" } })
//       .then((stream) => {
//         streamRef.current = stream;
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//         }
//       })
//       .catch(() => {
//         setError("Camera access denied or unavailable.");
//         setShowCamera(false);
//       });

//     return () => safeStopStream();
//   }, [showCamera]);

//   const capturePhoto = () => {
//     if (!videoRef.current) {
//       setError("Camera not ready.");
//       return;
//     }

//     const { videoWidth, videoHeight } = videoRef.current;
//     if (!videoWidth || !videoHeight) {
//       setError("Camera feed not initialized.");
//       return;
//     }

//     const canvas = document.createElement("canvas");
//     canvas.width = videoWidth;
//     canvas.height = videoHeight;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) {
//       setError("Failed to capture image.");
//       return;
//     }

//     ctx.drawImage(videoRef.current, 0, 0);

//     canvas.toBlob(
//       (blob) => {
//         if (!blob) {
//           setError("Image capture failed.");
//           return;
//         }

//         const file = new File([blob], "camera.jpg", { type: "image/jpeg" });

//         onSelect({
//           file,
//           preview: URL.createObjectURL(file),
//         });

//         closeCamera();
//       },
//       "image/jpeg",
//       0.95
//     );
//   };

//   const closeCamera = () => {
//     safeStopStream();
//     setShowCamera(false);
//   };

//   /* ---------- UI ---------- */

//   return (
//     <>
//       <div className="input-card">
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           hidden
//           onChange={handleFileChange}
//         />

//         <div className="drop-zone" onClick={handleClick}>
//           <h3>{label}</h3>
//           <p>
//             Click to {mode === "upload" ? "browse files" : "open camera"}
//           </p>
//         </div>

//         {error && (
//           <p style={{ color: "#b91c1c", marginTop: "0.5rem", fontSize: "0.9rem" }}>
//             ❌ {error}
//           </p>
//         )}
//       </div>

//       {showCamera && (
//         <div className="camera-modal">
//           <div className="camera-header">
//             <h2>📷 Camera</h2>
//             <button className="camera-close" onClick={closeCamera}>
//               ✕
//             </button>
//           </div>

//           <div className="camera-view">
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               className="camera-video"
//             />
//           </div>

//           <div className="camera-controls">
//             <button className="capture-btn" onClick={capturePhoto}>
//               📸 Capture
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// import { useRef, useState, useEffect } from "react";

// export default function ImageInput({ label, mode, onSelect }) {
//   const fileInputRef = useRef(null);
//   const videoRef = useRef(null);
//   const streamRef = useRef(null);
//   const [showCamera, setShowCamera] = useState(false);

//   const handleClick = () => {
//     if (mode === "upload") fileInputRef.current.click();
//     else setShowCamera(true);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (ev) => onSelect(ev.target.result);
//     reader.readAsDataURL(file);
//   };

//   useEffect(() => {
//     if (!showCamera) return;

//     navigator.mediaDevices
//       .getUserMedia({ video: { facingMode: "environment" } })
//       .then((stream) => {
//         streamRef.current = stream;
//         videoRef.current.srcObject = stream;
//       })
//       .catch(() => setShowCamera(false));

//     return () => {
//       streamRef.current?.getTracks().forEach((t) => t.stop());
//     };
//   }, [showCamera]);

//   const capturePhoto = () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
//     onSelect(canvas.toDataURL("image/jpeg"));
//     closeCamera();
//   };

//   const closeCamera = () => {
//     streamRef.current?.getTracks().forEach((t) => t.stop());
//     setShowCamera(false);
//   };

//   return (
//     <>
//       <div className="input-card">
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           hidden
//           onChange={handleFileChange}
//         />
//         <div className="drop-zone" onClick={handleClick}>
//           <h3>{label}</h3>
//           <p>Click to {mode === "upload" ? "browse files" : "open camera"}</p>
//         </div>
//       </div>

//       {showCamera && (
//         <div className="camera-modal">
//           <div className="camera-header">
//             <h2>📷 Camera</h2>
//             <button className="camera-close" onClick={closeCamera}>✕</button>
//           </div>

//           <div className="camera-view">
//             <video ref={videoRef} autoPlay playsInline className="camera-video" />
//           </div>

//           <div className="camera-controls">
//             <button className="capture-btn" onClick={capturePhoto}>
//               📸 Capture
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
// import { Upload, Camera } from "lucide-react";

// export default function ImageInput({ label, mode, onSelect }) {
//   const handleChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => onSelect(reader.result);
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="input-card">
//       <h3>{label}</h3>

//       <label className="drop-zone">
//         <input
//           type="file"
//           hidden
//           accept="image/*"
//           capture={mode === "camera" ? "environment" : undefined}
//           onChange={handleChange}
//         />

//         {mode === "upload" ? <Upload size={46} /> : <Camera size={46} />}
//         <p>{mode === "upload" ? "Click or drag image" : "Open camera"}</p>
//       </label>
//     </div>
//   );
// }
