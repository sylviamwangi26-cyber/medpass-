@echo off
echo 🚀 Starting MEDPASS Hospital Management System...
echo.

:: 1. Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install it to continue.
    pause
    exit /b
)

:: 2. Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    npm install
)

:: 3. Run the Backend Server
echo 🖥️  Starting MEDPASS on http://localhost:5000...
start "MEDPASS System" cmd /c "node server.js"

:: 4. Wait for server to start
timeout /t 3 /nobreak >nul

:: 5. Open Homepage
echo 🌐 Opening MedPass in your browser...
start "" "http://localhost:5000"

echo.
echo ✅ System is live!
echo.
echo 📜 INSTRUCTIONS:
echo 1. Make sure your MySQL database 'med_pass' is running.
echo 2. Run the SQL script 'init_db.sql' in your MySQL Workbench/CLI first.
echo 3. Keep this terminal open to see logs (AI Reminders, etc.).
echo.
pause
