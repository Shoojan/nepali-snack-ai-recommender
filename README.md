# Nepali Snack AI Recommender 🍴🤖

A sophisticated, interactive web application that recommends **Nepali snacks** based on AI-generated embeddings with intelligent weighted scoring and user personalization. Users can select snacks, add new ones dynamically, and personalize their experience by liking recommendations.

---

## Features

### Core Features
- **AI-Powered Recommendations**: Uses **sentence embeddings** (HuggingFace `all-MiniLM-L6-v2`) to find semantically similar Nepali snacks
- **Weighted Scoring System**: 70% weight to category match, 30% to embedding similarity for balanced recommendations
- **User Personalization**: Like snacks to boost them in future recommendations (+15% boost)
- **Dynamic Snack Addition**: Two-step process where users can review and edit AI-generated descriptions before adding
- **Visual Highlighting**: 
  - Same-category recommendations highlighted with green borders
  - Liked snacks highlighted with pink borders
  - Badges showing category match and liked status
- **Interactive UI**: 
  - Fun animations
  - Emojis
  - Category-based color coding
  - Similarity bars showing recommendation strength
  - Like buttons for personalization
- **MongoDB Backend**: Stores snack data including embeddings for real-time recommendations

---

## Screenshots

<img width="1735" height="767" alt="image" src="https://github.com/user-attachments/assets/0e6bd013-8ebf-49ce-b2ba-e37c2a0b392a" />


---

## Tech Stack

- **Backend**: Node.js + Express (ES Modules)
- **Database**: MongoDB Atlas
- **AI/Embeddings**: HuggingFace SentenceTransformers (`all-MiniLM-L6-v2`)
- **Frontend**: HTML, CSS, JavaScript (ES6 Modules, interactive animations)
- **Python**: For embedding and description generation
- **Development**: Nodemon for auto-reload

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
│   │   └── index.js             # Config constants (weights, thresholds, etc.)
│   ├── middleware/              # Express middleware
│   │   └── errorHandler.js     # Error handling middleware
│   ├── repositories/            # Data access layer
│   │   └── snackRepository.js   # Snack database operations
│   ├── routes/                  # API routes
│   │   └── snackRoutes.js       # Snack-related endpoints
│   ├── services/                # Business logic layer
│   │   ├── embeddingService.js      # Embedding generation
│   │   ├── descriptionService.js    # AI description generation
│   │   ├── initializationService.js  # Database initialization
│   │   ├── recommendationService.js  # Recommendation logic with weighted scoring
│   │   └── snackService.js          # Snack business logic
│   ├── utils/                   # Utility functions
│   │   ├── logger.js            # Logging utility
│   │   ├── math.js              # Mathematical functions (cosine similarity)
│   │   ├── pythonRunner.js      # Python script execution
│   │   ├── snackValidator.js    # Snack validation utilities
│   │   ├── userPreferences.js   # User preferences (backend)
│   │   └── validation.js        # Validation utilities
│   └── server.js                # Main server file
│
├── public/                      # Frontend files
│   ├── js/                      # Frontend modules
│   │   ├── api.js              # API client with error handling
│   │   ├── ui.js                # UI utility functions
│   │   ├── modal.js             # Modal management
│   │   └── userPreferences.js   # User preferences (frontend/localStorage)
│   ├── index.html
│   ├── script.js                # Main application script
│   └── style.css
│
├── generate_embeddings.py        # Generate embeddings for all snacks
├── generate_single_embedding.py  # Generate embedding for single text
├── generate_description.py      # Generate AI descriptions
├── snack_embeddings.json        # Generated embeddings (auto-created)
├── package.json
├── nodemon.json                 # Nodemon configuration
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

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
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

---

## User Flow

### Getting Recommendations
1. **Select a snack** from the dropdown
2. **Click "Get Recommendations"** or use "Surprise Me" for a random selection
3. **View recommendations** with:
   - Weighted scores (0-100%)
   - Visual indicators for same-category snacks (green border + 📂 badge)
   - Liked snacks highlighted (pink border + ❤️ badge)
4. **Like snacks** by clicking the heart button (🤍/❤️) to personalize future recommendations

### Adding a New Snack
1. **Enter snack name** and optionally select a category
2. **Click "Add Snack"**
3. **Review description options** in the modal:
   - AI-generated description (if available)
   - Default description
   - Both are editable
4. **Select and edit** your preferred description
5. **Click "Confirm & Add Snack"**
6. **System generates** embedding vector and saves to database
7. **Recommendations appear** automatically for the new snack

---

## Architecture & Design Patterns

### Design Patterns Used

1. **Repository Pattern**: `snackRepository.js` encapsulates all database operations
2. **Service Layer Pattern**: Business logic separated into service classes
3. **Dependency Injection**: Services depend on repositories, not direct database access
4. **Middleware Pattern**: Error handling and request processing via middleware
5. **Singleton Pattern**: Logger and configuration are singletons
6. **Module Pattern**: Frontend code organized into ES6 modules

