import { useMemo } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook to get dashboard data with realtime WebSocket updates only
 * No API fallback - displays empty/zero data when WebSocket is unavailable
 * Data is pre-processed in the realtimeSlice
 * @returns {Object} Dashboard data from WebSocket only
 */
export const useDashboardData = () => {
  const { useRealtime, realtimeAnalytics, realtimeLumpsum, realtimeGraph, realtimeTransactions, isConnected } = useSelector((state) => state.realtime);

  // Only use realtime data - no API fallback
  const mergedAnalytics = useMemo(() => {
    if (useRealtime && isConnected && realtimeAnalytics) {
      return realtimeAnalytics;
    }
    
    // Return empty data structure when not connected
    return {
      totalProcesseVolume: { totalProcessedVolume: '0.00', totalSettledVolume: '0.00', percentChange: '➡️ No change' },
      totalNetted: { netSettledVolume: '0.00', nettedSettledCount: '0.00', percentChange: '➡️ No change' },
      averageTransactionValue: { averageTransactionValue: '0.00', percentChange: '➡️ No change' },
      revenueGrowth: { currentRevenue: '0.00', previousRevenue: '0.00', percentChange: '+ 0.00%' },
      paymentmethodBreakdown: { breakDown: [], insight: 'No data available' },
      transactionDetails: [],
      trendLine: [],
    };
  }, [useRealtime, isConnected, realtimeAnalytics]);

  const mergedLumpsum = useMemo(() => {
    return (useRealtime && isConnected && realtimeLumpsum) ? realtimeLumpsum : [];
  }, [useRealtime, isConnected, realtimeLumpsum]);

  const mergedGraph = useMemo(() => {
    return (useRealtime && isConnected && realtimeGraph) ? realtimeGraph : [];
  }, [useRealtime, isConnected, realtimeGraph]);

  const mergedTransactions = useMemo(() => {
    return (useRealtime && isConnected && realtimeTransactions) ? realtimeTransactions : [];
  }, [useRealtime, isConnected, realtimeTransactions]);

  return {
    analytics: mergedAnalytics,
    lumpsum: mergedLumpsum,
    graph: mergedGraph,
    transactions: mergedTransactions,
    isRealtime: useRealtime && isConnected,
    isConnected,
  };
};
