import ReactApexChart from "react-apexcharts";
import { processGraphData } from "@/data/processedGraphData";
import PropTypes from 'prop-types';

function DashboardChart({ graph = [], type = 'Count', title,}) {
    const {
        successfulGraphCount,
        successfulGraphVolume,
        dataDate,
        totalCounts
    } = processGraphData(graph || []);

    const chartSeries = [{
        name: "Total Processed Volume",
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
        <div className="bg-white rounded-lg p-8">
            {/* <h3 className="text-xl font-bold text-gray-800">Trend Over Time</h3> */}

            <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={350} />
            
            <div className="flex items-center justify-center gap-2">
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

                <span>{title}</span>
            </div>
        </div>
    );
  }

  export default DashboardChart;

DashboardChart.propTypes = {
    graph: PropTypes.array,
    type: PropTypes.string,
};

