/**
 * Process real-time analytics data from WebSocket
 * Transforms the raw WebSocket response into the format expected by components
 * 
 * @param {Object} rawData - Raw data from WebSocket analytics event
 * @returns {Object} Processed data in the expected format
 */
export const processRealtimeAnalytics = (rawData) => {
  if (!rawData) return null;

  return {
    totalProcesseVolume: {
      totalProcessedVolume: rawData.totalProcesseVolume?.TotalProcessedVolume || '0.00',
      totalSettledVolume: rawData.totalProcesseVolume?.TotalSettledVolume || '0.00',
      percentChange: rawData.totalProcesseVolume?.PercentChange || '➡️ No change vs last period',
      currentDate: rawData.totalProcesseVolume?.CurrentDate || rawData.totalProcesseVolume?.currentDate || '',
      previousDate: rawData.totalProcesseVolume?.PreviousDate || rawData.totalProcesseVolume?.previousDate || '',
    },
    totalNetted: {
      netSettledVolume: rawData.totalNetted?.NetSettledVolume || '0.00',
      nettedSettledCount: rawData.totalNetted?.NettedSettledCount || '0.00',
      percentChange: rawData.totalNetted?.PercentChange || '➡️ No change vs last period',
      currentDate: rawData.totalNetted?.CurrentDate || rawData.totalNetted?.currentDate || '',
      previousDate: rawData.totalNetted?.PreviousDate || rawData.totalNetted?.previousDate || '',
    },
    averageTransactionValue: {
      averageTransactionValue: rawData.averageTransactionValue?.AverageTransactionValue || 'NaN',
      percentChange: rawData.averageTransactionValue?.PercentChange || '➡️ No change vs last period',
      currentDate: rawData.averageTransactionValue?.CurrentDate || rawData.averageTransactionValue?.currentDate || '',
      previousDate: rawData.averageTransactionValue?.PreviousDate || rawData.averageTransactionValue?.previousDate || '',
    },
    revenueGrowth: {
      currentRevenue: rawData.revenueGrowth?.CurrentRevenue || '0.00',
      previousRevenue: rawData.revenueGrowth?.PreviousRevenue || '0.00',
      percentChange: rawData.revenueGrowth?.PercentChange || '+ 0.00%',
      currentDate: rawData.revenueGrowth?.CurrentDate || rawData.revenueGrowth?.currentDate || '',
      previousDate: rawData.revenueGrowth?.PreviousDate || rawData.revenueGrowth?.previousDate || '',
    },
    transactionCounts: {
      currentTransactionCount: rawData.transactionCounts?.CurrentTransactionCount || 0,
      previousTransactionCount: rawData.transactionCounts?.PreviousTransactionCount || 0,
      percentChange: rawData.transactionCounts?.PercentChange || '0.00',
      currentDate: rawData.transactionCounts?.CurrentDate || rawData.transactionCounts?.currentDate || '',
      previousDate: rawData.transactionCounts?.PreviousDate || rawData.transactionCounts?.previousDate || '',
    },
    paymentmethodBreakdown: {
      breakDown: rawData.paymentmethodBreakdown?.BreakDown || [],
      insight: rawData.paymentmethodBreakdown?.Insight || 'Insufficient data for insights',
    },
    transactionDetails: rawData.transactionDetails || [],
    trendLine: rawData.trendLine || [],
  };
};

/**
 * Process real-time lumpsum data from WebSocket
 * 
 * @param {Object} rawData - Raw lumpsum data from WebSocket
 * @returns {Array} Processed lumpsum data
 */
export const processRealtimeLumpsum = (rawData) => {
  if (!rawData) return [];
  
  // If rawData is already an array, return it
  if (Array.isArray(rawData)) return rawData;
  
  // If it's an object with a data property that's an array
  if (rawData.data && Array.isArray(rawData.data)) return rawData.data;
  
  return [];
};

/**
 * Process real-time graph data from WebSocket
 * 
 * @param {Object} rawData - Raw graph data from WebSocket
 * @returns {Array} Processed graph data
 */
export const processRealtimeGraph = (rawData) => {
  if (!rawData) return [];
  
  // If rawData is already an array, return it
  if (Array.isArray(rawData)) return rawData;
  
  // If it's an object with a data property that's an array
  if (rawData.data && Array.isArray(rawData.data)) return rawData.data;
  
  return [];
};

/**
 * Process real-time transaction data from WebSocket
 * 
 * @param {Object} rawData - Raw transaction data from WebSocket
 * @returns {Array} Processed transaction data
 */
export const processRealtimeTransactions = (rawData) => {
  if (!rawData) return [];
  
  // If rawData is already an array, return it
  if (Array.isArray(rawData)) return rawData;
  
  // If it's an object with a data property that's an array
  if (rawData.data && Array.isArray(rawData.data)) return rawData.data;
  
  return [];
};

/**
 * Check if real-time data is valid and usable
 * 
 * @param {Object} data - Processed data object
 * @returns {boolean} True if data is valid
 */
export const isRealtimeDataValid = (data) => {
  if (!data) return false;
  
  // For analytics, check if it has at least one of the key properties
  if (data.totalProcesseVolume || data.totalNetted || data.averageTransactionValue) {
    return true;
  }
  
  // For arrays (lumpsum, graph, transactions)
  if (Array.isArray(data) && data.length > 0) {
    return true;
  }
  
  return false;
};
