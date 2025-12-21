import Card from "@/components/Card";
import {CircleSlash, TrendingDown, TrendingUp} from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AnimatedLineChart from "./AnimatedLine";

// Custom Naira icon component
const NairaIcon = ({ size = 40, className = "" }) => (
  <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <span style={{ fontSize: size * 0.5, fontWeight: 'bold' }}>₦</span>
  </div>
);

NairaIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
};

function DashboardCards({ analytics, onModeChange, interval = 'Daily' }) {

const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return Number(num).toLocaleString();
};

const totalProcessedVolume = analytics?.totalProcesseVolume;
const netSettledVolume = analytics?.totalNetted;
const averageTransactionVolume = analytics?.averageTransactionValue;

// Handle mode change when card is clicked
const handleCardClick = (mode) => {
  if (onModeChange) onModeChange(mode);
};

  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8 md:mb-0">
      <Link to="/analytics/total-processed-volume" onClick={() => handleCardClick("OVER_VIEW")}>
        <Card
          title="Total Processed Volume"
          value={`₦${formatNumber(totalProcessedVolume?.totalProcessedVolume ?? 0)}`}
          subtitle={`${totalProcessedVolume?.percentChange}% vs last ${interval === 'yearly' ? 'last year' : interval === 'monthly' ? 'last month' : interval === 'weekly' ? 'last week' : '24 hours'}`}
          icon={<NairaIcon size={40} className="text-priColor bg-green-50 rounded-full p-2" />}
          svg={
            Number(totalProcessedVolume?.percentChange) > 0
              ? <AnimatedLineChart
                  className="text-green-500 w-[100%] h-[100%]"
                  pathData="M5,42.5C16.81,38.854,28.619,35.208,40.429,33.125C52.238,31.042,64.048,31.771,75.857,30C87.667,28.229,99.476,24.583,111.286,22.5C123.095,20.417,134.905,19.896,146.714,17.5C158.524,15.104,170.333,8.125,182.143,8.125C193.952,8.125,205.762,11.25,217.571,11.25C229.381,11.25,241.19,8.125,253,5"
                />
              : Number(totalProcessedVolume?.percentChange) === 0
              ? <AnimatedLineChart className="text-blue-500 w-[100%] h-[100%]" />
              : <AnimatedLineChart className="text-red-500 w-[100%] h-[100%]"
                  pathData="M5,5C16.81,8.646,28.619,12.292,40.429,14.375C52.238,16.458,64.048,15.729,75.857,17.5C87.667,19.271,99.476,22.917,111.286,25C123.095,27.083,134.905,27.604,146.714,30C158.524,32.396,170.333,39.375,182.143,39.375C193.952,39.375,205.762,36.25,217.571,36.25C229.381,36.25,241.19,39.375,253,42.5"
                />
          }
        />
      </Link>

      <Link to="/analytics/net-settled-volume" onClick={() => handleCardClick("NET_SETTLED")}>
      <Card
        title="Net Settled Volume"
        value={`₦${formatNumber(netSettledVolume?.netSettledVolume ?? 0)}`}
        subtitle2="Funds confirmed and deposited"
        icon={
          formatNumber(netSettledVolume?.netSettledVolume) > 0
            ? <TrendingUp size="40px" className="text-[#40B869] bg-green-50 rounded-full p-2" />
            : formatNumber(netSettledVolume?.netSettledVolume) < 0
            ? <TrendingDown size="40px" className="text-red-500 bg-red-50 rounded-full p-2" />
            : <CircleSlash size="40px" className="text-yellow-500 bg-yellow-50 rounded-full p-2" />
          }
        svg={
          Number(netSettledVolume?.netSettledVolume) > 0
            ? <AnimatedLineChart
                className="text-green-500 w-[100%] h-[100%]"
                pathData="M5,42.5C16.81,38.854,28.619,35.208,40.429,33.125C52.238,31.042,64.048,31.771,75.857,30C87.667,28.229,99.476,24.583,111.286,22.5C123.095,20.417,134.905,19.896,146.714,17.5C158.524,15.104,170.333,8.125,182.143,8.125C193.952,8.125,205.762,11.25,217.571,11.25C229.381,11.25,241.19,8.125,253,5"
              />
            : Number(netSettledVolume?.netSettledVolume) === 0
            ? <AnimatedLineChart className="text-blue-500 w-[100%] h-[100%]" />
            : <AnimatedLineChart className="text-red-500 w-[100%] h-[100%]"
                pathData="M5,5C16.81,8.646,28.619,12.292,40.429,14.375C52.238,16.458,64.048,15.729,75.857,17.5C87.667,19.271,99.476,22.917,111.286,25C123.095,27.083,134.905,27.604,146.714,30C158.524,32.396,170.333,39.375,182.143,39.375C193.952,39.375,205.762,36.25,217.571,36.25C229.381,36.25,241.19,39.375,253,42.5"
              />
        }
      />
      </Link>

      <Link to="/analytics/average-transaction-value" onClick={() => handleCardClick("AVERAGE_TRANSACTION_VALUE")}>
        <Card
        title="Average Transaction Value"
        value={`₦${averageTransactionVolume?.averageTransactionValue === 'NaN' ? 0 : averageTransactionVolume?.averageTransactionValue ?? 0}`}
        subtitle={`${averageTransactionVolume?.percentChange}% vs last ${interval === 'yearly' ? 'last year' : interval === 'monthly' ? 'last month' : interval === 'weekly' ? 'last week' : '24 hours'}`}
        icon={<NairaIcon size={40} className="text-priColor bg-green-50 rounded-full p-2" />}
        svg={
          Number(averageTransactionVolume?.percentChange) > 0
            ? <AnimatedLineChart
                className="text-green-500 w-[100%] h-[100%]"
                pathData="M5,42.5C16.81,38.854,28.619,35.208,40.429,33.125C52.238,31.042,64.048,31.771,75.857,30C87.667,28.229,99.476,24.583,111.286,22.5C123.095,20.417,134.905,19.896,146.714,17.5C158.524,15.104,170.333,8.125,182.143,8.125C193.952,8.125,205.762,11.25,217.571,11.25C229.381,11.25,241.19,8.125,253,5"
              />
            : Number(averageTransactionVolume?.percentChange) === 0
            ? <AnimatedLineChart className="text-blue-500 w-[100%] h-[100%]" />
            : <AnimatedLineChart className="text-red-500 w-[100%] h-[100%]"
                pathData="M5,5C16.81,8.646,28.619,12.292,40.429,14.375C52.238,16.458,64.048,15.729,75.857,17.5C87.667,19.271,99.476,22.917,111.286,25C123.095,27.083,134.905,27.604,146.714,30C158.524,32.396,170.333,39.375,182.143,39.375C193.952,39.375,205.762,36.25,217.571,36.25C229.381,36.25,241.19,39.375,253,42.5"
              />
        }
      />
      </Link>
      
      <Link to='/analytics/revenue-growth-rate' onClick={() => handleCardClick("REVENUE_GROWTH_RATE")}>
        <Card
          title="Revenue Growth Rate"
          value={`${analytics?.revenueGrowth?.percentChange ?? 0}%`}
          subtitle2="Mont-over-month growth"
          icon={
            analytics?.revenueGrowth?.percentChange > 0
              ? <TrendingUp size="40px" className="text-[#40B869] bg-green-50 rounded-full p-2" />
              : analytics?.revenueGrowth?.percentChange < 0
              ? <TrendingDown size="40px" className="text-red-500 bg-red-50 rounded-full p-2" />
              : <CircleSlash size="40px" className="text-yellow-500 bg-yellow-50 rounded-full p-2" />
          }
          svg={
            Number(analytics?.revenueGrowth?.percentChange) > 0
            ? <AnimatedLineChart
                className="text-green-500 w-[100%] h-[100%]"
                pathData="M5,42.5C16.81,38.854,28.619,35.208,40.429,33.125C52.238,31.042,64.048,31.771,75.857,30C87.667,28.229,99.476,24.583,111.286,22.5C123.095,20.417,134.905,19.896,146.714,17.5C158.524,15.104,170.333,8.125,182.143,8.125C193.952,8.125,205.762,11.25,217.571,11.25C229.381,11.25,241.19,8.125,253,5"
              />
            : Number(analytics?.revenueGrowth?.percentChange) === 0
            ? <AnimatedLineChart className="text-blue-500 w-[100%] h-[100%]" />
            : <AnimatedLineChart className="text-red-500 w-[100%] h-[100%]"
                pathData="M5,5C16.81,8.646,28.619,12.292,40.429,14.375C52.238,16.458,64.048,15.729,75.857,17.5C87.667,19.271,99.476,22.917,111.286,25C123.095,27.083,134.905,27.604,146.714,30C158.524,32.396,170.333,39.375,182.143,39.375C193.952,39.375,205.762,36.25,217.571,36.25C229.381,36.25,241.19,39.375,253,42.5"
              />
          }
        />
      </Link>
      
    </div>
    </>
  );
}

export default DashboardCards;

DashboardCards.propTypes = {
  lumpsum: PropTypes.array,
  analytics: PropTypes.object,
  onModeChange: PropTypes.func,
  isRealtime: PropTypes.bool,
  isLoading: PropTypes.bool,
  interval: PropTypes.string
};