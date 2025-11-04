@echo off
echo 🚀 Setting up gRPC Migration Project...
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install Node.js and npm first.
    pause
    exit /b 1
)
echo ✅ npm is available

REM Function to install dependencies for a service
set "current_dir=%cd%"

echo.
echo 📦 Installing dependencies for all services...
echo.

REM BFF Service
echo 📦 Installing dependencies for BFF Service...
cd bff_service
if not exist package.json (
    echo ❌ package.json not found in bff_service
    cd "%current_dir%"
    pause
    exit /b 1
)
npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies for BFF Service
    cd "%current_dir%"
    pause
    exit /b 1
)
echo ✅ BFF Service dependencies installed successfully
cd "%current_dir%"

REM Service1
echo 📦 Installing dependencies for Service1 (Users)...
cd server1
if not exist package.json (
    echo ❌ package.json not found in server1
    cd "%current_dir%"
    pause
    exit /b 1
)
npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies for Service1
    cd "%current_dir%"
    pause
    exit /b 1
)
echo ✅ Service1 dependencies installed successfully
cd "%current_dir%"

REM Service2
echo 📦 Installing dependencies for Service2 (Products)...
cd server2
if not exist package.json (
    echo ❌ package.json not found in server2
    cd "%current_dir%"
    pause
    exit /b 1
)
npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies for Service2
    cd "%current_dir%"
    pause
    exit /b 1
)
echo ✅ Service2 dependencies installed successfully
cd "%current_dir%"

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Start Service1: cd server1 ^&^& npm run dev
echo 2. Start Service2: cd server2 ^&^& npm run dev
echo 3. Start BFF Service: cd bff_service ^&^& npm run dev
echo 4. Test REST APIs: cd bff_service ^&^& npm run test:rest
echo.
echo 📚 For detailed instructions, see README.md
echo.
pause