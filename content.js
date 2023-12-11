const url = window.location.href;

function createLoadingOverlay() {
    console.log("Creating loading overlay");
    let overlay = document.createElement('div');
    let spinner = document.createElement('div');
    let message = document.createElement('div');

    // Overlay styling
    overlay.id = 'my-extension-loading-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = '#FFFFFF';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    // Spinner styling
    spinner.id = 'my-extension-spinner';
    spinner.style.border = '8px solid #f3f3f3'; // Light grey for the base
    spinner.style.borderTop = '8px solid #3498db'; // Initial color
    spinner.style.borderRadius = '50%';
    spinner.style.width = '60px';
    spinner.style.height = '60px';
    spinner.style.animation = 'spin 3s infinite, colorChange 3s infinite';

    // Message styling
    message.id = 'my-extension-message';
    message.innerText = 'xDash Creation In Process';
    message.style.fontSize = '20px';
    message.style.color = '#333333';
    message.style.fontWeight = 'bold';
    message.style.marginTop = '20px';
    message.style.fontFamily = 'Museo, sans-serif';

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
        "Attribution is our favorite kind of 'bution."
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

function removeLoadingOverlay() {
    //console.log("Attempting to remove loading overlay");
    let overlay = document.getElementById('my-extension-loading-overlay');
    if (overlay) {
        overlay.remove();
        console.log("Loading overlay removed");
    } else {
        console.log("Loading overlay not found");
    }
}

createLoadingOverlay();

function replaceImage() {
    console.log("Attempting to replace images");
    chrome.storage.sync.get(['selectedImage'], function(result) {
        let imageToUse = result.selectedImage;
        console.log(`Image to use: ${imageToUse}`);

        if (!imageToUse) {
            console.log("No selected image found in storage, using default");
            imageToUse = 'https://web1.sa.appsflyer.com/xdash_images/af_icon_rainbow.png'; // Default image URL
        }

        let images = document.querySelectorAll('.MuiAvatar-img');
        let imagesChanged = 0;
        let totalImages = images.length;

        console.log(`Found ${totalImages} images for replacement with '${imageToUse}'`);

        if (totalImages === 0) {
            removeLoadingOverlay();
            return;
        }

        images.forEach(function(img, index) {
            img.onload = function() {
                console.log(`Image ${index} loaded: ${img.src}`);
                imagesChanged++;
                if (imagesChanged === totalImages) {
                    console.log("All images loaded, removing overlay");
                    removeLoadingOverlay();
                }
            };
            img.onerror = function() {
                console.log(`Error loading image ${index}`);
            };

            img.src = imageToUse;
        });

        // Fallback mechanism
        setTimeout(() => {
            if (imagesChanged !== totalImages) {
                console.log("Fallback: Removing overlay");
                removeLoadingOverlay();
            }
        }, 5000); // Adjust the timeout as necessary
    });
}




function replaceTextInElement(element) {
    //console.log("Attempting to replace text in element", element);
    chrome.storage.sync.get(['mappings'], function(result) {
        if (result.mappings && element) {
            const mappings = result.mappings;
            element.childNodes.forEach(function(node) {
                if (node.nodeType === Node.TEXT_NODE) {
                    mappings.forEach(mapping => {
                        if(mapping.section === 'mediaSources' || mapping.section === 'inAppEvents'){
                            const regex = new RegExp(mapping.original, 'gi');
                            node.textContent = node.textContent.replace(regex, mapping.newText);
                        }
                    });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    replaceTextInElement(node);
                }
            });
        }
    });
}

function observeDOMChanges() {
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    replaceTextInElement(node);
                }
            });
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
}



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

let interval = setInterval(function() {
    if (document.querySelector('.MuiAvatar-img')) {
        console.log("Starting image and text replacement process");
        replaceImage();
        replaceTextInElement(document.body);
        clearInterval(interval);
    }
}, 2000);

// Call this function at the end of your script
observeDOMChanges();

