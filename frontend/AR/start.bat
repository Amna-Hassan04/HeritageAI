@echo off
echo ============================================
echo   Taxila Museum — Starting Server
echo ============================================

cd /d "%~dp0"

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Install from https://python.org
    pause & exit /b 1
)

REM Create venv if not exists
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies (first run takes ~2 min)...
pip install -r requirements.txt -q

REM Check index
if not exist "embeddings\index.pkl" (
    echo.
    echo ============================================
    echo   First-time setup: Building image index
    echo   Make sure your images are in:
    echo   dataset\images\^<artifact_id^\>\*.jpg
    echo ============================================
    python scripts\augment.py
    python scripts\build_index.py
)

REM Start server
echo.
echo ============================================
echo   Server running at: http://localhost:8000
echo   Open this URL in your browser
echo   Press Ctrl+C to stop
echo ============================================
start "" http://localhost:8000
uvicorn api.server:app --host 0.0.0.0 --port 8000

pause