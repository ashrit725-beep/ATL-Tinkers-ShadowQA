#!/usr/bin/env bash
# Reset the ShadowQA demonstration: restore the intentional bugs, drop ShadowQA state, remove fix branches.
set -euo pipefail
cd "$(dirname "$0")/.."

git checkout -- frontend/src/demo/api/payments.js frontend/src/demo/lib/promo.js 2>/dev/null || true
for b in $(git branch --list 'shadowqa/*' | tr -d ' *'); do git branch -D "$b" >/dev/null; done

DB_NAME=$(grep -E '^DB_NAME=' backend/.env | cut -d= -f2 | tr -d '"')
MONGO_URL=$(grep -E '^MONGO_URL=' backend/.env | cut -d= -f2 | tr -d '"')
python3 - "$MONGO_URL" "$DB_NAME" <<'EOF'
import sys
from pymongo import MongoClient
client = MongoClient(sys.argv[1])
db = client[sys.argv[2]]
for name in ("sqa_incidents", "sqa_audit", "sqa_memory", "sqa_qa_runs", "sqa_llm_log"):
    db[name].delete_many({})
print("ShadowQA state cleared")
EOF
echo "Demo reset: bugs restored, ShadowQA memory cleared."
