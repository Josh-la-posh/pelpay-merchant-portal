import ReactApexChart from "react-apexcharts";

function AnalyticsPie({ analytics = {}, type = "Count", title }) {
  const breakDown = analytics?.breakDown || [];

  const pieSeries = breakDown.map((item) => Number(item.transactionCount || item.countPercentage));
  // const pieLabels = breakDown.map((item) => Number(item.totalAmount));

  const pieLabels = breakDown.map((item) => item.channelCode);

  //   const totalTransactionsCount = breakDown.reduce(
  //     (sum, item) =>
  //       sum + (type === "Count" ? Number(item.transactionCount) : Number(item.totalAmount)),
  //     0
  //   );
  const totalTransactionsCount = pieSeries.reduce((sum, val) => sum + val, 0);

  const pieOptions = {
    chart: {
      type: "donut",
      width: 350,
    },
    fill: {
      colors: [
        "#00A049",
        "#0000FF",
        "#FF0000",
        "#FFFF00",
        "#9C03C8",
        "#808080",
      ],
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      width: 220,
      show: false,
    },
    labels: pieLabels,
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: false,
              fontSize: "22px",
              color: "#000",
              offsetY: -10,
            },
            value: { show: false },
            total: {
              show: false,
              label: "Total",
              color: "#000",
              fontSize: "16px",
              formatter: () => totalTransactionsCount,
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 300,
        options: { chart: { width: 200 }, legend: { show: false } },
      },
    ],
  };

  if (breakDown.length === 0)
    return (
      <div className="text-md font-[600] w-full h-[32vh] flex items-center justify-center bg-white">
        No Data
      </div>
    );

  //   const tableRows = breakDown.map((item) => ({
  //     method: item.channelCode,
  //     value: Number(item.totalAmount),
  //     share: item.countPercentage || "",
  //     color: pieOptions?.fill?.colors,
  //   }));

  const colors = pieOptions?.fill?.colors || [];

  const tableRows = breakDown.map((item, idx) => ({
    method: item.channelCode,
    value: Number(item.totalAmount || item.averageAmount),
    share: Number(item.countPercentage || ""),
    color: colors[idx % colors.length],
  }));

  const finalTotal = tableRows.reduce((sum, row) => sum + row.value, 0);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "";

    const value = Number(num);

    if (value >= 1_000_000_000_000) {
      return (value / 1_000_000_000_000).toFixed(1) + "T";
    } else if (value >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1) + "B";
    } else if (value >= 1_000_000) {
      return (value / 1_000_000).toFixed(1) + "M";
    } else if (value >= 1_000) {
      return (value / 1_000).toFixed(1) + "k";
    }

    return value.toString();
  };

  return (
    <div className="bg-white rounded-lg p-8 md:h-[65vh]">
      <h3 className="text-xl font-bold">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-5">
      <ReactApexChart options={pieOptions} series={pieSeries} type="donut" />

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

export default AnalyticsPie;
