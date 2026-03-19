#!/bin/bash

echo "============================================"
echo "  DMV Form Filler - Installation Script"
echo "  macOS / Linux"
echo "============================================"
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

# ──────────────────────────────────────────────
# Step 1: Ensure Node.js is installed
# ──────────────────────────────────────────────
install_node() {
    echo "[INFO] Node.js is not installed. Installing automatically..."
    echo ""

    OS="$(uname -s)"

    case "$OS" in
        Darwin)
            # macOS — use Homebrew
            if ! command -v brew &> /dev/null; then
                echo "[INFO] Homebrew is not installed. Installing Homebrew first..."
                echo "       (you may be prompted for your password)"
                echo ""
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

                # Add Homebrew to PATH for Apple Silicon Macs
                if [ -f "/opt/homebrew/bin/brew" ]; then
                    eval "$(/opt/homebrew/bin/brew shellenv)"
                elif [ -f "/usr/local/bin/brew" ]; then
                    eval "$(/usr/local/bin/brew shellenv)"
                fi

                if ! command -v brew &> /dev/null; then
                    echo "[ERROR] Homebrew installation failed."
                    echo "Please install Node.js v20+ manually from https://nodejs.org/"
                    exit 1
                fi
                echo "[OK] Homebrew installed."
            fi

            echo "Installing Node.js via Homebrew..."
            brew install node

            if [ $? -ne 0 ]; then
                echo "[ERROR] Failed to install Node.js via Homebrew."
                echo "Please install Node.js v20+ manually from https://nodejs.org/"
                exit 1
            fi
            ;;

        Linux)
            echo "Installing Node.js v20 LTS..."
            echo "       (you may be prompted for your password)"
            echo ""

            # Detect package manager and install
            if command -v apt-get &> /dev/null; then
                # Debian / Ubuntu
                curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif command -v dnf &> /dev/null; then
                # Fedora / RHEL 8+
                curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
                sudo dnf install -y nodejs
            elif command -v yum &> /dev/null; then
                # CentOS / RHEL 7
                curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
                sudo yum install -y nodejs
            elif command -v pacman &> /dev/null; then
                # Arch Linux
                sudo pacman -Sy --noconfirm nodejs npm
            elif command -v zypper &> /dev/null; then
                # openSUSE
                sudo zypper install -y nodejs20
            else
                echo "[ERROR] Could not detect package manager."
                echo "Please install Node.js v20+ manually from https://nodejs.org/"
                exit 1
            fi

            if [ $? -ne 0 ]; then
                echo "[ERROR] Failed to install Node.js."
                echo "Please install Node.js v20+ manually from https://nodejs.org/"
                exit 1
            fi
            ;;

        *)
            echo "[ERROR] Unsupported OS: $OS"
            echo "Please install Node.js v20+ manually from https://nodejs.org/"
            exit 1
            ;;
    esac

    # Verify installation
    if ! command -v node &> /dev/null; then
        echo ""
        echo "[ERROR] Node.js was installed but is not in PATH."
        echo "Please restart your terminal and run ./install.sh again."
        exit 1
    fi

    echo "[OK] Node.js installed successfully."
}

if ! command -v node &> /dev/null; then
    install_node
fi

NODE_VER=$(node -v)
echo "[OK] Node.js found: $NODE_VER"

# ──────────────────────────────────────────────
# Step 2: Verify npm
# ──────────────────────────────────────────────
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not available. It should be bundled with Node.js."
    echo "Try reinstalling Node.js or install npm separately:"
    echo "  macOS:  brew install npm"
    echo "  Linux:  sudo apt-get install -y npm"
    exit 1
fi

NPM_VER=$(npm -v)
echo "[OK] npm found: $NPM_VER"
echo ""

# ──────────────────────────────────────────────
# Step 3: Install project dependencies
# ──────────────────────────────────────────────
echo "Installing project dependencies (this may take a few minutes)..."
echo ""

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] npm install failed. Check the output above for details."
    exit 1
fi

echo ""

# ──────────────────────────────────────────────
# Step 4: Generate PDF template if missing
# ──────────────────────────────────────────────
if [ ! -f "backend/templates/REG-156.pdf" ]; then
    echo "Generating PDF template..."
    node backend/scripts/create-template.mjs
    if [ $? -eq 0 ]; then
        echo "[OK] PDF template generated."
    else
        echo "[WARNING] PDF template generation failed. You can retry manually:"
        echo "  node backend/scripts/create-template.mjs"
    fi
else
    echo "[OK] PDF template already exists."
fi

echo ""
echo "============================================"
echo "  Installation complete!"
echo "============================================"
echo ""
echo "To start the application:"
echo "  ./start.sh"
echo ""
echo "To run tests:"
echo "  npm test"
echo ""
echo "Application URLs (after starting):"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3000"
echo ""
