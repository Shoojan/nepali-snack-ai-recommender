# Nepali Snack AI Recommender 🍴🤖

A simple, fun, interactive web application that recommends **Nepali snacks** based on AI-generated embeddings. Users can select a snack or add new snacks dynamically, and the system suggests similar items with emojis, categories, and similarity scores.

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

- **Backend**: Node.js + Express (ES Modules)
- **Database**: MongoDB Atlas
- **AI/Embeddings**: HuggingFace SentenceTransformers (`all-MiniLM-L6-v2`)
- **Frontend**: HTML, CSS, JavaScript (interactive animations)
- **Python**: For embedding generation

---

## Project Structure

The project follows a clean architecture with separation of concerns:

```
/project-root
│
├── src/                          # Source code
│   ├── config/                   # Configuration modules
│   │   ├── database.js          # Database connection management
│   │   └── index.js             # Application configuration
│   ├── constants/               # Application constants
│   │   └── index.js
│   ├── middleware/              # Express middleware
│   │   └── errorHandler.js     # Error handling middleware
│   ├── repositories/            # Data access layer
│   │   └── snackRepository.js   # Snack database operations
│   ├── routes/                  # API routes
│   │   └── snackRoutes.js       # Snack-related endpoints
│   ├── services/                # Business logic layer
│   │   ├── embeddingService.js      # Embedding generation
│   │   ├── descriptionService.js    # AI description generation
│   │   ├── initializationService.js # Database initialization
│   │   ├── recommendationService.js  # Recommendation logic
│   │   └── snackService.js          # Snack business logic
│   ├── utils/                   # Utility functions
│   │   ├── logger.js            # Logging utility
│   │   ├── math.js              # Mathematical functions
│   │   ├── pythonRunner.js      # Python script execution
│   │   └── validation.js        # Validation utilities
│   └── server.js                # Main server file
│
├── public/                      # Frontend files
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── generate_embeddings.py       # Generate embeddings for all snacks
├── generate_single_embedding.py # Generate embedding for single text
├── generate_description.py      # Generate AI descriptions
├── snack_embeddings.json        # Generated embeddings (auto-created)
├── package.json
├── .env                         # Environment variables
└── README.md
```

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

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```bash
MONGODB_ATLAS_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/snacksDB?retryWrites=true&w=majority"
PORT=3000
NODE_ENV=development
LOG_LEVEL=INFO  # Options: DEBUG, INFO, WARN, ERROR
HUGGINGFACE_TOKEN=your_token_here  # Optional, for HuggingFace API
```

### 4. Setup Python for embeddings
- Install Python (3.9+)
- Create a virtual environment (optional but recommended):
  ```bash
  python3 -m venv venv
  source venv/bin/activate  # On Windows: venv\Scripts\activate
  ```
- Install dependencies:
  ```bash
  pip install sentence-transformers transformers torch
  ```

### 5. Run the application
```bash
npm start
```

The server will:
- Connect to MongoDB
- Automatically generate `snack_embeddings.json` if it doesn't exist
- Populate the database with initial snacks if empty
- Start listening on port 3000 (or PORT from .env)

### 6. Access the application
Open your browser: `http://localhost:3000`

**Features:**
- Select a snack from the dropdown → get top 5 AI recommendations
- "Surprise Me" button → random snack selection
- Add a new snack → system generates embedding, fills missing info, stores in DB, and recommends similar snacks

---

## Architecture & Design Patterns

### Design Patterns Used

1. **Repository Pattern**: `snackRepository.js` encapsulates all database operations
2. **Service Layer Pattern**: Business logic separated into service classes
3. **Dependency Injection**: Services depend on repositories, not direct database access
4. **Middleware Pattern**: Error handling and request processing via middleware
5. **Singleton Pattern**: Logger and configuration are singletons

### Key Components

- **Logger**: Structured logging with different log levels (DEBUG, INFO, WARN, ERROR)
- **Error Handling**: Centralized error handling middleware with proper error responses
- **Validation**: Input validation utilities for data integrity
- **Configuration**: Environment-based configuration management
- **Python Integration**: Safe execution of Python scripts with error handling

---

## How AI Recommendation Works

1. **Embeddings Generation**:
   - Each snack has a textual description
   - SentenceTransformer converts the description into a 384-dimensional vector (embedding)

2. **Similarity Calculation**:
   - Cosine similarity between vectors determines closeness
   - `score = cosineSim(selectedSnack.vector, otherSnack.vector)`

3. **Category Boost**:
   - If a snack belongs to the same category, the similarity score is slightly increased
   - `finalScore = baseScore + (categoryMatch ? CATEGORY_BOOST : 0)`

4. **Filtering & Sorting**:
   - Only snacks with similarity above threshold (0.6) are recommended
   - Top 5 recommendations are shown, ranked by final score

5. **Dynamic Addition**:
   - Users can add a new snack
   - Missing description is generated using AI (GPT-2)
   - Missing emoji is extracted from description or defaulted by category
   - Embedding is generated and saved to MongoDB
   - Recommendations are instantly available

---

## API Endpoints

### GET `/snacks`
Get all snacks (for dropdown)
- **Response**: Array of snacks with `name`, `emoji`, `category`

### GET `/recommend/:snack`
Get recommendations for a snack
- **Params**: `snack` - URL-encoded snack name
- **Response**: `{ recommendations: [...] }`
- **Each recommendation**: `{ name, emoji, category, score }`

### POST `/add-snack`
Add a new snack
- **Body**: `{ name, category?, description?, emoji? }`
- **Response**: `{ snack: {...}, message: "..." }`

---

## Logging

The application uses structured logging with different levels:

- **DEBUG**: Detailed information for debugging
- **INFO**: General informational messages
- **WARN**: Warning messages
- **ERROR**: Error messages

Set `LOG_LEVEL` in `.env` to control logging verbosity.

---

## Error Handling

- All routes use async error handling middleware
- Errors are logged with context
- User-friendly error messages in API responses
- Frontend displays errors gracefully

---

## Development

### Running in Development Mode

**With auto-reload (recommended for development):**
```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when you make changes to files in the `src/` directory.

**Production mode:**
```bash
npm start
# or
node src/server.js
```

### Environment Variables
- `NODE_ENV`: `development` or `production`
- `LOG_LEVEL`: `DEBUG`, `INFO`, `WARN`, or `ERROR`
- `PORT`: Server port (default: 3000)

---

## Author
Sujan Maharjan
sujan.mhrzn2@gmail.com
