import ReactApexChart from "react-apexcharts";
import PropTypes from 'prop-types';
import { formatNumber } from "../../../../utils/formatNumber";

function DashboardPie({ graph = {}, type = 'Count', title }) {
    const breakDown = graph?.BreakDown || graph?.breakDown || [];

    // Extract data from breakDown array
    const validData = breakDown.filter(item => {
        if (!item) return false;
        const channelCode = item.ChannelCode ?? item.channelCode;
        return channelCode != null;
    });

    // Get series data based on type
    const pieSeries = validData.map((item) => {
        const rawValue = type === 'Count' 
            ? (item.TransactionCount ?? item.transactionCount ?? 0)
            : (item.TotalAmount ?? item.totalAmount ?? 0);
        // Handle string values like "16356.00"
        const num = Number(rawValue);
        return isNaN(num) ? 0 : num;
    });

    const pieLabels = validData.map((item) => item.ChannelCode ?? item.channelCode ?? 'Unknown');

    // Calculate total
    const totalTransactionsCount = pieSeries.reduce((sum, val) => sum + val, 0);

    const pieOptions = {
        chart: {
            type: 'donut',
            width: 100,
            height: 100
        },
        fill: {
            colors: ['#00A049', '#0000FF', '#FF0000', '#FFFF00', '#9C03C8', '#808080']
        },
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '12px',
            width: 220           
        },
        labels: pieLabels.length > 0 ? pieLabels : ['Bank Transfer', 'Card Payments', 'USSD', 'Fund Transfer', 'Wallets', 'Other'],
        plotOptions: {
            pie: {
                donut: {
                  size: '70%',
                  labels: {
                    show: false,
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

    if (validData.length === 0 || totalTransactionsCount === 0) return (
        <div className="text-md font-[600] w-full h-[32vh] flex items-center justify-center bg-white">No Data</div>
    )

    if (breakDown.length === 0)
        return (
        <div className="text-md font-[600] w-full h-[32vh] flex items-center justify-center bg-white">
            No Data
        </div>
        );

    const colors = pieOptions?.fill?.colors || [];

    const tableRows = breakDown.map((item, idx) => {
        const rawPercentage = item.CountPercentage ?? item.countPercentage ?? "";
        // Handle percentage strings like "36.36%"
        const cleanPercentage = typeof rawPercentage === 'string' 
            ? parseFloat(rawPercentage.replace('%', '')) 
            : rawPercentage;
        
        return {
            method: item.ChannelCode ?? item.channelCode,
            value: Number(item.TotalAmount ?? item.totalAmount ?? item.AverageAmount ?? item.averageAmount ?? 0),
            share: isNaN(cleanPercentage) ? 0 : cleanPercentage,
            color: colors[idx % colors.length],
        };
    });

    const finalTotal = tableRows.reduce((sum, row) => sum + row.value, 0);

    return (
         <div className="bg-white rounded-lg p-8">
            <h3 className="text-xl font-semibold">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div className="md:col-span-1 h-56">
                    <ReactApexChart options={pieOptions} series={pieSeries} type="donut" height='100%' />
                </div>
                <div className="mt-8 overflow-x-auto scrollbar-none">
                    <table className=" text-left">
                    <thead className="text-gray-500">
                        <tr>
                        <th className="px-4 py-2 border-b">Method</th>
                        <th className="px-4 py-2 border-b">Value</th>
                        <th className="px-4 py-2 border-b">Share</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border-b">
                                <span
                                    className="w-3 h-3 rounded-full inline-block mr-2"
                                    style={{ backgroundColor: row.color }}
                                ></span>
                                {row.method}
                                </td>
                                <td className="px-4 py-2 border-b">
                                ₦{formatNumber(row.value)}
                                </td>
                                <td className="px-4 py-2 border-b">{row.share}%</td>
                            </tr>
                        ))}

                        <tr className="font-bold bg-gray-100/50">
                        <td className="px-4 py-2 border-b">Total</td>
                        <td className="px-4 py-2 border-b">₦{formatNumber(finalTotal)}</td>
                        <td className="px-4 py-2 border-b">100%</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
            </div>
         </div>
    );
  }

  export default DashboardPie;

DashboardPie.propTypes = {
    graph: PropTypes.object,
    type: PropTypes.string,
    title: PropTypes.string,
};