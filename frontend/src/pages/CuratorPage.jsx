import { useState } from "react";
import { curateImage } from "../api/curatorApi"; // Ensure this path matches your file structure
import ImageInput from "../components/ImageInput";
import ImagePreview from "../components/ImagePreview";
import CuratorResult from "../components/CuratorResult";
import Loading from "../components/Loading";

export default function CuratorPage() {
  const [image, setImage] = useState(null); // Stores the Base64/URL for preview
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Called when user picks an image from Gallery or Camera
  const handleImageSelect = (selectedImage) => {
    setImage(selectedImage);
    setResult(null); // Reset previous results
    setError(null);
  };

  // Called when user clicks "Analyze Artifact"
  // Called when user clicks "Analyze Artifact"
const handleAnalyze = async () => {
  if (!image?.file) return;

  setLoading(true);
  setResult(null);
  setError(null);

  try {
    const data = await curateImage(image.file);
    console.log("API result from /curate:", data);  // <--- add this
    setResult(data);
  } catch (err) {
    console.error(err);
    setError("Failed to analyze the artifact. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">📸 AI Museum Curator</h1>

        {/* Input Grid: Upload or Camera */}
        <div className="input-grid">
          <ImageInput
            label="📁 Upload from Gallery"
            mode="upload"
            onSelect={handleImageSelect}
          />
          <ImageInput
            label="📷 Capture from Camera"
            mode="camera"
            onSelect={handleImageSelect}
          />
        </div>

        {/* Hint if no image is selected */}
        {!image && (
          <div className="hint">
            👆 Upload or capture an image to start curation
          </div>
        )}

        {/* Image Preview Area */}
        {image && (
  <>
    <ImagePreview image={image.preview} />  {/* use preview URL */}
    {!loading && !result && (
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button
          onClick={handleAnalyze}
          className="capture-btn"
          style={{ background: "#1f77b4", color: "white", margin: "auto" }}
        >
          ✨ Analyze Artifact
        </button>
      </div>
    )}
  </>
)}

        {/* Loading State */}
        {loading && <Loading />}

        {/* Error Message */}
        {error && (
          <div className="hint" style={{ borderColor: "#ef4444", color: "#b91c1c", background: "#fef2f2" }}>
            ❌ {error}
          </div>
        )}

        {/* Result Component */}
        {result && <CuratorResult result={result} />}
      </div>
    </div>
  );
}
// works
// import { useState } from "react";
// import ImageInput from "../components/ImageInput";
// import ImagePreview from "../components/ImagePreview";
// import CuratorResult from "../components/CuratorResult";
// import Loading from "../components/Loading";
// // import api from '../api'; 

// export default function CuratorPage() {
//   const [image, setImage] = useState(null);
//   const [result] = useState(null);
//   const [loading] = useState(false);

//   return (
//     <div className="page">
//       <div className="container">
//         <h1 className="title">📸 AI Museum Curator</h1>

//         <div className="input-grid">
//           <ImageInput
//             label="📁 Upload from Gallery"
//             mode="upload"
//             onSelect={setImage}
//           />
//           <ImageInput
//             label="📷 Capture from Camera"
//             mode="camera"
//             onSelect={setImage}
//           />
//         </div>

//         {!image && (
//           <div className="hint">
//             👆 Upload or capture an image to start curation
//           </div>
//         )}
        

//         {image && (
//           <>
//             <ImagePreview image={image} />
//             {loading && <Loading />}
//             {result && <CuratorResult result={result} />}
//           </>
//         )}
        
//       </div>
//     </div>

//   );
// }


// import { useState } from "react";
// import { curateImage } from "../api/curatorApi";
// import ImageInput from "../components/ImageInput";
// import ImagePreview from "../components/ImagePreview";
// import CuratorResult from "../components/CuratorResult";

// const CuratorPage = () => {
//   const [file, setFile] = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleAnalyze = async () => {
//     setLoading(true);
//     setResult(null);
//     try {
//       const data = await curateImage(file);
//       setResult(data);
//     } catch {
//       alert("Analysis failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <ImageInput onSelect={setFile} />
//       <ImagePreview file={file} />

//       {file && <button onClick={handleAnalyze}>Analyze Artifact</button>}
//       {loading && <p>Analyzing image...</p>}
//       <CuratorResult result={result} />
//     </>
//   );
// };

// export default CuratorPage;
