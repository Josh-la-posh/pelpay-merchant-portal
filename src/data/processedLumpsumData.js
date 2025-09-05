export const processLumpsumData = (lumpsum) => {

    // totalCount was unused; compute totalTransactionsCount below instead

    const lumpsumCount = lumpsum && Array.isArray(lumpsum)
        ? lumpsum.map((item) => {
            
            const successfulCount = item.transactionStatus === 'Successful' ? item.transactionCount : 0;
            
            const processingCount = item.transactionStatus === 'Processing' ? item.transactionCount : 0;
            
            const failedCount = item.transactionStatus === 'Failed' ? item.transactionCount : 0;
            
            const pendingCount = item.transactionStatus === 'Pending' ? item.transactionCount : 0;
            
            const otpCount = item.transactionStatus === 'Otp' ? item.transactionCount : 0;
            
            const cancelCount = item.transactionStatus === 'Cancel' ? item.transactionCount : 0;

            return {
                successfulCount,
                processingCount,
                failedCount,
                pendingCount,
                otpCount,
                cancelCount,
            }
        })
        : [];

    const lumpsumVolume = lumpsum && Array.isArray(lumpsum)
        ? lumpsum.map((item) => {
            const successfulVolume = item.transactionStatus === 'Successful' ? item.transactionVolume : 0;
            
            const processingVolume = item.transactionStatus === 'Processing' ? item.transactionVolume : 0;
            
            const failedVolume = item.transactionStatus === 'Failed' ? item.transactionVolume : 0;
            
            const pendingVolume = item.transactionStatus === 'Pending' ? item.transactionVolume : 0;
            
            const otpVolume = item.transactionStatus === 'Otp' ? item.transactionVolume : 0;
            
            const cancelVolume = item.transactionStatus === 'Cancel' ? item.transactionVolume : 0;
            

            return {
                successfulVolume,
                processingVolume,
                failedVolume,
                pendingVolume,
                otpVolume,
                cancelVolume
            }
        })
        : [];

    const lumpsumCountSum = lumpsumCount
        .reduce((sum, t) => {
            sum.successfulCount += t.successfulCount || 0;
            sum.processingCount += t.processingCount || 0;
            sum.failedCount += t.failedCount || 0;
            sum.pendingCount += t.pendingCount || 0;
            sum.otpCount += t.otpCount || 0;
            sum.cancelCount += t.cancelCount || 0;

            return sum;
        }, {successfulCount: 0, processingCount: 0, failedCount: 0, pendingCount: 0, otpCount: 0, cancelCount: 0});

    const lumpsumVolumeSum = lumpsumVolume
        .reduce((sum, t) => {
            sum.successfulVolume += t.successfulVolume || 0;
            sum.processingVolume += t.processingVolume || 0;
            sum.failedVolume += t.failedVolume || 0;
            sum.pendingVolume += t.pendingVolume || 0;
            sum.otpVolume += t.otpVolume || 0;
            sum.cancelVolume += t.cancelVolume || 0;

            return sum;
        }, {successfulVolume: 0, processingVolume: 0, failedVolume: 0, pendingVolume: 0, otpVolume: 0, cancelVolume: 0});

    const successfulLumpsumCount = lumpsumCount
        .map(count => count.successfulCount);

    const successfulLumpsumVolume = lumpsumVolume
        .map(volume => volume.successfulVolume);

    const finalLumpsumCount = Object.values(lumpsumCountSum);

    const finalLumpsumVolume = Object.values(lumpsumVolumeSum);

    const dataDate = lumpsum.map(item => item.key);
    
    const totalTransactionsCount = lumpsum
        .reduce((sum, t) => sum + t.transactionCount, 0);

    return {
        successfulLumpsumCount,
        successfulLumpsumVolume,
        finalLumpsumCount,
        finalLumpsumVolume,
        dataDate,
        totalTransactionsCount
    };
}