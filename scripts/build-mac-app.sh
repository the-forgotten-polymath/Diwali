#!/bin/bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." >/dev/null 2>&1 && pwd )"
OUTPUT_DIR="$DIR/.."
APP_NAME="Diwali Overlay.app"
TARGET_APP="$OUTPUT_DIR/$APP_NAME"
ELECTRON_APP="$DIR/node_modules/electron/dist/Electron.app"

echo "🪔 Packaging standalone macOS application: $APP_NAME..."

if [ ! -d "$ELECTRON_APP" ]; then
  echo "Error: Electron binary not found at $ELECTRON_APP"
  exit 1
fi

# Remove previous build if exists
rm -rf "$TARGET_APP"

# Copy Electron.app
cp -R "$ELECTRON_APP" "$TARGET_APP"

# Prepare app directory inside Resources
APP_RESOURCES="$TARGET_APP/Contents/Resources/app"
mkdir -p "$APP_RESOURCES"

# Copy required runtime files
cp -R "$DIR/electron" "$APP_RESOURCES/"
cp -R "$DIR/dist" "$APP_RESOURCES/"

# Create app package.json
cat <<EOF > "$APP_RESOURCES/package.json"
{
  "name": "diwali-overlay",
  "version": "1.0.0",
  "main": "electron/main.cjs"
}
EOF

# Update Info.plist for app name and bundle identifier
PLIST="$TARGET_APP/Contents/Info.plist"
if [ -f "$PLIST" ]; then
  plutil -replace CFBundleName -string "Diwali Overlay" "$PLIST" || true
  plutil -replace CFBundleDisplayName -string "Diwali Overlay" "$PLIST" || true
  plutil -replace CFBundleIdentifier -string "com.diwali.overlay" "$PLIST" || true
fi

# Rename internal executable
MACOS_DIR="$TARGET_APP/Contents/MacOS"
if [ -f "$MACOS_DIR/Electron" ]; then
  mv "$MACOS_DIR/Electron" "$MACOS_DIR/Diwali Overlay"
  plutil -replace CFBundleExecutable -string "Diwali Overlay" "$PLIST" || true
fi

echo "✅ Successfully built standalone macOS app at: $TARGET_APP"
echo "You can double-click 'Diwali Overlay.app' directly from Finder or drag it into /Applications!"

