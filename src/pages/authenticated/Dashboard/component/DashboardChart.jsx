import ReactApexChart from "react-apexcharts";
import PropTypes from 'prop-types';
import { Component } from 'react';

// Error boundary specifically for the chart
class ChartErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Chart error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-md font-[600] w-full h-[350px] flex items-center justify-center text-gray-500">
                    Unable to render chart
                </div>
            );
        }
        return this.props.children;
    }
}

function DashboardChart({ trendLine = [], title, subTitle, mode}) {

    // Process trendLine data from WebSocket
    const processTrendLine = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            return { trendValues: [], trendDates: [], hasTrendData: false };
        }
        
        // Helper to validate and fix date format
        const parseDate = (dateStr) => {
            if (!dateStr) return null;

            const str = String(dateStr);
            
            const fullMatch = str.match(/^(\d{4}-\d{2}-\d{2})(?:-\d+)?$/);
            if (fullMatch) {
                return fullMatch[1];
            }
            
            const monthMatch = str.match(/^(\d{4}-\d{2})$/);
            if (monthMatch) {
                return `${monthMatch[1]}-01`;
            }
            
            const testDate = new Date(str);
            if (!isNaN(testDate.getTime())) {
                return str;
            }
            
            return null;
        };
        
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
            const rawDate = item.Period ?? item.period ?? item.Date ?? item.date ?? item.Key ?? item.key ?? '';
            return parseDate(rawDate);
        }).filter(date => date !== null);
        
        // Ensure values and dates arrays are the same length
        const validLength = Math.min(trendValues.length, trendDates.length);
        
        return { 
            trendValues: trendValues.slice(0, validLength), 
            trendDates: trendDates.slice(0, validLength), 
            hasTrendData: validLength > 0 
        };
    };

    const { trendValues, trendDates } = processTrendLine(trendLine);
    
    // Validate data arrays
    const rawData = trendValues;
    
    const validData = Array.isArray(rawData) 
        ? rawData.map(val => {
            const num = Number(val);
            return isNaN(num) ? 0 : num;
          })
        : [];

        
    const chartDates = trendDates;

    console.log('DashboardChart - validData:', chartDates);

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
        xaxis: {
            // type: 'datetime',
            // min: new Date(chartDates[0]).getTime(),
            // max: new Date(chartDates[chartDates.length - 1]).getTime(),
            // labels: {
            //     format: 'dd MMM'
            // },
            categories: chartDates,
            tickAmount: 12
        },
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

    // Additional validation before rendering chart
    const isValidForChart = chartDates.length > 0 && 
        chartDates.every(date => {
            const d = new Date(date);
            return !isNaN(d.getTime());
        });

    if (!hasData && totalCounts === 0) return (
        <div className="text-md font-[600] w-full h-[20vh] flex items-center justify-center">No Data</div>
    )

    if (!isValidForChart) return (
        <div className="bg-white rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <div className="text-md font-[600] w-full h-[350px] flex items-center justify-center text-gray-500">
                Waiting for data...
            </div>
        </div>
    )

    return (
        <div className="bg-white rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>

            <ChartErrorBoundary>
                <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={350} />
            </ChartErrorBoundary>
            
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
    mode: PropTypes.string,
};

ChartErrorBoundary.propTypes = {
    children: PropTypes.node,
};

