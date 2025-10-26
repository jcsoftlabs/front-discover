/**
 * Get the backend URL from environment or default to localhost
 */
function getBackendUrl(): string {
  // Check if we're in the browser
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  // Remove /api suffix if present (for image URLs we need the base URL)
  return apiUrl.replace(/\/api$/, '');
}

/**
 * Convert an image path to a full URL
 */
export function getImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Otherwise, prepend backend URL
  const backendUrl = getBackendUrl();
  return `${backendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
}

/**
 * Get the first image from an images array and convert to full URL
 */
export function getFirstImage(images: string[] | string | null | undefined): string | null {
  if (!images) return null;
  
  let imagePath: string | null = null;
  
  // If it's an array, get the first image
  if (Array.isArray(images)) {
    imagePath = images.length > 0 ? images[0] : null;
  } else {
    imagePath = images;
  }
  
  return getImageUrl(imagePath);
}

/**
 * Get all images from an images array and convert to full URLs
 */
export function getAllImages(images: string[] | string | null | undefined): string[] {
  if (!images) return [];
  
  const imageArray = Array.isArray(images) ? images : [images];
  return imageArray.map(img => getImageUrl(img)).filter((url): url is string => url !== null);
}
