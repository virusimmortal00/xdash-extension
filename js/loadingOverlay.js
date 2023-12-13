// loadingOverlay.js

export function createLoadingOverlay() {
  console.log("Creating loading overlay");
  let overlay = document.createElement("div");
  let spinner = document.createElement("div");
  let message = document.createElement("div");

  // Overlay styling
  overlay.id = "my-extension-loading-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "#FFFFFF";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";

  // Spinner styling
  spinner.id = "my-extension-spinner";
  spinner.style.border = "8px solid #f3f3f3"; // Light grey for the base
  spinner.style.borderTop = "8px solid #3498db"; // Initial color
  spinner.style.borderRadius = "50%";
  spinner.style.width = "60px";
  spinner.style.height = "60px";
  spinner.style.animation = "spin 3s infinite, colorChange 3s infinite";

  // Message styling
  message.id = "my-extension-message";
  message.innerText = "xDash Creation In Process";
  message.style.fontSize = "20px";
  message.style.color = "#333333";
  message.style.fontWeight = "bold";
  message.style.marginTop = "20px";
  message.style.fontFamily = "Museo, sans-serif";

  overlay.appendChild(spinner);
  overlay.appendChild(message);
  document.body.appendChild(overlay);

  // Dynamic message updates
  const messages = [
    "Life is like a box of chocolates, but with less SKAN.",
    "Grounding up some fresh attribution.",
    "Compiling our deepest darkest secrets.",
    "Mo' ROAS, mo' problems.",
    "I'm sure some of these numbers are right...",
    "Pre-heating the deep links.",
    "Attribution is our favorite kind of 'bution.",
  ];

  // Shuffle messages
  for (let i = messages.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [messages[i], messages[j]] = [messages[j], messages[i]];
  }

  let messageIndex = 0;
  message.innerText = messages[messageIndex]; // Set initial random message
  setInterval(() => {
    messageIndex = (messageIndex + 1) % messages.length;
    message.innerText = messages[messageIndex];
  }, 1500); // Change message every second

  console.log("Loading overlay created");
}

export function removeLoadingOverlay() {
  //console.log("Attempting to remove loading overlay");
  let overlay = document.getElementById("my-extension-loading-overlay");
  if (overlay) {
    overlay.remove();
    console.log("Loading overlay removed");
  } else {
    console.log("Loading overlay not found");
  }
}
