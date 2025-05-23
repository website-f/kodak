/**
 * Gallery Modal Implementation
 * Handles the image gallery modal functionality, navigation, and download features
 */

// Gallery configuration and state
const galleryState = {
  images: [],
  currentIndex: 0,
  isOpen: false
};

// DOM Elements
let modalElement;
let modalImage;
let imageCaption;
let downloadButton;
let prevButton;
let nextButton;
let closeButton;

/**
 * Initialize the gallery functionality
 */
export function initGallery() {
  // Collect all gallery images from the page
  const galleryImages = document.querySelectorAll('.category-image');
  
  // Store image data for the gallery
  galleryState.images = Array.from(galleryImages).map(img => ({
    src: img.src,
    alt: img.alt,
    caption: img.nextElementSibling?.textContent || img.alt
  }));
  
  // Get DOM elements
  modalElement = document.getElementById('gallery-modal');
  modalImage = document.getElementById('modal-image');
  imageCaption = document.getElementById('image-caption');
  downloadButton = document.getElementById('download-button');
  prevButton = document.querySelector('.prev-button');
  nextButton = document.querySelector('.next-button');
  closeButton = document.querySelector('.close-button');
  
  // Add event listeners to gallery images
  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openModal(index));
  });
  
  // Set up modal event listeners
  setupModalEventListeners();
}

/**
 * Set up all event listeners for the modal
 */
function setupModalEventListeners() {
  // Navigation buttons
  prevButton.addEventListener('click', showPreviousImage);
  nextButton.addEventListener('click', showNextImage);
  
  // Close button
  closeButton.addEventListener('click', closeModal);
  
  // Download button
  downloadButton.addEventListener('click', downloadCurrentImage);
  
  // Close modal when clicking outside the content
  modalElement.addEventListener('click', (e) => {
    if (e.target === modalElement) {
      closeModal();
    }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

/**
 * Open the modal with the selected image
 * @param {number} index - Index of the image to display
 */
function openModal(index) {
  galleryState.currentIndex = index;
  galleryState.isOpen = true;
  
  // Display the current image
  updateModalContent();
  
  // Show the modal with animation
  modalElement.classList.add('show');
  
  // Disable scrolling on the body
  document.body.style.overflow = 'hidden';
}

/**
 * Close the modal
 */
function closeModal() {
  galleryState.isOpen = false;
  
  // Hide the modal with animation
  modalElement.classList.remove('show');
  
  // Re-enable scrolling on the body
  setTimeout(() => {
    document.body.style.overflow = '';
  }, 300);
}

/**
 * Update the modal content with the current image
 */
function updateModalContent() {
  const currentImage = galleryState.images[galleryState.currentIndex];
  
  // Create a fade effect
  modalImage.style.opacity = '0';
  
  // After a brief delay, update the image and fade it in
  setTimeout(() => {
    modalImage.src = currentImage.src;
    modalImage.alt = currentImage.alt;
    imageCaption.textContent = currentImage.caption;
    modalImage.style.opacity = '1';
  }, 200);
}

/**
 * Show the previous image in the gallery
 */
function showPreviousImage() {
  galleryState.currentIndex = (galleryState.currentIndex - 1 + galleryState.images.length) % galleryState.images.length;
  updateModalContent();
}

/**
 * Show the next image in the gallery
 */
function showNextImage() {
  galleryState.currentIndex = (galleryState.currentIndex + 1) % galleryState.images.length;
  updateModalContent();
}

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboardNavigation(event) {
  if (!galleryState.isOpen) return;
  
  switch (event.key) {
    case 'ArrowLeft':
      showPreviousImage();
      break;
    case 'ArrowRight':
      showNextImage();
      break;
    case 'Escape':
      closeModal();
      break;
  }
}

/**
 * Download the current image
 */
function downloadCurrentImage() {
  const currentImage = galleryState.images[galleryState.currentIndex];
  
  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = currentImage.src;
  
  // Extract the filename from the URL or use a default name
  const filename = currentImage.src.split('/').pop() || 'image.jpg';
  link.download = filename;
  
  // Append to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Add a visual feedback for the download action
  downloadButton.classList.add('active');
  setTimeout(() => {
    downloadButton.classList.remove('active');
  }, 300);
}