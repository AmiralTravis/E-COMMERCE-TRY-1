/**
 * Utility functions for image handling
 */

/**
 * Generates an optimized image URL for a given path and size
 * @param {string} path - The image path (e.g., 'uploads/avatar.jpg')
 * @param {string} size - The desired size ('thumbnail', 'small', 'medium', 'large')
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImage = (path, size = 'medium') => {
    if (!path) return '';
  
    const sizes = {
      thumbnail: 150,  // 150px width
      small: 300,      // 300px width
      medium: 600,     // 600px width
      large: 1200      // 1200px width
    };
  
    const width = sizes[size] || sizes.medium;
    return `${import.meta.env.VITE_CDN_BASE}/${width}w_${path}`;
  };
  
  /**
   * Validates image dimensions
   * @param {File} file - The image file
   * @param {number} minWidth - Minimum required width
   * @param {number} minHeight - Minimum required height
   * @returns {Promise<boolean>} - Whether the image meets the requirements
   */
  export const validateImageDimensions = (file, minWidth, minHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
  
      img.onload = () => {
        const isValid = img.width >= minWidth && img.height >= minHeight;
        URL.revokeObjectURL(img.src); // Clean up
        resolve(isValid);
      };
  
      img.onerror = () => resolve(false);
    });
  };
  
  /**
   * Converts a file size in bytes to a human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} - Human-readable file size (e.g., '2.5 MB')
   */
  export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
  
  /**
   * Checks if a file is an image
   * @param {File} file - The file to check
   * @returns {boolean} - Whether the file is an image
   */
  export const isImageFile = (file) => {
    return file && file.type.startsWith('image/');
  };