// Helper function to get image URLs
export const getImageUrl = (imageName: string): string => {
  try {
    // For production build
    return new URL(`../assets/${imageName}`, import.meta.url).href;
  } catch (e) {
    // Fallback for development
    return `/src/assets/${imageName}`;
  }
};
