export function createAnimationStyles() {
      // Add keyframes for spin and color change animations
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); }
    100% { transform: rotate(360deg); }
}
@keyframes colorChange {
    0% { border-top-color: #3498db; }
    33% { border-top-color: #e74c3c; }
    66% { border-top-color: #2ecc71; }
    100% { border-top-color: #3498db; }
}`;
  document.head.appendChild(styleSheet);

}
