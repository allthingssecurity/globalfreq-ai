#!/usr/bin/env bash

set -euo pipefail

# Simple helper to push this project to GitHub and trigger Pages deployment.
# Usage:
#   export GITHUB_TOKEN=your_personal_access_token
#   export GITHUB_USER=allthingssecurity  # or your username
#   export REPO_NAME=globalfreq-ai        # or your repo name
#   bash deploy_to_github.sh

GITHUB_USER="${GITHUB_USER:-allthingssecurity}"
REPO_NAME="${REPO_NAME:-globalfreq-ai}"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "ERROR: Please export GITHUB_TOKEN with a GitHub PAT before running this script."
  exit 1
fi

API_REPO_URL="https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}"
API_CREATE_URL="https://api.github.com/user/repos"

echo "==> Checking if repo ${GITHUB_USER}/${REPO_NAME} exists on GitHub..."
if ! curl -fsS -H "Authorization: token ${GITHUB_TOKEN}" "${API_REPO_URL}" >/dev/null 2>&1; then
  echo "==> Repo not found; creating it via GitHub API..."
  curl -fsS -X POST \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    "${API_CREATE_URL}" \
    -d "{\"name\":\"${REPO_NAME}\",\"private\":false}" >/dev/null
  echo "==> Repo created."
else
  echo "==> Repo already exists."
fi

echo "==> Initializing local git repo and pushing code..."
git init
git add .
git commit -m "Initial GlobalFreq AI app" || true
git branch -M main

git remote remove origin 2>/dev/null || true
git remote add origin "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

git push -u origin main

echo "==> Push complete. GitHub Actions (deploy.yml) will build and deploy to Pages."
echo "Once the workflow finishes, your site will be at:"
echo "  https://${GITHUB_USER}.github.io/${REPO_NAME}/"

