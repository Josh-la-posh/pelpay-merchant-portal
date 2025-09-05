import ReactApexChart from "react-apexcharts";
import { processLumpsumData } from "@/data/processedLumpsumData";
import PropTypes from 'prop-types';

function DashboardPie({ graph = [], type = 'Count' }) {
    const {
        finalLumpsumCount,
        finalLumpsumVolume,
        totalTransactionsCount
    } = processLumpsumData(graph || []);

    const pieSeries = type === 'Count' ? finalLumpsumCount : finalLumpsumVolume;
    const pieOptions = {
        chart: {
            type: 'donut',
            width: 350,
        },
        fill: {
            colors: ['#00A049', '#0000FF', '#FF0000', '#FFFF00', '#9C03C8', '#808080']
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '13px',
            width: 220           
        },
        labels: ['Success', 'Processing', 'Failed', 'Pending', 'Otp', 'Cancel'],
        plotOptions: {
            pie: {
                donut: {
                  size: '70%',
                  labels: {
                    show: true,
                    name: {
                      show: true,
                      fontSize: '22px',
                      color: '#000',
                      offsetY: -10,
                    },
                    value: {
                      show: false,
                      fontSize: '16px',
                      color: '#000',
                      formatter: () => `${totalTransactionsCount} Total`,
                    },
                    total: {
                        show: false,
                        offsetY: -10,
                        label: 'Total',
                        color: '#000',
                        fontSize: '16px',
                        formatter: () => totalTransactionsCount,
                    },
                  },
                },
              },
        },
        responsive: [
            {
                breakpoint: 300,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        show: false
                    }
                }
            }
        ],
    };

    if (totalTransactionsCount === 0) return (
        <div className="text-md font-[600] w-full h-[20vh] flex items-center justify-center">No Data</div>
    )

    return (
        <ReactApexChart options={pieOptions} series={pieSeries} type="donut" />
    );
  }

  export default DashboardPie;

DashboardPie.propTypes = {
    graph: PropTypes.array,
    type: PropTypes.string,
};