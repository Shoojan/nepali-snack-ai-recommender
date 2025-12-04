/**
 * Main application script
 * Orchestrates UI interactions and business logic
 */

import * as api from "./js/api.js";
import * as ui from "./js/ui.js";
import * as modal from "./js/modal.js";
import * as userPrefs from "./js/userPreferences.js";

// DOM elements
const snackSelect = document.getElementById("snackSelect");
const resultsDiv = document.getElementById("results");
const getRecBtn = document.getElementById("getRecBtn");
const surpriseBtn = document.getElementById("surpriseBtn");
const addSnackBtn = document.getElementById("addSnackBtn");
const newSnackName = document.getElementById("newSnackName");
const newSnackCategory = document.getElementById("newSnackCategory");
const addSnackStatus = document.getElementById("addSnackStatus");

// State
let snackEmojis = {};
let snackCategories = {};
let isLoading = false;

/**
 * Load snacks from API and populate dropdown
 */
async function loadSnacks() {
  try {
    ui.showLoading("Loading snacks...");
    const snackList = await api.getSnacks();

    if (!Array.isArray(snackList)) {
      throw new Error("Invalid response format");
    }

    snackSelect.innerHTML = "";
    snackEmojis = {};
    snackCategories = {};

    snackList.forEach((snack) => {
      snackEmojis[snack.name] = snack.emoji || "🍴";
      snackCategories[snack.name] = snack.category || "Other";
      const option = document.createElement("option");
      option.value = snack.name;
      option.textContent = `${snack.name} ${snack.emoji || ""}`;
      snackSelect.appendChild(option);
    });

    if (snackList.length === 0) {
      ui.showError("No snacks available. Please add some snacks first.");
    } else {
      ui.clearResults();
    }
  } catch (err) {
    console.error("Error loading snacks:", err);
    ui.showError("Failed to load snacks. Please refresh the page.");
  }
}

/**
 * Create recommendation item element
 * @param {object} rec - Recommendation object
 * @param {number} index - Index for animation delay
 * @param {string} currentCategory - Category of the current snack
 * @returns {HTMLElement} Recommendation element
 */
function createRecommendationElement(rec, index, currentCategory) {
  const div = document.createElement("div");
  const category = snackCategories[rec.name] || "Other";
  const isSameCategory = rec.isSameCategory || category === currentCategory;
  const isLiked = rec.isLiked || userPrefs.isLiked(rec.name);
  
  // Add classes for styling
  div.className = "result-item";
  if (isSameCategory) {
    div.classList.add("same-category");
  }
  if (isLiked) {
    div.classList.add("liked");
  }
  
  div.setAttribute("data-category", category);
  div.style.animationDelay = `${index * 0.15}s`;

  // Title with badges
  const titleContainer = document.createElement("div");
  titleContainer.className = "result-title-container";
  
  const title = document.createElement("div");
  title.className = "result-title";
  title.textContent = `${rec.name} ${snackEmojis[rec.name] || "🍴"}`;
  titleContainer.appendChild(title);
  
  // Badges
  const badges = document.createElement("div");
  badges.className = "result-badges";
  
  if (isSameCategory) {
    const categoryBadge = document.createElement("span");
    categoryBadge.className = "badge badge-category";
    categoryBadge.textContent = "📂 Same Category";
    badges.appendChild(categoryBadge);
  }
  
  if (isLiked) {
    const likedBadge = document.createElement("span");
    likedBadge.className = "badge badge-liked";
    likedBadge.textContent = "❤️ Liked";
    badges.appendChild(likedBadge);
  }
  
  titleContainer.appendChild(badges);
  div.appendChild(titleContainer);

  // Category label
  const categoryLabel = document.createElement("div");
  categoryLabel.className = "result-category";
  categoryLabel.textContent = `(${category})`;
  div.appendChild(categoryLabel);

  // Similarity bar
  const barContainer = document.createElement("div");
  barContainer.className = "similarity-bar-container";
  const bar = document.createElement("div");
  bar.className = "similarity-bar";
  const scorePercent = Math.round(rec.score * 100);
  bar.style.width = `${scorePercent}%`;
  bar.textContent = `${scorePercent}%`;
  barContainer.appendChild(bar);
  div.appendChild(barContainer);

  // Like button
  const likeButton = document.createElement("button");
  likeButton.className = `like-button ${isLiked ? "liked" : ""}`;
  likeButton.innerHTML = isLiked ? "❤️" : "🤍";
  likeButton.title = isLiked ? "Unlike this snack" : "Like this snack";
  likeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleLike(rec.name, likeButton);
  });
  div.appendChild(likeButton);

  // Visual feedback based on score
  div.style.opacity = 0.5 + 0.5 * rec.score;
  div.style.transform = `scale(${0.9 + 0.2 * rec.score})`;

  return div;
}

/**
 * Toggle like status for a snack
 * @param {string} snackName - Name of the snack
 * @param {HTMLElement} button - Like button element
 */
function toggleLike(snackName, button) {
  const isLiked = userPrefs.isLiked(snackName);
  
  if (isLiked) {
    userPrefs.unlikeSnack(snackName);
    button.innerHTML = "🤍";
    button.classList.remove("liked");
    button.title = "Like this snack";
  } else {
    userPrefs.likeSnack(snackName);
    button.innerHTML = "❤️";
    button.classList.add("liked");
    button.title = "Unlike this snack";
  }
  
  // Update the parent element's liked class
  const resultItem = button.closest(".result-item");
  if (resultItem) {
    if (isLiked) {
      resultItem.classList.remove("liked");
    } else {
      resultItem.classList.add("liked");
    }
  }
  
  // Refresh recommendations to apply personalization boost
  const snackSelect = document.getElementById("snackSelect");
  if (snackSelect && snackSelect.value) {
    fetchRecommendations(snackSelect.value);
  }
}

