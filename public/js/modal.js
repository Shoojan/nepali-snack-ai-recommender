/**
 * Modal management utilities
 * Handles description selection modal
 */

const MODAL_SELECTORS = {
  modal: "#descriptionModal",
  snackName: "#modalSnackName",
  aiDescription: "#aiDescription",
  defaultDescription: "#defaultDescription",
  aiRadio: 'input[name="descriptionChoice"][value="ai"]',
  defaultRadio: 'input[name="descriptionChoice"][value="default"]',
  confirmBtn: "#confirmDescriptionBtn",
  cancelBtn: "#cancelDescriptionBtn",
  closeBtn: "#closeModal",
};

/**
 * Get modal elements
 * @returns {object} Modal elements
 */
function getModalElements() {
  return {
    modal: document.querySelector(MODAL_SELECTORS.modal),
    snackName: document.querySelector(MODAL_SELECTORS.snackName),
    aiDescription: document.querySelector(MODAL_SELECTORS.aiDescription),
    defaultDescription: document.querySelector(MODAL_SELECTORS.defaultDescription),
    aiRadio: document.querySelector(MODAL_SELECTORS.aiRadio),
    defaultRadio: document.querySelector(MODAL_SELECTORS.defaultRadio),
    confirmBtn: document.querySelector(MODAL_SELECTORS.confirmBtn),
    cancelBtn: document.querySelector(MODAL_SELECTORS.cancelBtn),
    closeBtn: document.querySelector(MODAL_SELECTORS.closeBtn),
  };
}

/**
 * Check if AI description is valid
 * @param {string|null} aiDescription - AI description to check
 * @returns {boolean} True if valid
 */
function isValidAiDescription(aiDescription) {
  return (
    aiDescription &&
    typeof aiDescription === "string" &&
    aiDescription.trim().length > 0
  );
}

/**
 * Configure AI description option (enable or disable)
 * @param {object} elements - Modal elements
 * @param {boolean} enabled - Whether to enable
 */
function configureAiOption(elements, enabled) {
  const { aiRadio, aiDescription, aiOptionContainer } = elements;
  
  if (enabled) {
    if (aiRadio) {
      aiRadio.disabled = false;
      aiRadio.checked = true;
    }
    if (aiDescription) {
      aiDescription.disabled = false;
      aiDescription.placeholder = "AI-generated description (you can edit this)";
      aiDescription.style.border = "2px solid #4caf50";
    }
    if (aiOptionContainer) {
      aiOptionContainer.classList.remove("disabled");
      aiOptionContainer.style.opacity = "1";
    }
    hideWarningMessage(elements);
  } else {
    if (aiRadio) {
      aiRadio.disabled = true;
    }
    if (aiDescription) {
      aiDescription.disabled = true;
      aiDescription.placeholder = "AI description could not be generated";
      aiDescription.style.border = "1px solid #ccc";
    }
    if (aiOptionContainer) {
      aiOptionContainer.classList.add("disabled");
      aiOptionContainer.style.opacity = "0.6";
    }
    showWarningMessage(elements);
  }
}

/**
 * Show warning message for failed AI generation
 * @param {object} elements - Modal elements
 */
function showWarningMessage(elements) {
  const { aiOptionContainer } = elements;
  if (!aiOptionContainer) return;

  let warningMsg = aiOptionContainer.querySelector(".ai-warning-message");
  
  if (!warningMsg) {
    warningMsg = document.createElement("div");
    warningMsg.className = "ai-warning-message";
    warningMsg.textContent =
      "⚠️ AI description could not be generated. Please use the default description.";
    aiOptionContainer.insertBefore(warningMsg, elements.aiDescription);
  }
  
  warningMsg.style.display = "block";
}

/**
 * Hide warning message
 * @param {object} elements - Modal elements
 */
function hideWarningMessage(elements) {
  const { aiOptionContainer } = elements;
  if (!aiOptionContainer) return;

  const warningMsg = aiOptionContainer.querySelector(".ai-warning-message");
  if (warningMsg) {
    warningMsg.style.display = "none";
  }
}

