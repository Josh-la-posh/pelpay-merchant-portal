/**
 * Converts an encoded date string to YYYY-MM-DD format
 * Handles various date formats including:
 * - Encoded dates (e.g. "Fri%20Aug%2008%202025%2000:00:00%20GMT+0100%20...")
 * - ISO dates (e.g. "2025-12-06T00:00:00")
 * - Invalid formats like "2025-12-06-14" -> "2025-12-06"
 * - Month-only formats like "2025-12" -> "2025-12-01"
 * @param {string} encodedDate - Encoded date string
 * @returns {string} - Date in YYYY-MM-DD format or empty string if invalid
 */
export function formatEncodedDate(encodedDate) {
  if (!encodedDate) return "";

  try {
    const str = String(encodedDate);
    
    // Handle format like "2025-12-06-14" (invalid) -> "2025-12-06"
    const fullMatch = str.match(/^(\d{4}-\d{2}-\d{2})(?:-\d+)?$/);
    if (fullMatch) {
      return fullMatch[1];
    }
    
    // Handle month-only format "2025-12" -> "2025-12-01"
    const monthMatch = str.match(/^(\d{4}-\d{2})$/);
    if (monthMatch) {
      return `${monthMatch[1]}-01`;
    }

    // Try decoding if it's URL encoded
    let decoded = str;
    try {
      decoded = decodeURIComponent(str);
    } catch {
      // Not URL encoded, use as is
    }

    // Parse the date
    const dateObj = new Date(decoded);
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return "";
    }

    // Return in YYYY-MM-DD format
    return dateObj.toISOString().split('T')[0];
  } catch {
    // Return empty string if any error occurs
    return "";
  }
}