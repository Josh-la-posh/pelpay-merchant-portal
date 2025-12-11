import { ArrowLeft, CheckCircleIcon, ChevronRight, DownloadIcon, TrendingUp, } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";
import AnalyticsChart from "./AnalyticsChart";
import { useDispatch, useSelector } from "react-redux";
import useAxiosPrivate from "@/services/hooks/useFormAxios";
import useAuth from "../../../../services/hooks/useAuth";
import DashboardService from "@/services/api/dashboardApi";
import Spinner from '@/components/Spinner';
import AnalyticsPie from "./AnalyticsPie";
import TransactionDetails from "./TransactionDetails";
import { formatEncodedDate } from "../../../../utils/formatEncodedDate";
import { formatNumber } from "../../../../utils/formatNumber";
import { saveAs } from "file-saver";

const TotalProcessedDashboard = () => {

   const columns = [
    { header: "Date", render: row => formatEncodedDate(row.period) },
    { header: "Channel", accessor: "channelCode" },
    { header: "Transactions", accessor: "transactionCount" },
    { 
      header: "Volume", 
      render: row => `₦${formatNumber(row.totalAmount || 0)}`
    },
    { 
      header: "Share", 
      render: row => `${row.countPercentage || 0}%`
    }
  ];
  const {auth} = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const { analytics, analyticsLoading } = useSelector((state) => state.dashboard);
  const dashboardService = useMemo(() => new DashboardService(axiosPrivate, auth), [axiosPrivate, auth]);
  const [interval, setInterval] = useState("Daily");
  const [mode, setMode] = useState("OVER_VIEW");
  const [isLoading, setIsLoading] = useState(analyticsLoading)
   
   const merchant = auth?.merchant
   const merchantCode = merchant?.merchantCode;
   const {env} = useSelector((state) => state.env)

   useEffect(() => {
    const fetchData = async () => {
      try {
        await dashboardService.fetchAnalytics(
          merchantCode,
          env,
          interval,
          mode,
          dispatch
        );
      } catch (err) {
        console.error(err);
      }
    };

    if (merchantCode) fetchData();
  }, [merchantCode, env, mode, interval, dispatch, dashboardService]);

  useEffect(() => {
    setIsLoading(analyticsLoading);
  }, [analyticsLoading]);

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  const totalProcessedVolume = analytics?.totalProcesseVolume;
  const netSettledVolume = analytics?.totalNetted;

  const insight  = analytics?.paymentMethodBreakdown?.insight

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

  return (    
    <div className="">      
      <Link to="/" className="flex gap-3 text-sm md:text-md w-40 py-3 rounded-lg hover:bg-green-300 hover:text-white">
        <ArrowLeft size="18px" />
        <p>Back to overview</p>
      </Link>

      <div className="flex my-5 text-sm md:text-md gap-1">
        <Link to="/">
          <span className="text-gray-500">Dashboard</span>
        </Link>
        <ChevronRight className="text-gray-500 mt-0.5" size="18px" />
        <span className="font-bold">Total Processed Volume</span>
      </div>

      <div className="flex justify-between">
        <div className="my-2">
          <h2 className="text-lg font-bold sm:text-xl md:text-3xl md:font-bold">
            Total Processed Volume — Detailed Analytics
          </h2>
          <p className="text-gray-500 py-3 text-[11px] sm:text-[18px]">
            Detailed analysis of total payment value processed through your
            gateway
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
          title="Current Month"
          value={isLoading ? '₦0' : `₦${formatNumber(totalProcessedVolume?.totalProcessedVolume ?? 0)}`}
          subtitle={`${totalProcessedVolume?.percentChange}% vs last month`}
        />
        <Card
          title="Daily Average"
          value={isLoading ? '₦0' : `₦${formatNumber(netSettledVolume?.netSettledVolume ?? 0)}`}
          subtitle2="Consistent performance"
        />
        <Card
          title="Peak Day"
          subtitle2="Friday, Aug 8"
          value={isLoading ? '₦0' : `${formatNumber(analytics?.revenueGrowth?.percentChange ?? 0)}%`}
        />
      </div>

      <div className="mt-5 text-green-400">          
        <AnalyticsChart 
          analytics={analytics?.trendLine}
          type="count"
          title="Total Volume (₦M)"
          name= "Total Processed Volume"
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
                <h4 className="font-bold text-xl">Strong Growth Trajectory</h4>
                <p className="pt-2 text-[13px] text-gray-500">{insight}</p>
              </div>
            </div>

            <div className="flex gap-4 bg-blue-100 border border-blue-300 p-4 rounded-xl my-5 ">
              <div>
                <TrendingUp size="25px" className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-xl">Channel Distribution</h4>
                <p className="pt-2 text-[13px] text-gray-500">
                  Card payments remain the dominant channel at 48% of total
                  volume, followed by bank transfers at 33%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 mt-10 rounded-lg">
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

export default TotalProcessedDashboard;
