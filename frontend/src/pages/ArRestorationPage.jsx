import React, { useEffect, useRef, useState } from 'react';
import '../styles/arRestoration.css';
import BuddhaPaintingImg from '../assets/taxila-mural-image.jpg';

const GRID_SIZE = 3;

export default function ArRestorationPage() {
  const [isScanned, setIsScanned] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const canvasRef = useRef(null);
  const piecesRef = useRef([]);
  const imgRef = useRef(null);

  // 1. Cross-Window Communication: Listens for the tracking event from the sandbox iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'MURAL_TARGET_DETECTED') {
        setIsScanned(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 2. HTML5 Canvas Initialization: Renders the image puzzle once the AR target is detected
  useEffect(() => {
    if (!isScanned) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 450;
    canvas.height = 600;

    const img = new Image();
    img.src = '/assets/restored-buddha.png';
    imgRef.current = img;

    img.onload = () => {
      createPieces(img, canvas.width, canvas.height);
      shufflePieces();
      drawPuzzle(ctx, canvas.width, canvas.height);
    };
  }, [isScanned]);

  // 3. Grid Calculation: Breaks the image into a 3x3 array of coordinates
  const createPieces = (img, canvasWidth, canvasHeight) => {
    const arr = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        arr.push({
          sx: j * (img.width / GRID_SIZE),
          sy: i * (img.height / GRID_SIZE),
          correctX: j,
          correctY: i,
          currentX: j,
          currentY: i
        });
      }
    }
    piecesRef.current = arr;
  };

  // 4. Randomization Algorithm: Shuffles tile placement values
  const shufflePieces = () => {
    const pieces = piecesRef.current;
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempX = pieces[i].currentX;
      const tempY = pieces[i].currentY;
      pieces[i].currentX = pieces[j].currentX;
      pieces[i].currentY = pieces[j].currentY;
      pieces[j].currentX = tempX;
      pieces[j].currentY = tempY;
    }
  };

  // 5. Canvas Rendering Loop: Redraws tiles with selection highlights
  const drawPuzzle = (ctx, width, height, currentSelection = null) => {
    if (!ctx || !imgRef.current) return;
    ctx.clearRect(0, 0, width, height);
    const w = width / GRID_SIZE;
    const h = height / GRID_SIZE;
    const img = imgRef.current;

    piecesRef.current.forEach(p => {
      ctx.drawImage(img, p.sx, p.sy, img.width / GRID_SIZE, img.height / GRID_SIZE, p.currentX * w, p.currentY * h, w, h);
      ctx.strokeStyle = '#c5a880';
      ctx.lineWidth = 2;
      ctx.strokeRect(p.currentX * w, p.currentY * h, w, h);

      if (currentSelection && currentSelection === p) {
        ctx.fillStyle = 'rgba(197, 168, 128, 0.4)';
        ctx.fillRect(p.currentX * w, p.currentY * h, w, h);
      }
    });
  };

  // 6. Interaction Handler: Processes click locations to select or swap tiles
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const tileX = Math.floor(clickX / (rect.width / GRID_SIZE));
    const tileY = Math.floor(clickY / (rect.height / GRID_SIZE));

    const clickedPiece = piecesRef.current.find(p => p.currentX === tileX && p.currentY === tileY);

    if (!selectedPiece) {
      setSelectedPiece(clickedPiece);
      drawPuzzle(ctx, canvas.width, canvas.height, clickedPiece);
    } else {
      const tempX = selectedPiece.currentX;
      const tempY = selectedPiece.currentY;
      selectedPiece.currentX = clickedPiece.currentX;
      selectedPiece.currentY = clickedPiece.currentY;
      clickedPiece.currentX = tempX;
      clickedPiece.currentY = tempY;

      setSelectedPiece(null);
      drawPuzzle(ctx, canvas.width, canvas.height, null);
      checkWinCondition();
    }
  };

  // 7. Verification: Compares current placement positions against correct values
  const checkWinCondition = () => {
    const isWin = piecesRef.current.every(p => p.currentX === p.correctX && p.currentY === p.correctY);
    if (isWin) {
      setTimeout(() => {
        alert("✨ Historic Preservation Complete! You successfully reconstructed the Jinnan Wali Dheri Fresco.");
      }, 300);
    }
  };

  const handleRescramble = () => {
    shufflePieces();
    const canvas = canvasRef.current;
    drawPuzzle(canvas.getContext('2d'), canvas.width, canvas.height);
  };

  return (
    <div style={{ backgroundColor: '#111111', minHeight: '100vh', color: '#fff', paddingBottom: '80px', fontFamily: 'serif' }}>

      {/* SECTION 1: EDUCATIONAL INFRASTRUCTURE OVERVIEW */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 20px 40px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#c5a880', fontSize: '3rem', marginBottom: '20px', letterSpacing: '1px' }}>Learn With Augmented Reality</h1>
        <div style={{ width: '80px', height: '2px', backgroundColor: '#c5a880', margin: '0 auto 30px auto' }}></div>
        <p style={{ color: '#bbb', fontSize: '1.1rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', fontWeight: '300' }}>
          Augmented Reality (AR) bridges the gap between historical preservation and interactive learning. By overlaying digital reconstructions directly onto the user's field of view, this application changes how users study cultural heritage, encouraging active learning through a gamified reconstruction environment.
        </p>
      </div>

      <hr style={{ border: 'none', height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.2)', maxWidth: '1000px', margin: '40px auto' }} />

      {/* SECTION 2: THE HISTORICAL LORE & STORYTELLING LAYER */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <h2 style={{ color: '#c5a880', fontSize: '2rem', marginBottom: '30px' }}>The Chronicles of Taxila: Reassembling the Scattered Buddha</h2>

        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '40px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={BuddhaPaintingImg}
              alt="Taxila Museum Showcase"
              style={{ width: '100%', borderRadius: '8px', border: '1px solid #c5a880', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
            />
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, height: '2px',
              background: '#c5a880',
              boxShadow: '0 0 10px #c5a880',
              animation: 'scanLine 3s linear infinite'
            }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', lineHeight: '1.8', color: '#ccc', fontSize: '1.05rem', fontFamily: 'sans-serif', fontWeight: '300' }}>
            <p>
              Deep within the ancient Buddhist monasteries of <strong>Jinnan Wali Dheri in Taxila</strong>, archaeologists uncovered rare, surviving stucco mural paintings dating from the 3rd to 5th Century AD. These unique frescoes showcase the historical art styles and cultural narratives of the Gandhara civilization.
            </p>
            <p>
              Over centuries, weathering and structural collapses left these priceless murals broken into thousands of loose fragments. Today, these damaged remnants are carefully preserved in storage trays at the Taxila Museum, making it difficult for everyday visitors to visualize their original form.
            </p>
            <p style={{ borderLeft: '3px solid #c5a880', paddingLeft: '15px', fontStyle: 'italic', color: '#e5d5c0', fontFamily: 'serif' }}>
              <strong>Application Workflow:</strong> HeritageAI utilizes artificial intelligence image completion models to fill in missing gaps and reverse centuries of wear. By pointing your device's camera at the fragmented mural layout, the system recognizes the artifact, pairs it with our digital asset library, and automatically splits our high-resolution AI reconstruction into an educational matching game.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      <hr style={{ border: 'none', height: '1px', backgroundColor: 'rgba(197, 168, 128, 0.2)', maxWidth: '1000px', margin: '40px auto' }} />

      {/* SECTION 3 & 4: THE CAM & GAME MODULES */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        {!isScanned && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'rgba(24, 24, 27, 0.9)', border: '1px solid #c5a880', padding: '30px', borderRadius: '12px', width: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ color: '#c5a880', marginTop: 0, textAlign: 'center' }}>Active Target Matrix Scanning View</h3>
              <p style={{ color: '#aaa', fontSize: '0.95rem', textAlign: 'center', marginBottom: '24px', fontFamily: 'sans-serif' }}>
                Center the physical artifact image within the camera viewport boundaries to synchronize tracking feature point maps.
              </p>

              <iframe
                src="/ar-sandbox.html"
                allow="camera"
                title="AR Execution Sandbox"
                style={{ width: '100%', height: '400px', border: '1px solid #c5a880', borderRadius: '6px', backgroundColor: '#000' }}
              />
            </div>
          </div>
        )}

        {isScanned && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: 'rgba(24, 24, 27, 0.9)', border: '1px solid #c5a880', padding: '40px 20px', borderRadius: '12px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ color: '#c5a880', marginTop: 0, marginBottom: '5px' }}>AI Reconstruction Complete</h2>
              <p style={{ color: '#aaa', marginBottom: '30px', fontSize: '0.95rem', fontFamily: 'sans-serif' }}>
                Image tracking complete. Click and swap the pieces to reconstruct the ancient Gandhara fresco painting.
              </p>
              <canvas ref={canvasRef} onClick={handleCanvasClick} className="ar-puzzle-canvas" />
              <button onClick={handleRescramble} className="ar-btn-scramble" style={{ fontFamily: 'sans-serif' }}>
                Shuffle Fresco Pieces
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}