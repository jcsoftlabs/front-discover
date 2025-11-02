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
  
  // If it's already a full URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // Force HTTPS for Railway deployment (fix mixed content issues)
    if (imagePath.includes('railway.app') && imagePath.startsWith('http://')) {
      return imagePath.replace('http://', 'https://');
    }
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

/**
 * Apply Cloudinary transformations to an image URL
 * @param imageUrl - The original Cloudinary image URL
 * @param options - Transformation options (width, height, quality, etc.)
 * @returns The transformed image URL or the original if not a Cloudinary URL
 */
export function getCloudinaryUrl(
  imageUrl: string | null | undefined,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:good' | 'auto:best' | number;
    crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb';
    gravity?: 'auto' | 'center' | 'face' | 'faces';
  } = {}
): string | null {
  if (!imageUrl) return null;
  
  // Only transform Cloudinary URLs
  if (!imageUrl.includes('res.cloudinary.com')) {
    return imageUrl;
  }
  
  // Default options
  const {
    width,
    height,
    quality = 'auto:good',
    crop = 'fill',
    gravity = 'auto'
  } = options;
  
  try {
    // Parse the Cloudinary URL
    // Format: https://res.cloudinary.com/[cloud]/image/upload/v[version]/[folder]/[image].[ext]
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex === -1) return imageUrl;
    
    // Build transformation string
    const transformations: string[] = [];
    
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (crop) transformations.push(`c_${crop}`);
    if (gravity && crop === 'fill') transformations.push(`g_${gravity}`);
    if (quality) transformations.push(`q_${quality}`);
    
    // Add format optimization
    transformations.push('f_auto');
    
    const transformString = transformations.join(',');
    
    // Insert transformations after 'upload'
    const beforeUpload = pathParts.slice(0, uploadIndex + 1);
    const afterUpload = pathParts.slice(uploadIndex + 1);
    
    // Remove existing transformations (anything that's not a version number)
    const cleanAfterUpload = afterUpload.filter(part => 
      part.startsWith('v') || part.includes('.') || part.includes('-')
    );
    
    const newPath = [...beforeUpload, transformString, ...cleanAfterUpload].join('/');
    url.pathname = newPath;
    
    return url.toString();
  } catch (error) {
    console.error('Error transforming Cloudinary URL:', error);
    return imageUrl;
  }
}

/**
 * Get a thumbnail version of an image using Cloudinary transformations
 * @param imageUrl - The original image URL
 * @param size - The thumbnail size (default: 400x300)
 */
export function getThumbnailUrl(
  imageUrl: string | null | undefined,
  size: { width: number; height: number } = { width: 400, height: 300 }
): string | null {
  return getCloudinaryUrl(imageUrl, {
    width: size.width,
    height: size.height,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:good'
  });
}

/**
 * Get an optimized version of an image for cards/lists
 */
export function getCardImageUrl(imageUrl: string | null | undefined): string | null {
  return getCloudinaryUrl(imageUrl, {
    width: 800,
    height: 600,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:good'
  });
}

/**
 * Get an optimized version of an image for hero/banner sections
 */
export function getHeroImageUrl(imageUrl: string | null | undefined): string | null {
  return getCloudinaryUrl(imageUrl, {
    width: 1920,
    height: 1080,
    crop: 'fill',
    gravity: 'auto',
    quality: 'auto:best'
  });
}
