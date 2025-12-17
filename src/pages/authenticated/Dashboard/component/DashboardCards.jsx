import Card from "@/components/Card";
import {DollarSign, TrendingUp} from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AnimatedLineChart from "./AnimatedLine";

function DashboardCards({ analytics, onModeChange }) {

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
          subtitle={`${totalProcessedVolume?.percentChange}`}
          icon={<DollarSign size="40px" className="text-[#40B869] bg-green-50 rounded-full p-2" />}
          svg={
            <AnimatedLineChart
              className="text-green-500 w-[100%] h-[100%]"
              pathData="M5,24.643C20.714,23.393,36.429,22.143,52.143,22.143C67.857,22.143,83.571,23.571,99.286,23.571C115,23.571,130.714,17.5,146.429,17.5C162.143,17.5,177.857,20,193.571,20C209.286,20,225,13.929,240.714,13.929C256.429,13.929,272.143,16.429,287.857,16.429C303.571,16.429,319.286,13.571,335,10.714"
            />
          }
        />
      </Link>

      <Link to="/analytics/net-settled-volume" onClick={() => handleCardClick("NET_SETTLED")}>
      <Card
        title="Net Settled Volume"
        value={`₦${formatNumber(netSettledVolume?.netSettledVolume ?? 0)}`}
        subtitle2="Funds confirmed and deposited"
        icon={<TrendingUp size="40px" className="text-[#40B869] bg-green-50 rounded-full p-2" />}
        svg={
            <AnimatedLineChart
              className="text-green-500 w-[100%] h-[100%]"
              pathData="M5,24.643C20.714,23.393,36.429,22.143,52.143,22.143C67.857,22.143,83.571,23.571,99.286,23.571C115,23.571,130.714,17.5,146.429,17.5C162.143,17.5,177.857,20,193.571,20C209.286,20,225,13.929,240.714,13.929C256.429,13.929,272.143,16.429,287.857,16.429C303.571,16.429,319.286,13.571,335,10.714"
            />
        }
      />
      </Link>

      <Link to="/analytics/average-transaction-value" onClick={() => handleCardClick("AVERAGE_TRANSACTION_VALUE")}>
        <Card
        title="Average Transaction Value"
        value={`₦${averageTransactionVolume?.averageTransactionValue === 'NaN' ? 0 : averageTransactionVolume?.averageTransactionValue ?? 0}`}
        subtitle={`${averageTransactionVolume?.percentChange}`}
        icon={<DollarSign size="40px" className="text-blue-500 bg-green-50 rounded-full p-2" />}
        svg={<AnimatedLineChart className="text-blue-500 w-[100%] h-[100%]" />}
      />
      </Link>
      
      <Link to='/analytics/revenue-growth-rate' onClick={() => handleCardClick("REVENUE_GROWTH_RATE")}>
        <Card
          title="Revenue Growth Rate"
          value={`${analytics?.revenueGrowth?.percentChange ?? 0}`}
          subtitle2="Mont-over-month growth"
          icon={<TrendingUp size="40px" className="text-[#40B869] bg-green-50 rounded-full p-2" />}
          svg={<AnimatedLineChart className="text-green-500 w-[100%] h-[100%]"
          pathData="M5,42.5C16.81,38.854,28.619,35.208,40.429,33.125C52.238,31.042,64.048,31.771,75.857,30C87.667,28.229,99.476,24.583,111.286,22.5C123.095,20.417,134.905,19.896,146.714,17.5C158.524,15.104,170.333,8.125,182.143,8.125C193.952,8.125,205.762,11.25,217.571,11.25C229.381,11.25,241.19,8.125,253,5"
            
            />}
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
};