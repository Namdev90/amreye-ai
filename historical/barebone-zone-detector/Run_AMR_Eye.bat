@echo off
setlocal enabledelayedexpansion

:: Enable VT100 colour/ANSI support in Windows terminal
reg add HKCU\Console /v VirtualTerminalLevel /t REG_DWORD /d 1 /f >nul 2>&1

title AMR-Eye.AI Zone Detector

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found. Install from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation.
    pause
    exit /b 1
)

:: Auto-install deps silently if missing
python -c "import cv2, numpy, PIL, rich" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing required packages, please wait...
    pip install -r requirements.txt --quiet
    pip install rich colorama --quiet
)

:: Launch animated Python UI
python -X utf8 launcher.py

endlocal
