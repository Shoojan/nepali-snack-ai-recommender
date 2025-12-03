#!/usr/bin/env python3
"""
Generate a single embedding vector for a given text.
Used by the Node.js server to generate embeddings for new snacks.
"""

import sys
import json

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print(json.dumps({"error": "sentence_transformers not installed"}), file=sys.stderr)
    sys.exit(1)

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Text argument required"}), file=sys.stderr)
        sys.exit(1)
    
    text = sys.argv[1]
    
    if not text or not text.strip():
        print(json.dumps({"error": "Text cannot be empty"}), file=sys.stderr)
        sys.exit(1)
    
    try:
        model = SentenceTransformer('all-MiniLM-L6-v2')
        vector = model.encode(text).tolist()
        print(json.dumps(vector))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
