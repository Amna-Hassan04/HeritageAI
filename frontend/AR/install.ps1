@echo off
REM install.bat - plain Windows batch fallback if PowerShell keeps misbehaving
REM Run from inside an activated venv:
REM     install.bat

echo.
echo ==^> 1/5 Upgrading pip ...
python -m pip install --upgrade pip
if errorlevel 1 goto :error

echo.
echo ==^> 2/5 Purging pip cache ...
pip cache purge

echo.
echo ==^> 3/5 Installing torch + torchvision (CPU, about 200 MB) ...
pip install --default-timeout=600 --retries=10 -r requirements-torch.txt --index-url https://download.pytorch.org/whl/cpu
if errorlevel 1 goto :error

echo.
echo ==^> 4/5 Installing the rest of the dependencies ...
pip install --default-timeout=600 --retries=10 -r requirements.txt
if errorlevel 1 goto :error

echo.
echo ==^> 5/5 Verifying imports ...
python -c "import albumentations, cv2, torch, open_clip, fastapi, sklearn, PIL, numpy, tqdm; print('  ALL GOOD')"
if errorlevel 1 goto :error

echo.
echo Done. You can now run:
echo     python scripts/verify_dataset.py
echo     python scripts/augment.py --clean
echo     python scripts/build_index.py
goto :eof

:error
echo.
echo Install failed. See the error above.
exit /b 1
