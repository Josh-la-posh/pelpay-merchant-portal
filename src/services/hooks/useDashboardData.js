import { useMemo } from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook to get dashboard data with realtime WebSocket updates
 * Falls back to API data when realtime is unavailable
 * Data is pre-processed in the realtimeSlice, so we just merge based on availability
 * @returns {Object} Dashboard data merged from realtime and API sources
 */
export const useDashboardData = () => {
  const { useRealtime, realtimeAnalytics, realtimeLumpsum, realtimeGraph, realtimeTransactions, isConnected } = useSelector((state) => state.realtime);
  const { analytics, lumpsum, graph, transactions } = useSelector((state) => state.dashboard);

  // Use realtime data if connected and available, otherwise fall back to API data
  const mergedAnalytics = useMemo(() => {
    return (useRealtime && isConnected && realtimeAnalytics) ? realtimeAnalytics : analytics;
  }, [useRealtime, isConnected, realtimeAnalytics, analytics]);

  const mergedLumpsum = useMemo(() => {
    return (useRealtime && isConnected && realtimeLumpsum) ? realtimeLumpsum : lumpsum;
  }, [useRealtime, isConnected, realtimeLumpsum, lumpsum]);

  const mergedGraph = useMemo(() => {
    return (useRealtime && isConnected && realtimeGraph) ? realtimeGraph : graph;
  }, [useRealtime, isConnected, realtimeGraph, graph]);

  const mergedTransactions = useMemo(() => {
    return (useRealtime && isConnected && realtimeTransactions) ? realtimeTransactions : transactions;
  }, [useRealtime, isConnected, realtimeTransactions, transactions]);

  return {
    analytics: mergedAnalytics,
    lumpsum: mergedLumpsum,
    graph: mergedGraph,
    transactions: mergedTransactions,
    isRealtime: useRealtime && isConnected,
    isConnected,
  };
};
