#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
if [ -d "$DIR/diwali-animations" ]; then
  cd "$DIR/diwali-animations"
else
  cd "$DIR"
fi

echo "🪔 Starting Diwali Mac Screen Overlay..."
echo "Press Ctrl+C or use the 🪔 menu bar icon to quit anytime."
npm run overlay
