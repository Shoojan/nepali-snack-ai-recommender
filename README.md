# Nepali Snack AI Recommender 🍴🤖

A simple fun, interactive web application that recommends **Nepali snacks** based on AI-generated embeddings. Users can select a snack or add new snacks dynamically, and the system suggests similar items with emojis, categories, and similarity scores.

---

## Features

- **AI-Powered Recommendations**: Uses **sentence embeddings** (HuggingFace `all-MiniLM-L6-v2`) to find semantically similar Nepali snacks.
- **Dynamic Snack Addition**: Users can add new snacks with optional category and description. Missing info is automatically filled using AI heuristics.
- **Interactive UI**: 
  - Fun animations
  - Emojis
  - Category-based color coding
  - Similarity bars showing recommendation strength
- **Category Boost**: Recommendations prioritize snacks from the same category (Street Food, Traditional Meal, Dessert) while still allowing cross-category suggestions.
- **MongoDB Backend**: Stores snack data including embeddings for real-time recommendations.

---

## Screenshots

<img width="1395" height="678" alt="image" src="https://github.com/user-attachments/assets/daf93031-972d-41c6-85e6-b9e5e98794d5" />


---

## Tech Stack

- **Backend**: Node.js + Express  
- **Database**: MongoDB Atlas  
- **AI/Embeddings**: HuggingFace SentenceTransformers (`all-MiniLM-L6-v2`)  
- **Frontend**: HTML, CSS, JavaScript (interactive animations)  
- **Python**: For embedding generation  

---

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd nepali-snack-ai-recommender
```

### 2. Install backend dependencies
```bash
npm install 
```

### 3. Setup MongoDB
- Create a free MongoDB Atlas cluster.
- Create a database named snacksDB and a collection named snacks.
- Update .env with your MongoDB connection string:
  ```bash
  MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/snacksDB?retryWrites=true&w=majority"
  PORT=3000
  ```

### 4. Setup Python for embeddings
- Install Python (3.9+)
- Create a virtual environment:
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```
- Install dependencies:
  ```bash
  pip install sentence-transformers
  ```
- Run the embedding generator:
  ```bash
  python generate_embeddings.py
  ```
- This generates snack_embeddings.json.

### 5. Populate MongoDB with embeddings
- Start the server:
  ```bash
  node server.js
  ```
- Server will read snack_embeddings.json and populate the database if not already present.

### 6. Run the application
- Open your browser:
  ``` http://localhost:3000 ```
- Features:
	•	Select a snack from the dropdown → get top 5 AI recommendations.
	•	“Surprise Me” button → random snack selection.
	•	Add a new snack → system generates embedding, fills missing info, stores in DB, and recommends similar snacks.

## Project Structure
```bash
/project-root
│
├── server.js             # Express server
├── package.json
├── .env                  # MongoDB connection and config
├── generate_embeddings.py # Python script to generate embeddings
├── snack_embeddings.json  # Generated embeddings
├── /public
│   ├── index.html
│   ├── script.js
│   └── style.css
└── README.md
```
## How AI Recommendation Works
1.	Embeddings Generation:
   	- Each snack has a textual description.
   	- SentenceTransformer converts the description into a vector (embedding).
3.	Similarity Calculation:
	- Cosine similarity between vectors determines closeness.
	- score = cosineSim(selectedSnack.vector, otherSnack.vector)
4.	Category Boost:
  	- If a snack belongs to the same category, the similarity score is slightly increased.
5.	Filtering & Sorting:
	- Only snacks with similarity above a threshold are recommended.
	- Top 5 recommendations are shown, ranked by final score.
6.	Dynamic Addition:
	- Users can add a new snack.
	- Missing description, emoji, or category is generated heuristically or via AI.
	- Embedding is generated and saved to MongoDB.
	- Recommendations are instantly available.

## Author
Sujan Maharjan
sujan.mhrzn2@gmail.com
