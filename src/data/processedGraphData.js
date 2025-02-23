export const processGraphData = (graph) => {
    const graphCount = graph && Array.isArray(graph)
        ? graph.map((item) => {
            const successfulCount = item.value
                .filter(transaction => transaction.transactionStatus === 'Successful')
                .reduce((sum, t) => sum + t.transactionCount, 0);

            const processingCount = item.value
                .filter(transaction => transaction.status === 'Processing')
                .reduce((sum, t) => sum + t.transactionCount, 0);

            const failedCount = item.value
                .filter(transaction => transaction.status === 'Failed')
                .reduce((sum, t) => sum + t.transactionCount, 0);

            const pendingCount = item.value
                .filter(transaction => transaction.status === 'Pending')
                .reduce((sum, t) => sum + t.transactionCount, 0);
            
            const totalCounts = item.value
                .reduce((sum, t) => sum + t.transactionCount, 0);

            return {
                successfulCount,
                processingCount,
                failedCount,
                pendingCount,
                totalCounts
            }
        })
        : [];

    const graphVolume = graph && Array.isArray(graph)
        ? graph.map((item) => {
            const successfulVolume = item.value
                .filter(transaction => transaction.transactionStatus === 'Successful')
                .reduce((sum, t) => sum + t.transactionVolume, 0);

            const processingVolume = item.value
                .filter(transaction => transaction.status === 'Processing')
                .reduce((sum, t) => sum + t.transactionVolume, 0);

            const failedVolume = item.value
                .filter(transaction => transaction.status === 'Failed')
                .reduce((sum, t) => sum + t.transactionVolume, 0);

            const pendingVolume = item.value
                .filter(transaction => transaction.status === 'Pending')
                .reduce((sum, t) => sum + t.transactionVolume, 0);

            return {
                successfulVolume,
                processingVolume,
                failedVolume,
                pendingVolume
            }
        })
        : [];

    const graphCountSum = graphCount
        .reduce((sum, t) => {
            sum.successfulCount += t.successfulCount || 0;
            sum.processingCount += t.processingCount || 0;
            sum.failedCount += t.failedCount || 0;
            sum.pendingCount += t.pendingCount || 0;

            return sum;
        }, {successfulCount: 0, processingCount: 0, failedCount: 0, pendingCount: 0});

    const graphVolumeSum = graphVolume
        .reduce((sum, t) => {
            sum.successfulVolume += t.successfulVolume || 0;
            sum.processingVolume += t.processingVolume || 0;
            sum.failedVolume += t.failedVolume || 0;
            sum.pendingVolume += t.pendingVolume || 0;

            return sum;
        }, {successfulVolume: 0, processingVolume: 0, failedVolume: 0, pendingVolume: 0});

    const successfulGraphCount = graphCount
        .map(count => count.successfulCount);

    const successfulGraphVolume = graphVolume
        .map(volume => volume.successfulVolume);

    const finalGraphCount = Object.values(graphCountSum);

    const finalGraphVolume = Object.values(graphVolumeSum);

    const dataDate = graph.map(item => item.key);
    
    const totalTransactionsCount = graphCount
        .reduce((sum, t) => sum + t.totalCounts, 0);

    return {
        successfulGraphCount,
        successfulGraphVolume,
        finalGraphCount,
        finalGraphVolume,
        dataDate,
        totalTransactionsCount
    };
}