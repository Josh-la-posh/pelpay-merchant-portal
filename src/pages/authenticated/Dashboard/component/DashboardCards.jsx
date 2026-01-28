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
  const parsed = parseFloat(num);
  if (isNaN(parsed)) return "0";
  return parsed.toLocaleString();
};

// Parse percent change - handles formats like "- -100.00", "-100.00", "100.00"
const parsePercentChange = (value) => {
  if (value === null || value === undefined) return 0;
  const str = String(value).replace(/\s+/g, '').replace(/^-\s*-/, '-'); // "- -100" -> "-100"
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

const totalProcessedVolume = analytics?.totalProcesseVolume;
const netSettledVolume = analytics?.totalNetted;
const averageTransactionVolume = analytics?.averageTransactionValue;

// Helper to get date with PascalCase fallback
const getDate = (obj, field) => {
  if (!obj) return '';
  const pascalField = field.charAt(0).toUpperCase() + field.slice(1);
  return obj[pascalField] || obj[field] || '';
};

// Get values with PascalCase fallback
const getTotalProcessedValue = () => {
  return totalProcessedVolume?.TotalProcessedVolume ?? totalProcessedVolume?.totalProcessedVolume ?? 0;
};
const getTotalProcessedPercent = () => {
  return parsePercentChange(totalProcessedVolume?.PercentChange ?? totalProcessedVolume?.percentChange);
};
const getNetSettledValue = () => {
  return netSettledVolume?.NetSettledVolume ?? netSettledVolume?.netSettledVolume ?? 0;
};
const getNetSettledPercent = () => {
  return parsePercentChange(netSettledVolume?.PercentChange ?? netSettledVolume?.percentChange);
};
const getAvgTransactionValue = () => {
  return averageTransactionVolume?.AverageTransactionValue ?? averageTransactionVolume?.averageTransactionValue ?? 0;
};
const getAvgTransactionPercent = () => {
  return parsePercentChange(averageTransactionVolume?.PercentChange ?? averageTransactionVolume?.percentChange);
};

console.log('Analytics data in DashboardCards: ', totalProcessedVolume);

// Transaction count getters
const getTransactionCount = () => {
  return analytics?.transactionCounts?.CurrentTransactionCount ?? analytics?.transactionCounts?.currentTransactionCount ?? 0;
};
const getTransactionCountPercent = () => {
  return parsePercentChange(analytics?.transactionCounts?.PercentChange ?? analytics?.transactionCounts?.percentChange);
};

// Format single date for display - converts "2026-01-14" to "Jan 14"
const formatSingleDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr.trim());
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
};

// Format date range for display - converts "2026-01-14 - 2026-01-06" to "Jan 14 - Jan 06"
const formatDateRange = (dateStr) => {
  console.log('Formatting date range: ', dateStr);
  if (!dateStr) return '';
  try {
    const parts = dateStr.split(' - ');
    if (parts.length !== 2) return dateStr;
    return `${formatSingleDate(parts[0])} - ${formatSingleDate(parts[1])}`;
  } catch {
    return dateStr;
  }
};

// Map interval to display text
const getIntervalText = () => {
  const intervalMap = {
    'Hourly': 'previous 24 hours',
    'Daily': 'previous 7 days',
    'Weekly': 'previous 30 days',
    'Monthly': 'previous month',
    // 'Yearly': 'last year',
  };
  return intervalMap[interval] || 'previous period';
};

// Format subtitle text based on percent change
const formatSubtitle = (percent) => {
  const periodText = getIntervalText();
  if (percent === 0) return `no change vs ${periodText}`;
  if (percent > 0) return `+${percent.toFixed(2)}% increase vs ${periodText}`;
  return `${percent.toFixed(2)}% decrease vs ${periodText}`;
};

// Handle mode change when card is clicked
const handleCardClick = (mode) => {
  if (onModeChange) onModeChange(mode);
};

