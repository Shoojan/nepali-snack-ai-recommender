import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
// app.use(express.json());
app.use(express.static("public"));

const MONGO_URI = "mongodb://localhost:27017"; // replace if needed
const client = new MongoClient(MONGO_URI);
const dbName = "snackDB";
const collectionName = "snacks";

await client.connect();
const db = client.db(dbName);
const collection = db.collection(collectionName);

// Populate MongoDB with embeddings
async function populateDB() {
  const data = JSON.parse(fs.readFileSync("snack_embeddings.json", "utf-8"));
  for (const [name, info] of Object.entries(data)) {
    await collection.updateOne(
      { name },
      { $set: { ...info, name } },
      { upsert: true }
    );
  }
  console.log("MongoDB snack collection populated!");
}
await populateDB();

// API to get all snacks with emoji & category
app.get("/snacks", async (req, res) => {
  try {
    const snacks = await collection
      .find({}, { projection: { name: 1, emoji: 1, category: 1, _id: 0 } })
      .toArray();
    res.json(snacks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Simple cosine similarity function
function cosineSim(vecA, vecB) {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (magA * magB);
}

// API to get recommendations
const SIM_THRESHOLD = 0.6; // minimum similarity to recommend
const CATEGORY_BOOST = 0.1; // boost same-category snacks

app.get("/recommend/:snack", async (req, res) => {
  try {
    const snackName = req.params.snack;
    const snack = await collection.findOne({ name: snackName });
    if (!snack) return res.status(404).send("Snack not found");

    const allSnacks = await collection
      .find({ name: { $ne: snackName } })
      .toArray();

    // Compute similarity and optionally boost by category
    const recommendations = allSnacks
      .map((s) => {
        let score = cosineSim(snack.vector, s.vector);
        if (s.category === snack.category) score += CATEGORY_BOOST; // boost same category
        return {
          name: s.name,
          emoji: s.emoji,
          category: s.category,
          score,
        };
      })
      .filter((s) => s.score >= SIM_THRESHOLD) // filter out irrelevant items
      .sort((a, b) => b.score - a.score) // sort by final score
      .slice(0, 5); // top 5 recommendations

    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
