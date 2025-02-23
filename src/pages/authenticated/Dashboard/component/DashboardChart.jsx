import ReactApexChart from "react-apexcharts";
import { processGraphData } from "@/data/processedGraphData";

function DashboardChart({graph, type}) {
    const {
        successfulGraphCount,
        successfulGraphVolume,
        dataDate,
        totalCounts
    } = processGraphData(graph);

    const chartSeries = [{
        name: "Transactions",
        data: type === 'Count'
            ? successfulGraphCount
            : successfulGraphVolume
    }];

    const chartOptions = {
        chart: {
            type: 'area',
            height: 350,
            zoom: {enabled: false}
        },
        dataLabels: {enabled: false},
        stroke: {curve: 'smooth'},
        labels: dataDate,
        xaxis: {type: 'datetime'},
        yaxis: {opposite: false},
        legend: {horizontalAlign: 'left'},
        
    };

    if (totalCounts === 0) return (
        <div className="text-md font-[600] w-full h-[20vh] flex items-center justify-center">No Data</div>
    )

    return (
        <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={350} />
    );
  }

  export default DashboardChart;