console.log('The interval is: ', interval)

  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 md:mb-0">
      <Link to="/analytics/total-processed-volume" onClick={() => handleCardClick("OVER_VIEW")}>
        <Card
          title="Total Processed Volume"
          value={`₦${formatNumber(getTotalProcessedValue())}`}
          subtitle={formatSubtitle(getTotalProcessedPercent())}
          subColor={getTotalProcessedPercent() > 0 ? 'text-priColor' : getTotalProcessedPercent() < 0 ? 'text-red-500' : 'text-gray-500'}
          currentDate={formatDateRange(getDate(totalProcessedVolume, 'currentDate'))}
          previousDate={formatDateRange(getDate(totalProcessedVolume, 'previousDate'))}
          icon={<NairaIcon size={40} className="text-priColor bg-green-50 rounded-full p-2" />}
          svg={
            getTotalProcessedPercent() > 0
              ? <AnimatedLineChart
                  className="text-green-500 w-[100%] h-[100%]"
                  pathData="M5,42.5C16.81,38.854,28.619,35.208,40.429,33.125C52.238,31.042,64.048,31.771,75.857,30C87.667,28.229,99.476,24.583,111.286,22.5C123.095,20.417,134.905,19.896,146.714,17.5C158.524,15.104,170.333,8.125,182.143,8.125C193.952,8.125,205.762,11.25,217.571,11.25C229.381,11.25,241.19,8.125,253,5"
                />
              : getTotalProcessedPercent() === 0
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
        value={`₦${formatNumber(getNetSettledValue())}`}
        subtitle={formatSubtitle(getNetSettledPercent())}
        subColor={getNetSettledPercent() > 0 ? 'text-priColor' : getNetSettledPercent() < 0 ? 'text-red-500' : 'text-gray-500'}
        currentDate={formatDateRange(getDate(netSettledVolume, 'currentDate'))}
        previousDate={formatDateRange(getDate(netSettledVolume, 'previousDate'))}
        icon={
          getNetSettledPercent() > 0
            ? <TrendingUp size="40px" className="text-[#40B869] bg-green-50 rounded-full p-2" />
            : getNetSettledPercent() < 0
            ? <TrendingDown size="40px" className="text-red-500 bg-red-50 rounded-full p-2" />
            : <CircleSlash size="40px" className="text-yellow-500 bg-yellow-50 rounded-full p-2" />
          }
        svg={
          getNetSettledPercent() > 0
            ? <AnimatedLineChart
                className="text-green-500 w-[100%] h-[100%]"
                pathData="M5,42.5C16.81,38.854,28.619,35.208,40.429,33.125C52.238,31.042,64.048,31.771,75.857,30C87.667,28.229,99.476,24.583,111.286,22.5C123.095,20.417,134.905,19.896,146.714,17.5C158.524,15.104,170.333,8.125,182.143,8.125C193.952,8.125,205.762,11.25,217.571,11.25C229.381,11.25,241.19,8.125,253,5"
              />
            : getNetSettledPercent() === 0
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
        value={`₦${formatNumber(getAvgTransactionValue())}`}
        subtitle={formatSubtitle(getAvgTransactionPercent())}
        subColor={getAvgTransactionPercent() > 0 ? 'text-priColor' : getAvgTransactionPercent() < 0 ? 'text-red-500' : 'text-gray-500'}
        currentDate={formatDateRange(getDate(averageTransactionVolume, 'currentDate'))}
        previousDate={formatDateRange(getDate(averageTransactionVolume, 'previousDate'))}
        icon={<NairaIcon size={40} className="text-priColor bg-green-50 rounded-full p-2" />}
        svg={
          getAvgTransactionPercent() > 0
            ? <AnimatedLineChart
                className="text-green-500 w-[100%] h-[100%]"
                pathData="M5,42.5C16.81,38.854,28.619,35.208,40.429,33.125C52.238,31.042,64.048,31.771,75.857,30C87.667,28.229,99.476,24.583,111.286,22.5C123.095,20.417,134.905,19.896,146.714,17.5C158.524,15.104,170.333,8.125,182.143,8.125C193.952,8.125,205.762,11.25,217.571,11.25C229.381,11.25,241.19,8.125,253,5"
              />
            : getAvgTransactionPercent() === 0
            ? <AnimatedLineChart className="text-blue-500 w-[100%] h-[100%]" />
            : <AnimatedLineChart className="text-red-500 w-[100%] h-[100%]"
                pathData="M5,5C16.81,8.646,28.619,12.292,40.429,14.375C52.238,16.458,64.048,15.729,75.857,17.5C87.667,19.271,99.476,22.917,111.286,25C123.095,27.083,134.905,27.604,146.714,30C158.524,32.396,170.333,39.375,182.143,39.375C193.952,39.375,205.762,36.25,217.571,36.25C229.381,36.25,241.19,39.375,253,42.5"
              />
        }
      />
      </Link>
      
      <Link to='/analytics/transaction-count' onClick={() => handleCardClick("TRANSACTION_COUNT")}>
        <Card
          title="Transaction Count"
          value={formatNumber(getTransactionCount())}
          subtitle={formatSubtitle(getTransactionCountPercent())}
          subColor={getTransactionCountPercent() > 0 ? 'text-priColor' : getTransactionCountPercent() < 0 ? 'text-red-500' : 'text-gray-500'}
          currentDate={formatDateRange(getDate(analytics?.transactionCounts, 'currentDate'))}
          previousDate={formatDateRange(getDate(analytics?.transactionCounts, 'previousDate'))}
          icon={
            getTransactionCountPercent() > 0
              ? <TrendingUp size="40px" className="text-[#40B869] bg-green-50 rounded-full p-2" />
              : getTransactionCountPercent() < 0
              ? <TrendingDown size="40px" className="text-red-500 bg-red-50 rounded-full p-2" />
              : <CircleSlash size="40px" className="text-yellow-500 bg-yellow-50 rounded-full p-2" />
          }
          svg={
            getTransactionCountPercent() > 0
            ? <AnimatedLineChart
                className="text-green-500 w-[100%] h-[100%]"
                pathData="M5,42.5C16.81,38.854,28.619,35.208,40.429,33.125C52.238,31.042,64.048,31.771,75.857,30C87.667,28.229,99.476,24.583,111.286,22.5C123.095,20.417,134.905,19.896,146.714,17.5C158.524,15.104,170.333,8.125,182.143,8.125C193.952,8.125,205.762,11.25,217.571,11.25C229.381,11.25,241.19,8.125,253,5"
              />
            : getTransactionCountPercent() === 0
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