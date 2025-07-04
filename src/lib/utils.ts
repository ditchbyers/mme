import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for combining and merging CSS class names
 * Combines clsx for conditional classes with tailwind-merge for Tailwind CSS optimization
 * Handles conflicts between Tailwind classes by keeping the last conflicting class
 *
 * @param inputs - Variable number of class values (strings, objects, arrays, etc.)
 * @returns Merged and optimized CSS class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
