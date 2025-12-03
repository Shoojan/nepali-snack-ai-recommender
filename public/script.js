const snackSelect = document.getElementById("snackSelect");
const resultsDiv = document.getElementById("results");
let snackEmojis = {};
let snackCategories = {};

// Load snacks dynamically
async function loadSnacks() {
  try {
    const res = await fetch("/snacks");
    const snackList = await res.json();

    snackSelect.innerHTML = "";
    snackList.forEach((snack) => {
      snackEmojis[snack.name] = snack.emoji || "🍴";
      snackCategories[snack.name] = snack.category || "Other";

      const option = document.createElement("option");
      option.value = snack.name;
      option.textContent = `${snack.name} ${snack.emoji || ""}`;
      snackSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading snacks:", err);
  }
}

loadSnacks();

// Fetch recommendations and emphasize similarity
async function fetchRecommendations(snack) {
  resultsDiv.innerHTML = "Fetching recommendations... 🍪";

  try {
    const res = await fetch(`/recommend/${encodeURIComponent(snack)}`);
    const data = await res.json();

    resultsDiv.innerHTML = "";
    data.recommendations.forEach((rec, i) => {
      const div = document.createElement("div");
      div.className = "result-item";
      div.setAttribute("data-category", snackCategories[rec.name]);
      div.style.animationDelay = `${i * 0.15}s`;
    
      // Name + emoji
      const title = document.createElement("div");
      title.textContent = `${rec.name} ${snackEmojis[rec.name]} (${snackCategories[rec.name]})`;
      title.style.marginBottom = "5px";
      div.appendChild(title);
    
      // Similarity bar
      const barContainer = document.createElement("div");
      barContainer.className = "similarity-bar-container";
    
      const bar = document.createElement("div");
      bar.className = "similarity-bar";
      bar.style.width = `${Math.round(rec.score * 100)}%`; // similarity percentage
      bar.textContent = `${(rec.score * 100).toFixed(0)}%`;
      barContainer.appendChild(bar);
      div.appendChild(barContainer);
    
      // Opacity & scale based on similarity
      div.style.opacity = 0.5 + 0.5 * rec.score;
      div.style.transform = `scale(${0.9 + 0.2 * rec.score})`;
    
      resultsDiv.appendChild(div);
    });
  } catch (err) {
    resultsDiv.innerHTML = "Error fetching recommendations 😢";
    console.error(err);
  }
}

// Button events
document
  .getElementById("getRecBtn")
  .addEventListener("click", () => fetchRecommendations(snackSelect.value));
document.getElementById("surpriseBtn").addEventListener("click", () => {
  const snacks = Object.keys(snackEmojis);
  const randomSnack = snacks[Math.floor(Math.random() * snacks.length)];
  snackSelect.value = randomSnack;
  fetchRecommendations(randomSnack);
});
