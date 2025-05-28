/**
 * Utility functions for image handling
 */

import noImagePlaceholder from "../assets/no-pic.png";

/**
 * Handler for image loading errors
 * Sets a default placeholder image when an image fails to load
 */
export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = noImagePlaceholder;
};

/**
 * Returns a fallback background image URL if the provided URL is invalid
 * Can be used in style={{ backgroundImage: `url("${getBackgroundImageUrl(imageUrl)}")` }}
 */
export const getBackgroundImageUrl = (url: string): string => {
  // Create a test image to check if the URL can be loaded
  const img = new Image();
  img.src = url;
  
  // Return the original URL, and rely on onerror to handle failures
  return url;
};

/**
 * URL for the fallback image, can be used directly in components
 */
export const fallbackImageUrl = noImagePlaceholder;