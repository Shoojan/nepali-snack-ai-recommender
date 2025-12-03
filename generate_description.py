#!/usr/bin/env python3
"""
Generate a description for a Nepali snack using AI.
Uses GPT-2 model for text generation.
"""

import sys
import json

try:
    from transformers import pipeline
except ImportError:
    print(json.dumps({"error": "transformers not installed"}), file=sys.stderr)
    sys.exit(1)


def main():
    snack_name = sys.argv[1] if len(sys.argv) > 1 else "A Nepali snack"

    if not snack_name or not snack_name.strip():
        snack_name = "A Nepali snack"

    try:
        # Use a small text-generation model, local or from HuggingFace hub
        # gpt2 works locally but takes a lot of time to generate the description and the output is not very good.
        # generator = pipeline("text-generation", model="gpt2")

        # Use a small instruction-tuned model
        generator = pipeline("text-generation", model="distilgpt2")

        prompt = f"Write a short, fun, one-sentence description for the Nepali snack '{snack_name}' including an emoji."

        result = generator(
            prompt,
            max_new_tokens=30,       # preferred way to limit output
            do_sample=True,
            top_p=0.9,
            truncation=True          # ensure input is truncated safely
        )

        # Extract and clean the generated text
        generated_text = result[0]['generated_text'].strip()
        
        # Remove the prompt from the beginning if present
        if generated_text.startswith(prompt):
            generated_text = generated_text[len(prompt):].strip()

        print(json.dumps(generated_text))
    except Exception as e:
        # Fallback description
        fallback = f"{snack_name} is a delicious Nepali snack."
        print(json.dumps(fallback))
        print(f"Error generating description: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
