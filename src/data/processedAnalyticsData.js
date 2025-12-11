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

    // Helper function to safely parse dates
    const parseDate = (dateString) => {
        if (!dateString) return null;
        
        try {
            // Try formatted encoded date first
            const formatted = formatEncodedDate(dateString);
            const date = new Date(formatted);
            
            // Check if date is valid
            if (!isNaN(date.getTime())) {
                return date;
            }
        } catch (e) {
            // If that fails, try parsing directly
            try {
                const date = new Date(dateString);
                if (!isNaN(date.getTime())) {
                    return date;
                }
            } catch (e2) {
                console.warn('Invalid date format:', dateString);
            }
        }
        
        return null;
    };

    // Filter out items with invalid dates and sort
    const validItems = analytics
        .map(item => ({
            ...item,
            parsedDate: parseDate(item.period)
        }))
        .filter(item => item.parsedDate !== null);

    const sortedTrend = validItems.sort((a, b) => {
        return a.parsedDate - b.parsedDate;
    });

    const dates = sortedTrend.map(item => item.parsedDate.toISOString());
    const counts = sortedTrend.map(item => Number(item.transactionCount || item.totalAmount || item.countPercentage || 0));
    const amounts = sortedTrend.map(item => Number(item.totalAmount || 0));
    const avgAmounts = sortedTrend.map(item => Number(item.averageAmount || 0));

    return { dates, counts, amounts, avgAmounts };
};
