#!/bin/bash
set -e

echo "============================================"
echo "  Taxila Museum — Starting Server"
echo "============================================"

cd "$(dirname "$0")"

# Check Python
if ! command -v python3 &>/dev/null; then
  echo "ERROR: Python 3 not found. Install from https://python.org"
  exit 1
fi

# Create venv if not exists
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv venv
fi

source venv/bin/activate

# Install
echo "Installing dependencies (first run takes ~2 min)..."
pip install -r requirements.txt -q

# Build index if missing
if [ ! -f "embeddings/index.pkl" ]; then
  echo ""
  echo "============================================"
  echo "  First-time setup: Building image index"
  echo "  Make sure images are in:"
  echo "  dataset/images/<artifact_id>/*.jpg"
  echo "============================================"
  python scripts/augment.py
  python scripts/build_index.py
fi

echo ""
echo "============================================"
echo "  Server running at: http://localhost:8000"
echo "  Open this URL in your browser"
echo "  Press Ctrl+C to stop"
echo "============================================"

# Open browser
if command -v xdg-open &>/dev/null; then
  xdg-open http://localhost:8000
elif command -v open &>/dev/null; then
  open http://localhost:8000
fi

uvicorn api.server:app --host 0.0.0.0 --port 8000