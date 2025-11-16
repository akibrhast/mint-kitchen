// Simple in-memory image cache
const imageCache = new Map();

/**
 * Preload an image and cache it
 * @param {string} src - Image URL
 * @returns {Promise<string>} - Resolves with the image URL when loaded
 */
export const preloadImage = (src) => {
  if (!src) return Promise.reject('No image source provided');

  // Check if already in cache
  if (imageCache.has(src)) {
    return Promise.resolve(src);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      imageCache.set(src, true);
      resolve(src);
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });
};

/**
 * Check if an image is in cache
 * @param {string} src - Image URL
 * @returns {boolean}
 */
export const isImageCached = (src) => {
  return imageCache.has(src);
};

/**
 * Clear the image cache
 */
export const clearImageCache = () => {
  imageCache.clear();
};
