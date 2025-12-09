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

/**
 * Calculate distance between two geographic coordinates using Haversine formula
 * @param lat1 - Latitude of first point
 * @param lon1 - Longitude of first point
 * @param lat2 - Latitude of second point
 * @param lon2 - Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get user location from localStorage or browser geolocation
 * @returns User location coordinates or null
 */
export async function getUserLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  // First, check localStorage
  const storedLocation = localStorage.getItem('userLocation');
  if (storedLocation) {
    try {
      const parsed = JSON.parse(storedLocation);
      const timestamp = parsed.timestamp || 0;
      const now = Date.now();
      // If location is less than 1 hour old, use it
      if (now - timestamp < 3600000) {
        return {
          latitude: parsed.latitude,
          longitude: parsed.longitude,
        };
      }
    } catch (error) {
      console.error('Error parsing stored location:', error);
    }
  }

  // If no stored location or it's old, try to get current location
  // But don't prompt the user, just return null
  return null;
}

/**
 * Decode HTML entities in a string
 * @param text - String with HTML entities
 * @returns Decoded string
 */
export function decodeHtmlEntities(text: string | null | undefined): string {
  if (!text) return '';
  
  // Use browser's built-in HTML decoder
  if (typeof window !== 'undefined') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }
  
  // Fallback for server-side rendering - decode common entities
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&agrave;/g, 'à')
    .replace(/&acirc;/g, 'â')
    .replace(/&icirc;/g, 'î')
    .replace(/&ocirc;/g, 'ô')
    .replace(/&ugrave;/g, 'ù')
    .replace(/&ucirc;/g, 'û')
    .replace(/&ccedil;/g, 'ç')
    .replace(/&Eacute;/g, 'É')
    .replace(/&Egrave;/g, 'È')
    .replace(/&Ecirc;/g, 'Ê')
    .replace(/&Agrave;/g, 'À')
    .replace(/&Acirc;/g, 'Â')
    .replace(/&Icirc;/g, 'Î')
    .replace(/&Ocirc;/g, 'Ô')
    .replace(/&Ugrave;/g, 'Ù')
    .replace(/&Ucirc;/g, 'Û')
    .replace(/&Ccedil;/g, 'Ç')
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec));
}
