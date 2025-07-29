/**
 * Asset paths configuration for CecilioSweets frontend
 * This file centralizes all asset paths for easy maintenance
 */

export const ASSET_PATHS = {
  images: {
    defaultRecipe: 'assets/images/default-recipe.svg',
    defaultAvatar: 'assets/images/default-avatar.svg',
  },
  icons: {
    // Add icon paths here as needed
  },
  styles: {
    // Add style asset paths here as needed
  }
} as const;

// Helper function to get asset URL
export function getAssetUrl(path: string): string {
  return `/${path}`;
}

// Specific helper functions
export function getDefaultRecipeImage(): string {
  return getAssetUrl(ASSET_PATHS.images.defaultRecipe);
}

export function getDefaultAvatarImage(): string {
  return getAssetUrl(ASSET_PATHS.images.defaultAvatar);
}

// Recipe image helper with fallback
export function getRecipeImageUrl(imageUrl?: string | null): string {
  return imageUrl || getDefaultRecipeImage();
}

// User avatar helper with fallback
export function getUserAvatarUrl(avatarUrl?: string | null): string {
  return avatarUrl || getDefaultAvatarImage();
}