### Key Components

- **Logger**: Structured logging with different log levels (DEBUG, INFO, WARN, ERROR)
- **Error Handling**: Centralized error handling middleware with proper error responses
- **Validation**: Input validation utilities for data integrity
- **Configuration**: Environment-based configuration management
- **Python Integration**: Safe execution of Python scripts with error handling
- **API Client**: Centralized API communication with consistent error handling
- **UI Utilities**: Reusable UI functions for consistent user experience

---

## How AI Recommendation Works

### 1. Embeddings Generation
- Each snack has a textual description
- SentenceTransformer converts the description into a 384-dimensional vector (embedding)
- Embeddings capture semantic meaning of the snack descriptions

### 2. Weighted Scoring System
The recommendation algorithm uses a sophisticated weighted scoring approach:

```
weightedScore = (0.7 × categoryScore) + (0.3 × similarityScore) + likedBoost
```

Where:
- **Category Score**: 1.0 if same category, 0.0 if different
- **Similarity Score**: Cosine similarity between embedding vectors (0-1)
- **Liked Boost**: +0.15 if user has liked the snack before (capped at 1.0)

**Example:**
- Same category snack with 0.8 similarity: `0.7 × 1.0 + 0.3 × 0.8 = 0.94`
- Different category snack with 0.9 similarity: `0.7 × 0.0 + 0.3 × 0.9 = 0.27`
- Liked same-category snack: `0.94 + 0.15 = 1.0` (capped)

### 3. Filtering & Sorting
- Only snacks with similarity score ≥ 0.6 are considered
- Recommendations sorted by weighted score (descending)
- Top 5 recommendations are returned

### 4. User Personalization
- Users can like snacks by clicking the heart button
- Liked snacks are stored in browser localStorage
- Liked snacks receive a +15% boost in future recommendations
- Recommendations automatically refresh when you like/unlike

### 5. Dynamic Addition Flow
1. User enters snack name and category
2. System generates AI description (if possible)
3. **Modal appears** with both AI and default descriptions
4. User selects, edits, and confirms description
5. System generates embedding from final description
6. Snack saved to database
7. Recommendations immediately available

---

## API Endpoints

### GET `/snacks`
Get all snacks (for dropdown)
- **Response**: Array of snacks with `name`, `emoji`, `category`

### GET `/recommend/:snack`
Get recommendations for a snack
- **Params**: `snack` - URL-encoded snack name
- **Query Params**: `likedSnacks` - Comma-separated list of liked snack names (optional)
- **Response**: `{ recommendations: [...] }`
- **Each recommendation**: 
  ```json
  {
    "name": "Momo",
    "emoji": "🥟",
    "category": "Street Food",
    "score": 0.94,
    "similarityScore": 0.85,
    "isSameCategory": true,
    "isLiked": false
  }
  ```

### POST `/get-description-options`
Get AI-generated and default description options
- **Body**: `{ name, category? }`
- **Response**: 
  ```json
  {
    "name": "Pizza",
    "category": "Street Food",
    "aiDescription": "AI-generated description...",
    "defaultDescription": "Default description..."
  }
  ```

### POST `/add-snack`
Add a new snack with final description (after user confirmation)
- **Body**: `{ name, category?, description, emoji? }`
- **Response**: `{ snack: {...}, message: "..." }`

---

## Recommendation Algorithm Details

### Weighted Scoring Formula

The system uses a multi-factor scoring approach:

1. **Category Match (70% weight)**
   - Same category: 1.0
   - Different category: 0.0

2. **Embedding Similarity (30% weight)**
   - Cosine similarity between vectors (0-1)
   - Measures semantic similarity of descriptions

3. **Personalization Boost (15% additional)**
   - Applied if user has liked the snack
   - Final score capped at 1.0

### Visual Indicators

- **Green Border + 📂 Badge**: Same category as selected snack
- **Pink Border + ❤️ Badge**: Previously liked by user
- **Score Bar**: Visual representation of weighted score (0-100%)

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
- Frontend displays errors gracefully with visual feedback
- Python script execution errors are caught and handled

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
- `MONGODB_ATLAS_URI`: MongoDB connection string (required)

---

## Code Quality

### Refactoring Highlights
- **Modular Frontend**: Separated into `api.js`, `ui.js`, `modal.js`, `userPreferences.js`
- **Centralized Validation**: `snackValidator.js` for consistent validation
- **DRY Principles**: Removed code duplication
- **Error Handling**: Consistent error handling patterns
- **Type Safety**: Comprehensive JSDoc comments

### Best Practices
- ES6 Modules throughout
- Repository pattern for data access
- Service layer for business logic
- Centralized configuration
- Structured logging
- Input validation

---

## Future Enhancements

Potential improvements:
- User accounts and persistent preferences across devices
- Recommendation history
- Advanced filtering options
- Export recommendations
- Social features (share recommendations)

---

## Author
Sujan Maharjan  
sujan.mhrzn2@gmail.com