/**
 * Fetch and display recommendations for a snack
 * @param {string} snack - Snack name
 */
async function fetchRecommendations(snack) {
  if (!snack || snack.trim() === "") {
    ui.showError("Please select a snack first.");
    return;
  }

  if (isLoading) {
    return;
  }

  isLoading = true;
  ui.setButtonLoading(getRecBtn, true, "Loading...");
  ui.showLoading("Fetching recommendations...");

  try {
    // Get liked snacks and pass to API for personalization
    const likedSnacks = userPrefs.getLikedSnacksAsString();
    const data = await api.getRecommendations(snack, likedSnacks);

    if (!data.recommendations || !Array.isArray(data.recommendations)) {
      throw new Error("Invalid response format");
    }

    if (data.recommendations.length === 0) {
      ui.showEmptyState();
      return;
    }

    // Get current snack's category for highlighting
    const currentCategory = snackCategories[snack] || "Other";

    // Display recommendations
    ui.clearResults();
    data.recommendations.forEach((rec, i) => {
      const element = createRecommendationElement(rec, i, currentCategory);
      resultsDiv.appendChild(element);
    });
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    ui.showError(
      err.message || "Failed to fetch recommendations. Please try again."
    );
  } finally {
    isLoading = false;
    ui.setButtonLoading(getRecBtn, false);
  }
}

/**
 * Confirm and add snack with selected description
 */
async function confirmAndAddSnack() {
  const snackData = modal.getModalSnackData();
  if (!snackData) {
    return;
  }

  const finalDescription = modal.getSelectedDescription();

  if (!finalDescription) {
    alert("Description cannot be empty. Please enter a description.");
    return;
  }

  modal.hideDescriptionModal();
  isLoading = true;
  ui.setButtonLoading(addSnackBtn, true, "Processing...");
  ui.showStatus(addSnackStatus, "🧠 Creating embedding vector...", "info");

  try {
    const data = await api.addSnack({
      name: snackData.name,
      category: snackData.category,
      description: finalDescription,
    });

    // Success
    ui.showStatus(
      addSnackStatus,
      `✅ Snack "${data.snack.name}" added successfully! 🎉`,
      "success"
    );
    newSnackName.value = "";
    newSnackCategory.value = "";

    // Hide status after 3 seconds
    setTimeout(() => {
      ui.hideStatus(addSnackStatus);
    }, 3000);

    // Reload snacks and show recommendations
    await loadSnacks();
    snackSelect.value = data.snack.name;
    await fetchRecommendations(data.snack.name);
  } catch (err) {
    console.error("Error adding snack:", err);
    ui.showStatus(
      addSnackStatus,
      `❌ Error: ${err.message || "Failed to add snack. Please try again."}`,
      "error"
    );
    setTimeout(() => {
      ui.hideStatus(addSnackStatus);
    }, 5000);
  } finally {
    isLoading = false;
    ui.setButtonLoading(addSnackBtn, false);
  }
}

/**
 * Get description options and show modal
 */
async function addSnack() {
  const name = newSnackName.value.trim();
  const category = newSnackCategory.value;

  if (!name) {
    alert("Please enter a snack name");
    return;
  }

  if (isLoading) {
    return;
  }

  isLoading = true;
  ui.setButtonLoading(addSnackBtn, true, "Generating...");
  ui.showStatus(
    addSnackStatus,
    "🤖 Generating AI description... This may take a moment",
    "info"
  );

  try {
    const data = await api.getDescriptionOptions(name, category);

    // Hide status and show modal
    ui.hideStatus(addSnackStatus);
    modal.showDescriptionModal(data);
  } catch (err) {
    console.error("Error getting description options:", err);
    ui.showStatus(
      addSnackStatus,
      `❌ Error: ${
        err.message || "Failed to generate descriptions. Please try again."
      }`,
      "error"
    );
    setTimeout(() => {
      ui.hideStatus(addSnackStatus);
    }, 5000);
  } finally {
    isLoading = false;
    ui.setButtonLoading(addSnackBtn, false);
  }
}

/**
 * Handle surprise button click
 */
function handleSurprise() {
  const snacks = Object.keys(snackEmojis);
  if (snacks.length === 0) {
    ui.showError("No snacks available. Please add some snacks first.");
    return;
  }

  const randomSnack = snacks[Math.floor(Math.random() * snacks.length)];
  snackSelect.value = randomSnack;
  fetchRecommendations(randomSnack);
}

// Initialize event listeners
function initEventListeners() {
  getRecBtn.addEventListener("click", () => {
    fetchRecommendations(snackSelect.value);
  });

  surpriseBtn.addEventListener("click", handleSurprise);
  addSnackBtn.addEventListener("click", addSnack);

  // Modal event listeners
  modal.initModalListeners(confirmAndAddSnack, () => {
    // On cancel, just hide the modal (already handled)
  });

  // Allow Enter key to submit add snack form
  newSnackName.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addSnack();
    }
  });
}

// Initialize application
function init() {
  initEventListeners();
  loadSnacks();
}

// Start application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
