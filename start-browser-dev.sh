#!/bin/bash

# ============================================================================
# Chrome/Chromium Development Browser Launcher
# ============================================================================
# 
# WARNING: This script launches Chrome with disabled web security.
# This is ONLY for development purposes and should NEVER be used for
# regular browsing as it poses significant security risks.
#
# The browser will use a separate user data directory to avoid
# affecting your main browser profile.
# ============================================================================

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Development user data directory
DEV_USER_DATA_DIR="$HOME/.chrome-dev-profile"

# Create the development profile directory if it doesn't exist
mkdir -p "$DEV_USER_DATA_DIR"

echo -e "${YELLOW}============================================${NC}"
echo -e "${YELLOW}Starting Chrome in Development Mode${NC}"
echo -e "${YELLOW}============================================${NC}"
echo ""
echo -e "${RED}WARNING: Web security is DISABLED!${NC}"
echo -e "${RED}Only use this for development testing.${NC}"
echo ""
echo -e "Profile directory: ${GREEN}$DEV_USER_DATA_DIR${NC}"
echo ""

# Detect the operating system
OS="$(uname -s)"

case "$OS" in
    Darwin*)
        # macOS
        echo -e "Detected OS: ${GREEN}macOS${NC}"
        
        # Common Chrome paths on macOS
        CHROME_PATHS=(
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            "/Applications/Chromium.app/Contents/MacOS/Chromium"
            "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
            "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
        )
        
        # Find the first available Chrome/Chromium browser
        CHROME_EXEC=""
        for path in "${CHROME_PATHS[@]}"; do
            if [ -f "$path" ]; then
                CHROME_EXEC="$path"
                echo -e "Found browser: ${GREEN}$(basename "$path")${NC}"
                break
            fi
        done
        
        if [ -z "$CHROME_EXEC" ]; then
            echo -e "${RED}Error: No Chrome/Chromium browser found!${NC}"
            echo "Please install Google Chrome or Chromium first."
            exit 1
        fi
        
        # Launch Chrome with disabled security
        "$CHROME_EXEC" \
            --disable-web-security \
            --disable-features=IsolateOrigins,site-per-process \
            --user-data-dir="$DEV_USER_DATA_DIR" \
            --allow-file-access-from-files \
            --allow-cross-origin-auth-prompt \
            "$@"
        ;;
        
    Linux*)
        # Linux
        echo -e "Detected OS: ${GREEN}Linux${NC}"
        
        # Common Chrome/Chromium commands on Linux
        CHROME_COMMANDS=(
            "google-chrome"
            "google-chrome-stable"
            "chromium"
            "chromium-browser"
            "brave-browser"
        )
        
        # Find the first available Chrome/Chromium command
        CHROME_EXEC=""
        for cmd in "${CHROME_COMMANDS[@]}"; do
            if command -v "$cmd" &> /dev/null; then
                CHROME_EXEC="$cmd"
                echo -e "Found browser command: ${GREEN}$cmd${NC}"
                break
            fi
        done
        
        if [ -z "$CHROME_EXEC" ]; then
            echo -e "${RED}Error: No Chrome/Chromium browser found!${NC}"
            echo "Please install Chrome or Chromium using your package manager:"
            echo "  Ubuntu/Debian: sudo apt install google-chrome-stable"
            echo "  Fedora: sudo dnf install google-chrome-stable"
            echo "  Arch: sudo pacman -S chromium"
            exit 1
        fi
        
        # Launch Chrome with disabled security
        "$CHROME_EXEC" \
            --disable-web-security \
            --disable-features=IsolateOrigins,site-per-process \
            --user-data-dir="$DEV_USER_DATA_DIR" \
            --allow-file-access-from-files \
            --allow-cross-origin-auth-prompt \
            "$@"
        ;;
        
    MINGW*|CYGWIN*|MSYS*)
        # Windows (Git Bash, Cygwin, MSYS)
        echo -e "Detected OS: ${GREEN}Windows${NC}"
        echo ""
        echo "For Windows, please use the following PowerShell command:"
        echo ""
        echo -e "${GREEN}PowerShell:${NC}"
        echo '& "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-features=IsolateOrigins,site-per-process --user-data-dir="$env:USERPROFILE\.chrome-dev-profile" --allow-file-access-from-files --allow-cross-origin-auth-prompt'
        echo ""
        echo -e "${GREEN}Command Prompt:${NC}"
        echo '"C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-features=IsolateOrigins,site-per-process --user-data-dir="%USERPROFILE%\.chrome-dev-profile" --allow-file-access-from-files --allow-cross-origin-auth-prompt'
        echo ""
        echo "Adjust the Chrome path if installed in a different location."
        exit 0
        ;;
        
    *)
        echo -e "${RED}Error: Unsupported operating system: $OS${NC}"
        exit 1
        ;;
esac

# ============================================================================
# USAGE INSTRUCTIONS
# ============================================================================
# 
# 1. Make this script executable:
#    chmod +x start-browser-dev.sh
#
# 2. Run the script:
#    ./start-browser-dev.sh
#
# 3. Optionally, pass a URL as an argument:
#    ./start-browser-dev.sh http://localhost:3000
#
# 4. The browser will open with:
#    - Web security disabled (allows CORS requests)
#    - File access from files enabled
#    - Separate user profile (won't affect your main browser)
#
# SECURITY NOTES:
# - NEVER use this browser instance for regular web browsing
# - ONLY use it for testing your local development projects
# - The separate profile ensures your personal data stays secure
# - Close this browser when done with development
#
# ============================================================================