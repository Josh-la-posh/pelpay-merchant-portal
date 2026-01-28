import {
  AlertTriangleIcon,
  ArrowLeft,
  CheckCircleIcon,
  ChevronRight,
  DownloadIcon
} from "lucide-react";
import DashboardChart from "./DashboardChart";
import DashboardPie from "./DashboardPie";
import TransactionTable from "../../Transaction/components/TransactionTable";
import Card from "../../../../components/Card";
import { Link } from "react-router-dom";

const DisputeDashboard = () => {
  return (
    <div>
      <Link to="/">
        <div className="flex gap-3 text-sm md:text-md w-40 py-3 rounded-lg hover:bg-green-300 hover:text-white">
          <ArrowLeft size="18px" />
          <p>Back to overview</p>
        </div>
      </Link>

      <div className="flex my-5 text-sm md:text-md gap-1">
        <Link to="/">
          <span className="text-gray-500">Dashboard</span>
        </Link>
        <ChevronRight className="text-gray-500 mt-0.5" size="18px" />
        <span className="font-bold">Dispute & Chargeback Ratio</span>
      </div>

      <div className="flex justify-between">
        <div className="my-2">
          <h2 className="text-lg font-bold sm:text-xl md:text-3xl md:font-bold">
            Dispute & Chargeback Ratio — Detailed Analytics
          </h2>
          <p className="text-gray-500 py-3 text-[11px] sm:text-[18px]">
            Month-over-month revenue growth analysis
          </p>
        </div>

        <div className="mt-2">
          <select
            name=""
            id=""
            className="border border-gray-300 p-1 md:p-2 rounded-md md:rounded-xl md:w-50 outline-green-300 z-40"
          >
            <option value="">Today</option>
            <option value="">Last 7 days</option>
            <option value="">Last 30 days</option>
            <option value="">Custom Range</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-8 md:mb-0">
        <Card
          title="Current Growth"
          subtitle="Month-over-month"
          //   value={`₦${totalRevenue}`}
          // value="124556789767"
        />

        <Card
          title="Best Channel"
          // value={`₦${totalCounts}`}
          subtitle2="Bank Transfers"
        />
        <Card
          title="Quarterly Trend"
          subtitle2="Strong expansion"
          // value={`₦${successfulTransaction}`}
        />
      </div>

      <div className="mt-5 text-[#FFC107]">
        <DashboardChart title="Dispute Ratio (%)" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-10">
        <div className=" sm:col-span-3 ">
          <DashboardPie />
        </div>

        <div className="sm:col-span-2">
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <h3 className="text-[18px] font-bold pt-4">
              Key Insights & Observations
            </h3>

            <div className="flex gap-4 bg-green-50 border border-green-300 p-4 rounded-xl my-5 ">
              <div>
                <CheckCircleIcon size="25px" className="text-green-400" />
              </div>
              <div>
                <h4 className="font-bold text-xl">Low Dispute Rate</h4>
                <p className="pt-2 text-[13px] text-gray-500">
                  Dispute ratio remains at 0.3%, well within safe range for the
                  industry.
                </p>
              </div>
            </div>

            <div className="flex gap-4 bg-blue-100 border border-blue-300 p-4 rounded-xl my-5 ">
              <div>
                <AlertTriangleIcon size="25px" className="text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-xl">Monitor Fraud Claims</h4>
                <p className="pt-2 text-[13px] text-gray-500">
                  Fraud-related disputes account for 42% of total disputes.
                  Consider enhanced verification for high-value transactions.
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
            <button className="flex items-center gap-2 text-[14px] px-3 py-2 rounded-sm border border-gray-300 bg-gray-50 hover:bg-green-300/90 hover:text-white">
              <DownloadIcon size={17} /> Export CSV
            </button>
          </div>
        </div>
        <TransactionTable />
      </div>
    </div>
  );
};

export default DisputeDashboard;
