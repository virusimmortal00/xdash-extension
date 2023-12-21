export function selectImage(url: string, isCustom: boolean = false): void {
  console.log('selectImage called with URL:', url, 'Is custom URL:', isCustom);

  // Fetch 'customImagePreview' element from the DOM
  const customImagePreview: HTMLElement | null =
    document.getElementById('customImagePreview');

  // Deselect all predefined images
  document.querySelectorAll('.image-option').forEach((img: Element) => {
    (img as HTMLElement).style.border = 'none';
  });

  if (isCustom && customImagePreview) {
    // Display custom image preview
    customImagePreview.innerHTML = `<img src="${url}" class="preview-image">`;
    customImagePreview.style.border = '2px solid green';
    customImagePreview.style.display = 'block';
  } else {
    // Highlight selected predefined image
    const predefinedImage: HTMLImageElement | null = document.querySelector(
      `.image-option[src="${url}"]`
    );
    if (predefinedImage) {
      predefinedImage.style.border = '2px solid green';
    }
    if (customImagePreview) {
      customImagePreview.innerHTML = '';
      customImagePreview.style.display = 'none';
    }
  }
}
