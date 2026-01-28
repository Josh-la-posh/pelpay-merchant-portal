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
            // Handle year-month format like "2025-12"
            if (/^\d{4}-\d{2}$/.test(dateString)) {
                const date = new Date(dateString + '-01');
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
            
            // Handle year only format like "2025"
            if (/^\d{4}$/.test(dateString)) {
                const date = new Date(dateString + '-01-01');
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
            
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

    // Filter out items with invalid dates and sort - handle both PascalCase and camelCase
    const validItems = analytics
        .map(item => {
            const period = item.Period ?? item.period;
            return {
                ...item,
                parsedDate: parseDate(period)
            };
        })
        .filter(item => item.parsedDate !== null);

    const sortedTrend = validItems.sort((a, b) => {
        return a.parsedDate - b.parsedDate;
    });

    const dates = sortedTrend.map(item => item.parsedDate.toISOString());
    
    // Handle both PascalCase (WebSocket) and camelCase keys
    const counts = sortedTrend.map(item => {
        const value = item.TransactionCount ?? item.transactionCount ?? item.TotalAmount ?? item.totalAmount ?? 0;
        return Number(value) || 0;
    });
    
    const amounts = sortedTrend.map(item => {
        const value = item.TotalAmount ?? item.totalAmount ?? 0;
        // Handle string amounts like "16356.00"
        return Number(value) || 0;
    });
    
    const avgAmounts = sortedTrend.map(item => {
        const value = item.AverageAmount ?? item.averageAmount ?? 0;
        return Number(value) || 0;
    });

    return { dates, counts, amounts, avgAmounts };
};
