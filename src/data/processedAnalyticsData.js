import { formatEncodedDate } from "../utils/formatEncodedDate";

export const processAnalyticsData = (analytics = []) => {
    if (!Array.isArray(analytics) || analytics.length === 0) {
        return {
            dates: [],
            counts: [],
            amounts: [],
            avgAmounts: []
        };
    }

    const sortedTrend = [...analytics].sort((a, b) => {
        return new Date(formatEncodedDate(a.period)) - new Date(formatEncodedDate(b.period));
    });

    const dates = sortedTrend.map(item => new Date(formatEncodedDate(item.period)).toISOString());
    const counts = sortedTrend.map(item => Number(item.transactionCount || item.totalAmount || item.countPercentage));
    const amounts = sortedTrend.map(item => Number(item.totalAmount || 0));
    const avgAmounts = sortedTrend.map(item => Number(item.averageAmount || 0));

    return { dates, counts, amounts, avgAmounts };
};
