import ReactApexChart from "react-apexcharts";
import { processAnalyticsData } from "../../../../data/processedAnalyticsData";

function AnalyticsChart({ analytics = [], type = "count", title, name }) {

    const { dates, counts, amounts, avgAmounts } = processAnalyticsData(analytics);

    const seriesData = {
        count: counts,
        amount: amounts,
        average: avgAmounts,
    };

    const chartSeries = [
        {
            name:  name,
            data: seriesData[type] || []
        }
    ];

    const chartOptions = {
        chart: {
            type: "area",
            height: 350,
            zoom: { enabled: false },
        },
        stroke: { curve: "smooth" },
        dataLabels: { enabled: false },
        labels: dates,
        xaxis: {
            type: "datetime"
        },
        legend: {horizontalAlign: 'left'},
    };

    if (dates.length === 0) {
        return (
            <div className="text-center w-full h-[20vh] flex items-center justify-center font-semibold">
                No Analytics Trend Data
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-8">
            <ReactApexChart 
                options={chartOptions} 
                series={chartSeries} 
                type="area" 
                height={350} 
            />

            <div className="flex items-center justify-center gap-2 pt-3">
                <span className="font-semibold">{title}</span>
            </div>
        </div>
    );
}

export default AnalyticsChart;
