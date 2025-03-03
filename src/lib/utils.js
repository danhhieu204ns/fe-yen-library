import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and ensures
 * Tailwind classes are properly merged.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
