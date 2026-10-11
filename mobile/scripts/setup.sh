#!/usr/bin/env bash
set -e

echo "=================================================="
echo "🚀 EduTech Flutter FVM Environment Setup"
echo "=================================================="

# Check if fvm is installed
if ! command -v fvm &> /dev/null; then
    echo "⚠️ FVM is not installed on this machine."
    echo "📦 Installing FVM via brew or pub..."
    if command -v brew &> /dev/null; then
        brew tap leoafarias/fvm
        brew install fvm
    elif command -v dart &> /dev/null; then
        dart pub global activate fvm
    else
        echo "❌ Please install FVM first: https://fvm.app/documentation/getting-started/installation"
        exit 1
    fi
fi

# Navigate to mobile directory
cd "$(dirname "$0")/.."

echo "📥 Installing pinned Flutter SDK version via FVM..."
fvm install

echo "🔗 Linking local Flutter SDK..."
fvm use

echo "📦 Fetching Flutter dependencies..."
fvm flutter pub get

echo "✅ Environment setup complete! You can now run: fvm flutter run"
