@echo off
echo Starting Docusaurus in multiple locales...
echo ==========================================
echo.
echo [1] English - http://localhost:3000
echo [2] Vietnamese - http://localhost:3001
echo.

REM Start English version
start "Docusaurus EN" cmd /k "npm start -- --locale en --port 3000"

REM Wait 3 seconds before starting second server
timeout /t 3 /nobreak > nul

REM Start Vietnamese version
start "Docusaurus VI" cmd /k "npm start -- --locale vi --port 3001"

echo.
echo Both servers are starting...
echo English: http://localhost:3000
echo Vietnamese: http://localhost:3001
echo.
echo Press any key to exit this window...
pause > nul