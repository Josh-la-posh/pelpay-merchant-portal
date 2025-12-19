import { ArrowLeft, CheckCircleIcon, ChevronRight, DownloadIcon, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import Card from "../../../../components/Card";
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import useAuth from "../../../../services/hooks/useAuth";
import TransactionDetails from "./TransactionDetails";
import { formatEncodedDate } from "../../../../utils/formatEncodedDate";
import { formatNumber } from "../../../../utils/formatNumber";
import { saveAs } from "file-saver";
import { useGlobalWebSocket } from "@/services/context/WebSocketProvider";
import { useDashboardData } from "@/services/hooks/useDashboardData";
import DashboardPie from "./DashboardPie";
import DashboardChart from "./DashboardChart";
import Spinner from "@/components/Spinner";

// Mode configurations
const MODE_CONFIG = {
  OVER_VIEW: {
    title: "Total Processed Volume",
    subtitle: "Detailed analysis of total payment value processed through your gateway",
    chartTitle: "Total Volume (₦M)",
    chartName: "Total Processed Volume",
    insightTitle: "Strong Growth Trajectory",
    insightSubtitle: "Channel Distribution",
    insightText: "Card payments remain the dominant channel at 48% of total volume, followed by bank transfers at 33%.",
    cards: [
      { key: "currentMonth", title: "Current Month", valueKey: "totalProcesseVolume.TotalProcessedVolume", subtitleKey: "totalProcesseVolume.PercentChange", prefix: "₦" },
      { key: "dailyAvg", title: "Daily Average", valueKey: "totalNetted.NetSettledVolume", subtitle2: "Consistent performance", prefix: "₦" },
      { key: "peakDay", title: "Peak Day", valueKey: "revenueGrowth.PercentChange", subtitle2: "Friday, Aug 8", suffix: "%" },
    ],
  },
  NET_SETTLED: {
    title: "Net Settled Volume",
    subtitle: "Analysis of funds confirmed and deposited to your account",
    chartTitle: "Net Settled Volume (₦M)",
    chartName: "Net Settled Volume",
    insightTitle: "Settlement Performance",
    insightSubtitle: "Settlement Trends",
    insightText: "Settlement rates remain consistently high with 98% of transactions settled within 24 hours.",
    cards: [
      { key: "totalSettled", title: "Total Settled", valueKey: "totalNetted.NetSettledVolume", subtitleKey: "totalNetted.PercentChange", prefix: "₦" },
      { key: "pendingSettlement", title: "Pending Settlement", valueKey: "totalProcesseVolume.TotalSettledVolume", subtitle2: "Awaiting confirmation", prefix: "₦" },
      { key: "settlementRate", title: "Settlement Rate", valueKey: "revenueGrowth.PercentChange", subtitle2: "Within SLA", suffix: "%" },
    ],
  },
  AVERAGE_TRANSACTION_VALUE: {
    title: "Average Transaction Value",
    subtitle: "Analysis of average payment size trends",
    chartTitle: "Avg Transaction Value (₦K)",
    chartName: "Avg Transaction Value",
    insightTitle: "Growing Transaction Sizes",
    insightSubtitle: "Channel Variation",
    insightText: "Bank transfers show highest average value (₦52K), while USSD transactions average ₦28K.",
    cards: [
      { key: "currentATV", title: "Current ATV", valueKey: "averageTransactionValue.AverageTransactionValue", subtitleKey: "averageTransactionValue.PercentChange", prefix: "₦" },
      { key: "highestChannel", title: "Highest Channel", valueKey: "totalNetted.NetSettledVolume", subtitle2: "Bank Transfer", prefix: "₦" },
      { key: "growthMonth", title: "Growth This Month", valueKey: "revenueGrowth.PercentChange", subtitle2: "Increased avg spend", suffix: "%" },
    ],
  },
  REVENUE_GROWTH_RATE: {
    title: "Revenue Growth Rate",
    subtitle: "Month-over-month revenue growth analysis",
    chartTitle: "Revenue Growth (%)",
    chartName: "Revenue Growth",
    insightTitle: "Positive Growth Trend",
    insightSubtitle: "Growth Drivers",
    insightText: "New customer acquisition and increased transaction frequency driving growth.",
    cards: [
      { key: "currentGrowth", title: "Current Growth", valueKey: "revenueGrowth.PercentChange", subtitleKey: "revenueGrowth.CurrentRevenue", suffix: "%" },
      { key: "currentRevenue", title: "Current Revenue", valueKey: "revenueGrowth.CurrentRevenue", subtitle2: "This period", prefix: "₦" },
      { key: "previousRevenue", title: "Previous Revenue", valueKey: "revenueGrowth.PreviousRevenue", subtitle2: "Last period", prefix: "₦" },
    ],
  },
};

// Helper to get nested value from object
const getNestedValue = (obj, path) => {
  if (!obj || !path) return null;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const AnalyticsDetailPage = ({ mode: propMode }) => {
  const { mode: urlMode } = useParams();
  const [searchParams] = useSearchParams();
  
  // Determine mode from props, URL params, or search params
  const mode = propMode || urlMode || searchParams.get('mode') || 'OVER_VIEW';
  const initialInterval = searchParams.get('interval') || 'Daily';

  const columns = [
    { header: "Date", render: row => formatEncodedDate(row?.Period ?? row?.period) },
    { header: "Channel", render: row => row?.ChannelCode ?? row?.channelCode },
    { header: "Transactions", render: row => row?.TransactionCount ?? row?.transactionCount },
    { 
      header: "Volume", 
      render: row => `₦${formatNumber(row?.TotalAmount ?? row?.totalAmount ?? 0)}`
    },
    { 
      header: "Share", 
      render: row => `${row?.CountPercentage ?? row?.countPercentage ?? 0}%`
    }
  ];

  const { auth } = useAuth();
  const { analytics: mergedAnalytics } = useDashboardData();
  const [interval, setInterval] = useState(initialInterval);
  const [isLoading, setIsLoading] = useState(false);
   
  const merchant = auth?.merchant;
  const merchantCode = merchant?.merchantCode;
  const { env } = useSelector((state) => state.env);

  const { fetchAnalysis, isConnected } = useGlobalWebSocket();

  // Get config for current mode
  const config = MODE_CONFIG[mode] || MODE_CONFIG?.OVER_VIEW;

  // Fetch data when params change
  useEffect(() => {
    if (!merchantCode || !isConnected) return;

    setIsLoading(true);
    fetchAnalysis({
      room_id: merchantCode,
      env: env === "Live" ? "Live" : "Test",
      intervals: interval || "Daily",
      mode: mode,
    });

    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [merchantCode, isConnected, env, interval, mode, fetchAnalysis]);

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  const insight = mergedAnalytics?.paymentmethodBreakdown?.Insight ?? 
                  mergedAnalytics?.paymentmethodBreakdown?.insight ?? 
                  "Insufficient data for insights";

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
          } else if (col?.accessor) {
            value = row[col?.accessor] ?? "";
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

  // Render card value
  const renderCardValue = (cardConfig) => {
    if (isLoading) return '---';
    
    const value = getNestedValue(mergedAnalytics, cardConfig?.valueKey);
    if (value === null || value === undefined) return '₦0';
    
    const prefix = cardConfig?.prefix || '';
    const suffix = cardConfig?.suffix || '';
    
    if (prefix === '₦') {
      return `${prefix}${formatNumber(value)}${suffix}`;
    }
    return `${prefix}${value}${suffix}`;
  };

  // Render card subtitle
  const renderCardSubtitle = (cardConfig) => {
    if (cardConfig?.subtitle2) return undefined;
    if (cardConfig?.subtitleKey) {
      const value = getNestedValue(mergedAnalytics, cardConfig?.subtitleKey);
      return value || '';
    }
    return undefined;
  };

  if (isLoading && !mergedAnalytics) {
    return (
      <div className="h-[80vh] w-full">
        <Spinner />
      </div>
    );
  }

  return (    
    <div className="space-y-8">      
      <Link to="/" className="flex gap-3 text-sm md:text-md w-40 py-3 rounded-lg hover:bg-green-300 hover:text-white">
        <ArrowLeft size="18px" />
        <p>Back to overview</p>
      </Link>

      <div className="flex my-5 text-sm md:text-md gap-1">
        <Link to="/">
          <span className="text-gray-500">Dashboard</span>
        </Link>
        <ChevronRight className="text-gray-500 mt-0.5" size="18px" />
        <span className="font-bold">{config?.title}</span>
      </div>

      <div className="flex justify-between">
        <div className="my-2">
          <h2 className="text-lg font-bold sm:text-xl md:text-3xl md:font-bold">
            {config?.title} — Detailed Analytics
          </h2>
          <p className="text-gray-500 py-3 text-[11px] sm:text-[18px]">
            {config?.subtitle}
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

      <div className="text-green-400">
        <DashboardChart 
          trendLine={mergedAnalytics?.trendLine} 
          type="Count" 
          title={config?.chartTitle}
          subTitle={config?.chartName}
          mode={mode}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-10">
        <div className="sm:col-span-3">
          <DashboardPie 
            graph={mergedAnalytics?.paymentmethodBreakdown} 
            type="Count" 
          />
        </div>

        <div className="sm:col-span-1">
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <h3 className="text-[18px] font-bold pt-4">
              Key Insights & Observations
            </h3>

            <div className="flex gap-4 bg-green-50 border border-green-300 p-4 rounded-xl my-5">
              <div>
                <CheckCircleIcon size="25px" className="text-green-400" />
              </div>
              <div>
                <h4 className="font-bold text-xl">{config?.insightTitle}</h4>
                <p className="pt-2 text-[13px] text-gray-500">{insight}</p>
              </div>
            </div>

            <div className="flex gap-4 bg-blue-100 border border-blue-300 p-4 rounded-xl my-5">
              <div>
                <TrendingUp size="25px" className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-xl">{config?.insightSubtitle}</h4>
                <p className="pt-2 text-[13px] text-gray-500">
                  {config?.insightText}
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

          <div>
            <button
              onClick={() => exportToCSV(mergedAnalytics?.transactionDetails)}
              className="flex items-center gap-2 text-[14px] px-3 py-2 rounded-sm border border-gray-300 bg-gray-50 hover:bg-green-300/90 hover:text-white"
            >
              <DownloadIcon size={17} /> Export CSV
            </button>
          </div>
        </div>

        <TransactionDetails columns={columns} data={mergedAnalytics?.transactionDetails} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {config?.cards.map((cardConfig) => (
          <Card
            key={cardConfig?.key}
            title={cardConfig?.title}
            value={renderCardValue(cardConfig)}
            subtitle={renderCardSubtitle(cardConfig)}
            subtitle2={cardConfig?.subtitle2}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDetailPage;

AnalyticsDetailPage.propTypes = {
  mode: PropTypes.string,
};