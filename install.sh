#!/usr/bin/env bash
# Agent Platform Bootstrap — bash installer
#
# One-liner install (always latest):
#   curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | bash
#
# With options:
#   curl -fsSL https://raw.githubusercontent.com/zafrirron/Agent-Platform/main/install.sh | \
#     AP_VERSION=v2.2.0 AP_MODE=upgrade bash
#
# Environment variables:
#   AP_VERSION   tag to install (default: latest release)
#   AP_MODE      install | upgrade | repair | force  (default: install)
#
# Requirements: bash, curl, tar, node >=18

set -euo pipefail

REPO="zafrirron/Agent-Platform"
VERSION="${AP_VERSION:-latest}"
MODE="${AP_MODE:-install}"

# ── Colour helpers ────────────────────────────────────────────────────────────
bold='\033[1m'; green='\033[32m'; yellow='\033[33m'; red='\033[31m'; reset='\033[0m'
info()  { echo -e "  ${bold}${green}✔${reset} $*"; }
warn()  { echo -e "  ${yellow}⚠${reset}  $*"; }
error() { echo -e "  ${bold}${red}✖${reset} $*" >&2; exit 1; }

echo ""
echo -e "${bold}Agent Platform Bootstrap — installer${reset}"
echo ""

# ── Check Node.js ─────────────────────────────────────────────────────────────
if ! command -v node &>/dev/null; then
  error "Node.js 18+ is required. Install from https://nodejs.org"
fi
NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
if [ "$NODE_MAJOR" -lt 18 ]; then
  error "Node.js 18+ required (found $(node --version))"
fi
info "Node.js $(node --version)"

# ── Resolve version ───────────────────────────────────────────────────────────
if [ "$VERSION" = "latest" ]; then
  echo "  Fetching latest release..."
  VERSION=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
    | grep '"tag_name"' | sed 's/.*"tag_name": *"\([^"]*\)".*/\1/')
  if [ -z "$VERSION" ]; then
    warn "Could not fetch latest release tag; falling back to main branch"
    VERSION="main"
  fi
fi
info "Version: ${VERSION}"

# ── Download ──────────────────────────────────────────────────────────────────
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

TARBALL="https://github.com/${REPO}/archive/refs/tags/${VERSION}.tar.gz"
if [ "$VERSION" = "main" ]; then
  TARBALL="https://github.com/${REPO}/archive/refs/heads/main.tar.gz"
fi

echo "  Downloading pack..."
if ! curl -fsSL "$TARBALL" | tar -xz -C "$TMP" --strip-components=1 2>/dev/null; then
  error "Download failed. Check the version tag exists: https://github.com/${REPO}/releases"
fi
info "Downloaded to ${TMP}"

# ── Apply ─────────────────────────────────────────────────────────────────────
TARGET="$(pwd)"
echo "  Applying templates (mode=${MODE}) → ${TARGET}"
node "${TMP}/AGENT-PLATFORM-APPLY.js" \
  "--mode=${MODE}" \
  "--pack=${TMP}" \
  "--target=${TARGET}"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${bold}${green}✅ Agent Platform Bootstrap ${VERSION} installed.${reset}"
echo ""
echo "  Next — tell your agent to fill project-specific stubs:"
echo ""
echo -e "  ${bold}Read .agent/README.md and fill all stub files for this project.${reset}"
echo ""
echo "  Or start a full session:"
echo "    Claude Code : Read .claude/prompts/session-start.md and execute it."
echo "    Cursor      : Read .cursor/prompts/session-start.md and execute it."
echo ""
