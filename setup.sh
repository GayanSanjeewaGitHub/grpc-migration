#!/bin/bash

echo "🚀 Setting up gRPC Migration Project..."
echo ""

# Function to check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        echo "❌ npm is not installed. Please install Node.js and npm first."
        exit 1
    fi
    echo "✅ npm is available"
}

# Function to install dependencies for a service
install_service_deps() {
    local service_name=$1
    local service_dir=$2
    
    echo "📦 Installing dependencies for $service_name..."
    cd "$service_dir"
    
    if [ ! -f "package.json" ]; then
        echo "❌ package.json not found in $service_dir"
        return 1
    fi
    
    npm install
    
    if [ $? -eq 0 ]; then
        echo "✅ $service_name dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies for $service_name"
        return 1
    fi
    
    cd ..
}

# Check prerequisites
check_npm

# Install dependencies for all services
echo ""
echo "📦 Installing dependencies for all services..."
echo ""

# BFF Service
install_service_deps "BFF Service" "bff_service"

# Service1
install_service_deps "Service1 (Users)" "server1"

# Service2  
install_service_deps "Service2 (Products)" "server2"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start Service1: cd server1 && npm run dev"
echo "2. Start Service2: cd server2 && npm run dev"
echo "3. Start BFF Service: cd bff_service && npm run dev"
echo "4. Test REST APIs: cd bff_service && npm run test:rest"
echo ""
echo "📚 For detailed instructions, see README.md"