/**
 * Update border styles based on selection
 * @param {object} elements - Modal elements
 * @param {string} selected - Selected option ('ai' or 'default')
 */
function updateSelectionStyles(elements, selected) {
  const { aiDescription, defaultDescription } = elements;
  
  if (selected === "ai" && aiDescription && !aiDescription.disabled) {
    aiDescription.style.border = "2px solid #4caf50";
    defaultDescription.style.border = "1px solid #ddd";
  } else if (selected === "default") {
    if (aiDescription) {
      aiDescription.style.border = aiDescription.disabled
        ? "1px solid #ccc"
        : "1px solid #ddd";
    }
    defaultDescription.style.border = "2px solid #4caf50";
  }
}

/**
 * Show description selection modal
 * @param {object} snackData - Snack data with description options
 */
export function showDescriptionModal(snackData) {
  const elements = getModalElements();
  
  if (!elements.modal || !elements.snackName || !elements.aiDescription || !elements.defaultDescription) {
    console.error("Modal elements not found");
    return;
  }

  // Store snack data
  elements.modal.dataset.snackData = JSON.stringify(snackData);

  // Set snack name
  elements.snackName.textContent = snackData.name;

  // Check if AI description is available
  const hasAiDescription = isValidAiDescription(snackData.aiDescription);

  // Set description values
  elements.aiDescription.value = hasAiDescription ? snackData.aiDescription : "";
  elements.defaultDescription.value = snackData.defaultDescription || "";

  // Get AI option container
  elements.aiOptionContainer = elements.aiDescription.closest(".description-option");

  // Configure AI option
  configureAiOption(elements, hasAiDescription);

  // Auto-select default if AI is not available
  if (!hasAiDescription && elements.defaultRadio) {
    elements.defaultRadio.checked = true;
    updateSelectionStyles(elements, "default");
  } else {
    updateSelectionStyles(elements, "ai");
  }

  // Show modal
  elements.modal.style.display = "flex";
}

/**
 * Hide description selection modal
 */
export function hideDescriptionModal() {
  const elements = getModalElements();
  if (elements.modal) {
    elements.modal.style.display = "none";
    delete elements.modal.dataset.snackData;
  }
}

/**
 * Get selected description from modal
 * @returns {string} Selected description
 */
export function getSelectedDescription() {
  const elements = getModalElements();
  const selected = document.querySelector(
    'input[name="descriptionChoice"]:checked'
  )?.value;

  if (selected === "ai" && elements.aiDescription) {
    return elements.aiDescription.value.trim();
  } else if (elements.defaultDescription) {
    return elements.defaultDescription.value.trim();
  }
  
  return "";
}

/**
 * Get snack data from modal
 * @returns {object|null} Snack data or null
 */
export function getModalSnackData() {
  const elements = getModalElements();
  if (elements.modal?.dataset.snackData) {
    try {
      return JSON.parse(elements.modal.dataset.snackData);
    } catch (e) {
      console.error("Failed to parse snack data from modal", e);
    }
  }
  return null;
}

/**
 * Initialize modal event listeners
 * @param {Function} onConfirm - Callback for confirm button
 * @param {Function} onCancel - Callback for cancel button
 */
export function initModalListeners(onConfirm, onCancel) {
  const elements = getModalElements();

  // Confirm button
  if (elements.confirmBtn) {
    elements.confirmBtn.addEventListener("click", onConfirm);
  }

  // Cancel and close buttons
  const handleCancel = () => {
    hideDescriptionModal();
    if (onCancel) onCancel();
  };

  if (elements.cancelBtn) {
    elements.cancelBtn.addEventListener("click", handleCancel);
  }
  if (elements.closeBtn) {
    elements.closeBtn.addEventListener("click", handleCancel);
  }

  // Close on outside click
  if (elements.modal) {
    elements.modal.addEventListener("click", (e) => {
      if (e.target === elements.modal) {
        handleCancel();
      }
    });
  }

  // Update styles on radio change
  document.querySelectorAll('input[name="descriptionChoice"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const selected = radio.value;
      const elements = getModalElements();
      updateSelectionStyles(elements, selected);
    });
  });
}

