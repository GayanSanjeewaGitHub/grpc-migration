# PowerShell setup script for gRPC Migration Project

Write-Host "🚀 Setting up gRPC Migration Project..." -ForegroundColor Green
Write-Host ""

# Check if npm is installed
function Test-Npm {
    try {
        $null = Get-Command npm -ErrorAction Stop
        Write-Host "✅ npm is available" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ npm is not installed. Please install Node.js and npm first." -ForegroundColor Red
        return $false
    }
}

# Function to install dependencies for a service
function Install-ServiceDependencies {
    param(
        [string]$ServiceName,
        [string]$ServiceDir
    )
    
    Write-Host "📦 Installing dependencies for $ServiceName..." -ForegroundColor Yellow
    
    if (-not (Test-Path "$ServiceDir\package.json")) {
        Write-Host "❌ package.json not found in $ServiceDir" -ForegroundColor Red
        return $false
    }
    
    Push-Location $ServiceDir
    
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $ServiceName dependencies installed successfully" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ Failed to install dependencies for $ServiceName" -ForegroundColor Red
            return $false
        }
    }
    finally {
        Pop-Location
    }
}

# Check prerequisites
if (-not (Test-Npm)) {
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies for all services
Write-Host ""
Write-Host "📦 Installing dependencies for all services..." -ForegroundColor Yellow
Write-Host ""

$services = @(
    @{ Name = "BFF Service"; Dir = "bff_service" },
    @{ Name = "Service1 (Users)"; Dir = "server1" },
    @{ Name = "Service2 (Products)"; Dir = "server2" }
)

$allSuccess = $true
foreach ($service in $services) {
    $result = Install-ServiceDependencies -ServiceName $service.Name -ServiceDir $service.Dir
    if (-not $result) {
        $allSuccess = $false
    }
}

Write-Host ""
if ($allSuccess) {
    Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Start Service1: cd server1; npm run dev" -ForegroundColor White
    Write-Host "2. Start Service2: cd server2; npm run dev" -ForegroundColor White
    Write-Host "3. Start BFF Service: cd bff_service; npm run dev" -ForegroundColor White
    Write-Host "4. Test REST APIs: cd bff_service; npm run test:rest" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 For detailed instructions, see README.md" -ForegroundColor Cyan
} else {
    Write-Host "❌ Setup failed for one or more services" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"