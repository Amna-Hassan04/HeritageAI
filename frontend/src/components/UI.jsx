import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import CuratorResult from './CuratorResult';
import api from '../api'; // For backend requests

const MOCKED_RESULT = {
  interpretations: [
    {
      title: "Artifact Interpretation (Mocked)",
      description: "This response is generated using a simulated curator model due to external API quota limitations.",
      era: "Estimated Historical Period",
      material: "Estimated Material",
      confidence: 0.85
    }
  ]
};

const UI = () => {
  const [currentImage, setCurrentImage] = useState(null);
  const [imageInfo, setImageInfo] = useState(null);
  const [curatorResult, setCuratorResult] = useState(null);

  const handleFileChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageInfo({ width: img.width, height: img.height, format: file.type.split('/')[1].toUpperCase() });
      };
      img.src = event.target.result;
      setCurrentImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (e) => handleFileChange(e.target.files[0]);
  const handleCamera = (e) => handleFileChange(e.target.files[0]);
  const clearImage = () => { setCurrentImage(null); setImageInfo(null); setCuratorResult(null); };

  const analyzeImage = async () => {
    if (!currentImage) return;
    try {
      const response = await api.post('/curate', { image: currentImage });
      setCuratorResult(response.data);
    } catch (err) {
      console.error("Gemini API failed, using mock", err);
      setCuratorResult(MOCKED_RESULT);
    }
  };

  return (
    <div className="streamlit-container">
      {/* Header */}
      <div className="streamlit-header">
        <div className="brand"><span>📸 AI Museum Curator</span></div>
      </div>

      <div className="streamlit-main">
        {/* Upload + Camera */}
        <div className="upload-grid">
          <div className="upload-section">
            <h3>📁 Upload Image</h3>
            <div className="upload-dropzone">
              <input type="file" accept="image/*" onChange={handleUpload}/>
              <Upload size={48} />
              <p>Drag & drop or click</p>
            </div>
          </div>
          <div className="camera-section">
            <h3>📷 Capture from Camera </h3>
            <div className="upload-dropzone">
              <input type="file" accept="image/*" capture="environment" onChange={handleCamera}/>
              <Camera size={48} />
              <p>Take a photo</p>
            </div>
          </div>
        </div>

        {/* Current Image */}
        {currentImage && (
          <div className="current-image-section">
            <img src={currentImage} alt="Current" />
            <button onClick={clearImage}><X /> Clear Image</button>

            {/* Image Info */}
            {imageInfo && (
              <div className="image-info-grid">
                <div>Width: {imageInfo.width}px</div>
                <div>Height: {imageInfo.height}px</div>
                <div>Format: {imageInfo.format}</div>
              </div>
            )}

            {/* Analyze Button */}
            <button className="analyze-btn" onClick={analyzeImage}>Analyze Image</button>
          </div>
        )}

        {/* Curator Results */}
        {curatorResult && <CuratorResult result={curatorResult} />}
      </div>
    </div>
  );
};

export default UI;
