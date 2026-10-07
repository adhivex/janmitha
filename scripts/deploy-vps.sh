#!/usr/bin/env bash
# Deploys this checkout to the VPS preview: /opt/apps/janmitha (systemd webapp@janmitha, port from env).
# Usage (as root, from the repo root): scripts/deploy-vps.sh
# Env (secrets) lives in /opt/deploy/env/janmitha.env and is never copied from the repo.
set -euo pipefail

SRC=$(cd "$(dirname "$0")/.." && pwd)
DEST=/opt/projects/janmitha/app
ENV_FILE=/opt/deploy/env/janmitha.env
LOG=/opt/deploy/logs/build-janmitha.log
export NEXT_TELEMETRY_DISABLED=1 CI=1

[ -f "$ENV_FILE" ] || { echo "Missing $ENV_FILE" >&2; exit 1; }

echo "==> Sync source to $DEST"
mkdir -p "$DEST"
rsync -a --delete \
  --exclude node_modules --exclude '.next' --exclude '.env*' --exclude .git \
  --exclude 'supabase/.temp' --exclude 'supabase/.branches' --exclude 'docs/screenshots' \
  --exclude '*.tsbuildinfo' --exclude next-env.d.ts \
  "$SRC/" "$DEST/"

cd "$DEST"
set -a; . "$ENV_FILE"; set +a

echo "==> Install dependencies (lockfile)"
echo "### $(date -Is) npm ci" >>"$LOG"
npm ci --no-audit --no-fund >>"$LOG" 2>&1

echo "==> Build"
echo "### $(date -Is) build" >>"$LOG"
npm run build >>"$LOG" 2>&1 || { echo "Build failed, see $LOG" >&2; tail -30 "$LOG" >&2; exit 1; }

# The app runs as the unprivileged webapp user, which may only write to .next.
chown -R webapp:webapp "$DEST/.next"

echo "==> Restart webapp@janmitha"
systemctl restart webapp@janmitha
for i in $(seq 1 30); do
  curl -fs -o /dev/null "http://127.0.0.1:${PORT}/robots.txt" && { echo "Up on port $PORT"; exit 0; }
  sleep 1
done
echo "App did not come up; check: journalctl -u webapp@janmitha -n 50" >&2
exit 1
