import Card from "@/components/Card";
import {DollarSign, TrendingUp} from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import AnimatedLineChart from "./AnimatedLine";

function DashboardCards({ lumpsum, analytics, onModeChange, isRealtime, isLoading }) {
  // const totalRevenue = useMemo(() => {
  //   if (!lumpsum || !Array.isArray(lumpsum)) return 0;
  //   return lumpsum
  //     .filter((data) => data.transactionStatus === "Successful")
  //     .reduce((sum, data) => sum + Number(data.transactionVolume || 0), 0);
  // }, [lumpsum]);

  // const totalCounts = useMemo(() => {
  //   if (!lumpsum || !Array.isArray(lumpsum)) return 0;
  //   return lumpsum.reduce((sum, t) => sum + t.transactionCount, 0);
  // }, [lumpsum]);

  // const successfulTransaction = useMemo(() => {
  //   if (!lumpsum || !Array.isArray(lumpsum)) return 0;
  //   return (
  //     lumpsum.find((item) => item.transactionStatus === "Successful")
  //       ?.transactionCount ?? 0
  //   );
  // }, [lumpsum]);

const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return Number(num).toLocaleString();
};

const totalProcessedVolume = analytics?.totalProcesseVolume;
const netSettledVolume = analytics?.totalNetted;
const averageTransactionVolume = analytics?.averageTransactionValue;

// const handleMode = (mode) =>{
//  if (onModeChange) onModeChange(mode);
// }

  // failedTransaction intentionally omitted (not currently displayed)

  return (
    <>
      {/* Real-time indicator */}
      {/* {isRealtime && (
        <div className="mb-3 flex items-center gap-2 text-green-600 text-sm">
          <Wifi size={16} className="animate-pulse" />
          <span>Live data - Auto-updating</span>
        </div>
      )} */}
      
      {/* {!isRealtime && (
        <div className="mb-3 flex items-center gap-2 text-gray-500 text-xs">
          <WifiOff size={14} />
          <span>Using cached data</span>
        </div>
      )} */}

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8 md:mb-0">
      <Link to="/analytics/total-processed-volume">
        <Card
          title="Total Processed Volume"
          value={isLoading ? '---' : `₦${formatNumber(totalProcessedVolume?.totalProcessedVolume ?? 0)}`}
          subtitle={`${totalProcessedVolume?.percentChange}% vs last month`}
          // subtitle="+8% vs last month"
          icon={<DollarSign size="40px" className="text-[#40B869] bg-green-50 rounded-full p-2" />}
          svg={
            <AnimatedLineChart
              className="text-green-500 w-[100%] h-[100%]"
              pathData="M5,24.643C20.714,23.393,36.429,22.143,52.143,22.143C67.857,22.143,83.571,23.571,99.286,23.571C115,23.571,130.714,17.5,146.429,17.5C162.143,17.5,177.857,20,193.571,20C209.286,20,225,13.929,240.714,13.929C256.429,13.929,272.143,16.429,287.857,16.429C303.571,16.429,319.286,13.571,335,10.714"
            />
          }
        />
      </Link>

      <Link to="/analytics/net-settled-volume">
      <Card
        title="Net Settled Volume"
        value={isLoading ? '---' : `₦${formatNumber(netSettledVolume?.netSettledVolume ?? 0)}`}
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
      
      <Link to="/analytics/average-transaction-value">
        <Card
        title="Average Transaction Value"
        value={isLoading ? '---' : `₦${averageTransactionVolume?.averageTransactionValue === 'NaN' ? 0 : averageTransactionVolume?.averageTransactionValue ?? 0}`}
        subtitle={`${averageTransactionVolume?.percentChange}% vs last month`}
        icon={<DollarSign size="40px" className="text-blue-500 bg-green-50 rounded-full p-2" />}
        svg={<AnimatedLineChart className="text-blue-500 w-[100%] h-[100%]" />}
      />
      </Link>
      
      <Link to='/analytics/revenue-growth-rate'>
        <Card
          title="Revenue Growth Rate"
          value={isLoading ? '---' : `${analytics?.revenueGrowth?.percentChange ?? 0}`}
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