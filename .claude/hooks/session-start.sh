#!/bin/bash
set -euo pipefail

# Only run in Claude Code remote (web) sessions
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "Setting up Figma MCP environment..."

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"

# Load .env if it exists (gitignored, contains FIGMA_ACCESS_TOKEN)
if [ -f "$PROJECT_DIR/.env" ]; then
  echo "Loading .env file..."
  set -a
  # shellcheck disable=SC1090
  source "$PROJECT_DIR/.env"
  set +a
fi

# Export FIGMA_ACCESS_TOKEN for the session via CLAUDE_ENV_FILE
if [ -n "${FIGMA_ACCESS_TOKEN:-}" ]; then
  echo "export FIGMA_ACCESS_TOKEN=\"$FIGMA_ACCESS_TOKEN\"" >> "$CLAUDE_ENV_FILE"
  echo "Figma token loaded."
else
  echo "WARNING: FIGMA_ACCESS_TOKEN is not set."
  echo "Create a .env file with: FIGMA_ACCESS_TOKEN=your_token_here"
fi

# Pre-cache figma-developer-mcp so the MCP server starts instantly
echo "Caching figma-developer-mcp..."
npx -y figma-developer-mcp --help > /dev/null 2>&1 || true

echo "Figma MCP environment ready."
