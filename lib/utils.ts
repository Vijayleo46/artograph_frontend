/**
 * Utility function to merge classnames with proper Tailwind CSS conflict resolution
 * Uses clsx for conditional classes and tailwind-merge for conflict resolution
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}
