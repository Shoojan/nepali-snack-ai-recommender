#!/usr/bin/env python3
"""
Generate embeddings for all Nepali snacks.
Creates snack_embeddings.json file with vector embeddings.
"""

import json
import sys

try:
    from sentence_transformers import SentenceTransformer
except ImportError:
    print("Error: sentence_transformers not installed", file=sys.stderr)
    sys.exit(1)

# Nepali snacks with rich descriptions, emojis, and categories
snacks = {
    "Momo": {
        "desc": "Steamed or fried dumplings filled with vegetables, chicken, or buffalo meat, served with spicy tomato chutney. Popular street food in Nepal, often eaten with friends or as a snack.",
        "emoji": "🥟",
        "category": "Street Food"
    },
    "Buff Momo": {
        "desc": "Nepali dumplings filled specifically with buffalo meat, steamed or fried, served with chili sauce. A hearty street snack popular in cities like Kathmandu and Pokhara.",
        "emoji": "🥟",
        "category": "Street Food"
    },
    "Vegetable Chowmein": {
        "desc": "Stir-fried noodles with mixed vegetables, adapted into Nepali cuisine from Chinese style. Eaten as a snack or light meal, commonly available in street stalls.",
        "emoji": "🍜",
        "category": "Street Food"
    },
    "Pani Puri": {
        "desc": "Crispy hollow puris filled with spiced potatoes, chickpeas, and flavored water. Popular Nepali street snack enjoyed in groups.",
        "emoji": "🫔",
        "category": "Street Food"
    },
    "Chatpate": {
        "desc": "Spicy and tangy puffed rice snack mixed with potatoes, onions, and chutney. A common street snack in Nepal, perfect for quick munching.",
        "emoji": "🥗",
        "category": "Street Food"
    },
    "Sekuwa": {
        "desc": "Grilled, marinated meat skewers, cooked over charcoal. Popular Nepali street food, usually served with mustard sauce.",
        "emoji": "🥩",
        "category": "Street Food"
    },
    "Dhido": {
        "desc": "Traditional Nepali staple made from buckwheat or millet flour, served with vegetable curry, meat, or gundruk soup. A healthy and filling main meal in rural Nepal.",
        "emoji": "🍲",
        "category": "Traditional Meal"
    },
    "Aloo Tama": {
        "desc": "Nepali curry made with potatoes, bamboo shoots, and black-eyed peas, served as a traditional main dish. Slightly sour and savory, eaten with rice or Dhido.",
        "emoji": "🥔",
        "category": "Traditional Meal"
    },
    "Thukpa": {
        "desc": "Hearty Nepali noodle soup with vegetables, meat, or chicken, perfect for cold weather. A comforting meal in Himalayan regions.",
        "emoji": "🍲",
        "category": "Traditional Meal"
    },
    "Yomari": {
        "desc": "Sweet dumpling made from rice flour and filled with jaggery and sesame seeds. Traditionally prepared during Newari festivals as a dessert.",
        "emoji": "🍬",
        "category": "Dessert"
    },
    "Sel Roti": {
        "desc": "Ring-shaped, sweet rice flour bread, deep-fried and crispy outside, soft inside. Served during festivals as a dessert or snack.",
        "emoji": "🍩",
        "category": "Dessert"
    }
}

def main():
    try:
        # Initialize embedding model
        print("Loading embedding model...", file=sys.stderr)
        model = SentenceTransformer('all-MiniLM-L6-v2')
        print("Model loaded successfully.", file=sys.stderr)
        
        # Generate embeddings
        print(f"Generating embeddings for {len(snacks)} snacks...", file=sys.stderr)
        embeddings = {}
        for name, info in snacks.items():
            vector = model.encode(info["desc"]).tolist()
            embeddings[name] = {
                "vector": vector,
                "emoji": info["emoji"],
                "category": info["category"],
                "description": info["desc"]
            }
            print(f"Generated embedding for {name}", file=sys.stderr)
        
        # Save embeddings to JSON
        with open("snack_embeddings.json", "w") as f:
            json.dump(embeddings, f, indent=2)
        
        print(f"Successfully saved {len(embeddings)} snack embeddings to snack_embeddings.json!", file=sys.stderr)
    except Exception as e:
        print(f"Error generating embeddings: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
