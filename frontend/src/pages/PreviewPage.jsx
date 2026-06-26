// pages/PreviewPage.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, ArrowLeft } from "lucide-react";
import CuratorResult from "../components/CuratorResult";
import Loading from "../components/Loading";
// import api from '../api';

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [currentImage, setCurrentImage] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [curatorResult, setCuratorResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get image from navigation state
    if (location.state?.image) {
      setCurrentImage(location.state.image);
      extractImageInfo(location.state.image);
    } else {
      // No image passed, redirect back
      navigate("/curator");
    }
  }, [location.state, navigate]);

  const extractImageInfo = (imageSrc) => {
    const img = new Image();
    img.onload = () => {
      setImageInfo({
        width: img.width,
        height: img.height,
        format: getImageFormat(imageSrc),
      });
    };
    img.src = imageSrc;
  };

  const getImageFormat = (dataUrl) => {
    if (dataUrl.includes("image/png")) return "PNG";
    if (dataUrl.includes("image/jpeg") || dataUrl.includes("image/jpg")) return "JPEG";
    if (dataUrl.includes("image/gif")) return "GIF";
    if (dataUrl.includes("image/webp")) return "WEBP";
    return "Unknown";
  };

  const clearImage = () => {
    setCurrentImage(null);
    setImageInfo(null);
    setCuratorResult(null);
    navigate("/curator");
  };

  const goBack = () => {
    navigate("/curator");
  };

  const analyzeImage = async () => {
    if (!currentImage) return;

    setLoading(true);
    setCuratorResult(null);

    try {
      // Simulated API call - replace with your actual API
      // const response = await api.analyzeImage(currentImage);
      // setCuratorResult(response.data);

      // Simulated response for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCuratorResult({
        title: "Artwork Analysis",
        artist: "Unknown Artist",
        period: "Contemporary",
        description: "This is a sample analysis result.",
        style: "Modern",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      setCuratorResult({ error: "Failed to analyze image" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="header-section">
          <button className="back-btn" onClick={goBack}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="title">🔍 Image Preview</h1>
        </div>

        {/* Current Image */}
        {currentImage && (
          <div className="current-image-section">
            <div className="image-container">
              <img src={currentImage} alt="Current" className="preview-image" />
            </div>

            <button className="clear-btn" onClick={clearImage}>
              <X size={18} />
              <span>Clear Image</span>
            </button>

            {/* Image Info */}
            {imageInfo && (
              <div className="image-info-grid">
                <div className="info-item">
                  <span className="info-label">Width:</span>
                  <span className="info-value">{imageInfo.width}px</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Height:</span>
                  <span className="info-value">{imageInfo.height}px</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Format:</span>
                  <span className="info-value">{imageInfo.format}</span>
                </div>
              </div>
            )}

            {/* Analyze Button */}
            <button
              className="analyze-btn"
              onClick={analyzeImage}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "🔬 Analyze Image"}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && <Loading />}

        {/* Curator Results */}
        {curatorResult && <CuratorResult result={curatorResult} />}
      </div>
    </div>
  );
}