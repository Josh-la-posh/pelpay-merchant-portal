import {
  ArrowLeft,
  CheckCircleIcon,
  ChevronRight,
  DownloadIcon,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";
import AnalyticsChart from "./AnalyticsChart";
import { useSelector } from "react-redux";
import Spinner from '@/components/Spinner';
import AnalyticsPie from "./AnalyticsPie";
import TransactionDetails from "./TransactionDetails";
import { formatEncodedDate } from "../../../../utils/formatEncodedDate";
import { saveAs } from "file-saver";

const columns = [
    { header: "Date", render: row => formatEncodedDate(row.period) },
    { header: "Channel", accessor: "channelCode" },
    { header: "Avg Value", accessor: "processed" },
    { header: "Count", accessor: "transactionCount" },
    { header: "Trend", 
      accessor: "", 
    },
  ];

const TransactionVolumeDashboard = () => {
  const { analytics, analyticsLoading } = useSelector((state) => state.dashboard);
  const [interval, setInterval] = useState("Daily");
  const [isLoading, setIsLoading] = useState(analyticsLoading)
   
  //  const merchant = auth?.merchant
  //  const merchantCode = merchant?.merchantCode;
  //  const {env} = useSelector((state) => state.env)

  // Removed API calls - using WebSocket only from main Dashboard
  // Data comes through Redux store via WebSocket connection

  useEffect(() => {
    setIsLoading(analyticsLoading);
  }, [analyticsLoading]);

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

const exportToCSV = (data, filename = "analytics-details.csv") => {
  if (!data || data.length === 0) return;

  const headers = columns.map(col => col.header);

  const csvRows = [
    headers.join(","),

    ...data.map(row =>
      columns.map(col => {
        let value = "";

        if (col.render) {
          value = col.render(row) ?? "";
        } else if (col.accessor) {
          value = row[col.accessor] ?? "";
        }

        if (col.header === "Date") {
          value = `'${value}'`;
        }

        value = value.toString().replace(/₦/g, "₦");

        return `"${value}"`;
      }).join(",")
    ),
  ];

  const csvString = "\uFEFF" + csvRows.join("\n");

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, filename);
};

const insight  = analytics?.paymentMethodBreakdown?.insight

  if (isLoading) return (
    <div className='h-[80vh] w-full'>
      <Spinner />
    </div>
   );


  return (
    <div>
      <Link to="/" className="flex gap-3 text-sm md:text-md w-40 py-3 rounded-lg hover:bg-green-300 hover:text-white">
        <ArrowLeft size="18px" />
        <p>Back to overview</p>
      </Link>

      <div className="flex my-5 text-sm md:text-md gap-1">
        <Link to="/">
          <span className="text-gray-500">Dashboard</span>
        </Link>
        <ChevronRight className="text-gray-500 mt-0.5" size="18px" />
        <span className="font-bold">Average Transaction Value</span>
      </div>

      <div className="flex justify-between">
        <div className="my-2">
          <h2 className="text-lg font-bold sm:text-xl md:text-3xl md:font-bold">
           Average Transaction Value — Detailed Analytics
          </h2>
          <p className="text-gray-500 py-3 text-[11px] sm:text-[18px]">
           Analysis of average payment size trends
          </p>
        </div>

        <div className="mt-2">
          <select
            id="interval"
            value={interval}
            onChange={handleIntervalChange}
            className="border px-2 py-1 rounded"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8 md:mb-0">
        <Card
          title="Current ATV"
          subtitle="98% settlement rate"
          //   value={`₦${totalRevenue}`}
          // value="124556789767"
        />

        <Card
          title="Highest Channel"
          // value={`₦${totalCounts}`}
          subtitle2="Within SLA"
        />
        <Card
          title="Growth This Month"
          subtitle2="Increased avg spend"
          // value={`+₦${successfulTransaction}`}
        />
      </div>

      <div className="mt-5 text-blue-400">
        <AnalyticsChart 
            analytics={analytics?.trendLine}
            type="count"
            title="Avg Transaction Value (₦K)"
            name="Avg Transaction Value"
          />  
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-10">
        <div className=" sm:col-span-3 ">
         <AnalyticsPie analytics={analytics?.paymentMethodBreakdown}  title={"Volume Breakdown by Payment Method"}/>
        </div>

        <div className="sm:col-span-2">
          <div className="bg-white p-5 rounded-xl border border-gray-200 md:h-[60vh]">
            <h3 className="text-[18px] font-bold pt-4">
              Key Insights & Observations
            </h3>

            <div className="flex gap-4 bg-green-50 border border-green-300 p-4 rounded-xl my-5 ">
              <div>
                <CheckCircleIcon size="25px" className="text-green-400" />
              </div>
              <div>
                <h4 className="font-bold text-xl">Growing Transaction Sizes</h4>
                <p className="pt-2 text-[13px] text-gray-500">{insight}</p>
              </div>
            </div>

            <div className="flex gap-4 bg-blue-100 border border-blue-300 p-4 rounded-xl my-5 ">
              <div>
                <TrendingUp size="25px" className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-xl">Channel Variation</h4>
                <p className="pt-2 text-[13px] text-gray-500">
                  Bank transfers show highest average value (₦52K), while USSD transactions average ₦28K.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 mt-10">
        <div className="flex justify-between">
          <div>
            <h3 className="text-[18px] font-[500] pt-4">Transaction Details</h3>
          </div>

          <div className="">
            <button
              onClick={() => exportToCSV(analytics?.transactionDetails)}
              className="flex items-center gap-2 text-[14px] px-3 py-2 rounded-sm border border-gray-300 bg-gray-50 hover:bg-green-300/90 hover:text-white"
            >
              <DownloadIcon size={17} /> Export CSV
            </button>
          </div>
        </div>
        <TransactionDetails columns={columns} data={analytics?.transactionDetails}/>
      </div>

      

      
    </div>
  );
};

export default TransactionVolumeDashboard;
