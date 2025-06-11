type ClassValue = string | number | boolean | undefined | null;

/**
 * Utility function to conditionally concatenate class names
 * Filters out falsy values and joins with a space
 */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
} 