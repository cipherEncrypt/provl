#!/usr/bin/env sh
# Run before first GitHub push. Fails if secrets or local data would be public.
set -e
cd "$(dirname "$0")/.."

echo "Provl: pre-push safety check"

fail() {
  echo "FAIL: $1" >&2
  exit 1
}

# Must be ignored
for path in .env .env.local .provl mcp.json .cursor/mcp.json; do
  if [ -e "$path" ]; then
    git check-ignore -q "$path" 2>/dev/null || fail "$path exists but is NOT in .gitignore"
  fi
done

# Must not be tracked
tracked=$(
  git ls-files .env .env.local .env.production .provl 2>/dev/null || true
)
if [ -n "$tracked" ]; then
  echo "$tracked"
  fail "Sensitive paths are tracked by git (use git rm --cached)"
fi

if git ls-files | rg -q '(^|/)\.env$'; then
  fail ".env is tracked"
fi

if git ls-files | rg -q '^\.provl/'; then
  fail ".provl/ is tracked"
fi

if git ls-files | rg -q '^mcp\.json$'; then
  fail "mcp.json is tracked (use mcp.json.example only)"
fi

# Patterns in tracked files (not .env.example)
if git grep -E 're_[A-Za-z0-9_]{15,}|mongodb\+srv://[^$\s]+:[^$\s]+@' -- . ':!.env.example' ':!package-lock.json' ':!scripts/verify-safe-to-push.sh' 2>/dev/null; then
  fail "Possible API keys or Mongo URI in tracked files"
fi

echo "OK: no .env, .provl, or mcp.json tracked; ignore rules look good."
echo "Tip: npm run build && npm run phase-a:parse-fixtures before you push."