/**
 * Converts an encoded date string to YYYY-MM-DD format
 * @param {string} encodedDate - Encoded date string (e.g. "Fri%20Aug%2008%202025%2000:00:00%20GMT+0100%20...")
 * @returns {string} - Date in YYYY-MM-DD format
 */
export function formatEncodedDate(encodedDate) {
  if (!encodedDate) return "";

  // Decode and convert to Date
  const dateObj = new Date(decodeURIComponent(encodedDate));

  // Return in YYYY-MM-DD format
  return dateObj.toISOString().split('T')[0];
}