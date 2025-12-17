import ReactApexChart from "react-apexcharts";
import PropTypes from 'prop-types';

function DashboardChart({ trendLine = [], title, subTitle, mode}) {

    // Process trendLine data from WebSocket
    const processTrendLine = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            return { trendValues: [], trendDates: [], hasTrendData: false };
        }
        
        // Handle both PascalCase and camelCase keys
        // For REVENUE_GROWTH_RATE mode, use AverageAmount (strip % sign)
        // For other modes, use TotalAmount
        const trendValues = data.map(item => {
            let value;
            
            // Check for AverageAmount first (used in REVENUE_GROWTH_RATE)
            if (item.AverageAmount !== undefined || item.averageAmount !== undefined) {
                value = item.AverageAmount ?? item.averageAmount ?? 0;
                // Strip % sign if present
                if (typeof value === 'string') {
                    value = value.replace('%', '');
                }
            } else {
                value = item.TotalAmount ?? item.totalAmount ?? item.Value ?? item.value ?? item.Amount ?? item.amount ?? 0;
            }
            
            const num = Number(value);
            return isNaN(num) ? 0 : num;
        });
        
        const trendDates = data.map(item => {
            return item.Period ?? item.period ?? item.Date ?? item.date ?? item.Key ?? item.key ?? '';
        });
        
        return { trendValues, trendDates, hasTrendData: trendValues.length > 0 };
    };

    const { trendValues, trendDates } = processTrendLine(trendLine);

    // Decide which data source to use - prefer trendLine if available
    // const useTrendLine = hasTrendData && trendLine.length > 0;
    
    // Validate data arrays
    const rawData = trendValues;
    
    const validData = Array.isArray(rawData) 
        ? rawData.map(val => {
            const num = Number(val);
            return isNaN(num) ? 0 : num;
          })
        : [];

    const chartDates = trendDates;

    // Determine if this is a percentage-based chart (for revenue growth)
    const isPercentageMode = mode === 'REVENUE_GROWTH_RATE';

    const chartSeries = [{
        name: subTitle || "Total Processed Volume",
        data: validData
    }];

    const chartOptions = {
        chart: {
            type: 'area',
            height: 350,
            zoom: {enabled: false}
        },
        dataLabels: {enabled: false},
        stroke: {curve: 'smooth'},
        labels: chartDates,
        xaxis: {type: 'datetime'},
        yaxis: {
            opposite: false,
            labels: {
                formatter: (value) => {
                    if (isPercentageMode) {
                        return `${value.toFixed(2)}%`;
                    }
                    return value >= 1000000 
                        ? `₦${(value / 1000000).toFixed(1)}M` 
                        : value >= 1000 
                            ? `₦${(value / 1000).toFixed(1)}K`
                            : `₦${value}`;
                }
            }
        },
        tooltip: {
            y: {
                formatter: (value) => {
                    if (isPercentageMode) {
                        return `${value.toFixed(2)}%`;
                    }
                    return `₦${value.toLocaleString()}`;
                }
            }
        },
        legend: {horizontalAlign: 'left'},
        
    };

    // Check if we have any data to display
    const hasData = validData.length > 0 && validData.some(v => v > 0);
    const totalCounts = validData.reduce((a, b) => a + b, 0);

    if (!hasData && totalCounts === 0) return (
        <div className="text-md font-[600] w-full h-[20vh] flex items-center justify-center">No Data</div>
    )

    return (
        <div className="bg-white rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>

            <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={350} />
            
            <div className="flex items-center justify-center gap-2 text-priColor text-xs">
                <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 32 32" 
                    fill="none" 
                    stroke="currentColor"  
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                    <path d="M2 16 H10
                        C12 10, 20 10, 22 16
                        H30
                        M22 16
                        C20 22, 12 22, 10 16" />
                </svg>

                <span>{subTitle}</span>
            </div>
        </div>
    );
  }

  export default DashboardChart;

DashboardChart.propTypes = {
    graph: PropTypes.array,
    trendLine: PropTypes.array,
    type: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
};

