import { useEffect, useState, useMemo } from "react";
import useTitle from "@/services/hooks/useTitle";
import useAuth from "@/services/hooks/useAuth";
import useAxiosPrivate from "@/services/hooks/useFormAxios";
import { useDispatch, useSelector } from "react-redux";
import DashboardCards from "./component/DashboardCards";
import DashboardChart from "./component/DashboardChart";
import DashboardPie from "./component/DashboardPie";
import TransactionTable from "../Transaction/components/TransactionTable";
import { ArrowRight, DownloadIcon, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import TransactionForm from "../Transaction/components/TransactionForm";
import { toggleEnv, setEnv } from "../../../redux/slices/envSlice";
import SettingsService from '@/services/api/settingsApi';
import Card from "../../../components/Card";
import { saveAs } from "file-saver";
import { useGlobalWebSocket } from "@/services/context/WebSocketProvider";
import { useDashboardData } from "@/services/hooks/useDashboardData";

function Dashboard() {
  const { setAppTitle } = useTitle();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const [interval, setInterval] = useState("Daily");
  const [ mode, setMode] = useState("")
  const [transactionMode] = useState("Count");

  const user = auth?.data.user;
  const merchant = auth?.merchant;
  const merchantCode = merchant?.merchantCode;
  const settingsService = useMemo(() => new SettingsService(axiosPrivate), [axiosPrivate]);
  
  // Use global WebSocket - room is already joined
  const { fetchAnalysis, isConnected: wsConnected } = useGlobalWebSocket();

  // Use merged data from realtime and API - pass WebSocket connection status
  const { analytics: mergedAnalytics, transactions: mergedTransactions } = useDashboardData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransactionData, setSelectedTransactionData] = useState({});

  const { env, token } = useSelector((state) => state.env);
  const { complianceStatus } = useSelector((state) => state.compliance || {});
  const tokenizationStatus = token

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const newData = env === "Live" ? true : false;
    setIsLive(newData);
  }, [env]);

  const [complianceIsApproved, setComplianceIsApproved] = useState(false)
  useEffect(() =>{
    const approved = localStorage.getItem('complianceStatus');
    if(approved === 'approved' ){
      setComplianceIsApproved(true);
    }
    const timer = setTimeout(() => {
      setComplianceIsApproved(true);
      localStorage.setItem('complianceApprovedSeen', 'true'); 
    }, 60000);

    return () => clearTimeout(timer);
  }, [])

  const storedAuth = JSON.parse(localStorage.getItem("auth"));
  const getRolePermission = storedAuth?.data?.rolePermissions || [];
  const[roleGotten, setRoleGotten] = useState(false);
  
  useEffect(()=>{
    if(Array.isArray(getRolePermission) && getRolePermission.length > 0){
      setRoleGotten(true);
    }
  }, []) 

  useEffect(() => {
      setAppTitle("Dashboard");
  }, [setAppTitle]);

  // Fetch current environment from settings endpoint on initial mount
  useEffect(() => {
    let cancelled = false;
    const initEnv = async () => {
      const remoteEnv = await settingsService.fetchEnv(dispatch);
      if (!cancelled && remoteEnv) {
        // Already dispatched inside service; ensure local UI sync (isLive effect handles toggle)
      }
    };
    initEnv();
    return () => { cancelled = true; };
  }, [settingsService, dispatch]);

  // Fetch data when params change - room is already joined globally
  useEffect(() => {
    if (!merchantCode || !wsConnected) return;

    fetchAnalysis({
      room_id: merchantCode,
      env: env === "Live" ? "Live" : "Test",
      intervals: interval || "Daily",
      mode: mode || "OVER_VIEW",
    });
  }, [wsConnected, merchantCode, env, interval, mode, fetchAnalysis]);

  const handleOpenModal = (val) => {
    setSelectedTransactionData(val);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransactionData(null);
  };

  const [updatingEnv, setUpdatingEnv] = useState(false);
  const handleToggleEnv = async () => {
    if (complianceStatus !== 'approved' || updatingEnv) return;
    const nextLive = !isLive;
    const newEnv = nextLive ? 'Live' : 'Test';
    setUpdatingEnv(true);
    try {
      await settingsService.updateEnv(newEnv, tokenizationStatus, dispatch);
      dispatch(toggleEnv(newEnv));
      setIsLive(nextLive);
    } catch {
      // revert visual toggle if failed
      dispatch(setEnv(isLive ? 'Live' : 'Test'));
    } finally {
      setUpdatingEnv(false);
    }
  };

  const handleIntervalChange = (e) => {
    const selected = e.target.value;
    setInterval(selected);
  };

  const exportToCSV = (data, filename = "transactions.csv") => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);

    const csvRows = [
      headers.join(","), 
      ...data.map(row => 
        headers.map(field => `"${row[field] ?? ""}"`).join(",")
      ),
    ];

    const csvString = csvRows.join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  return (
    <div>
      <div className="relative">
        <div className="space-y-8">
          <div className="">
            {complianceStatus &&  !complianceIsApproved && (
            // {/* {complianceStatus && ( */}
              <div className="mb-4">
                {complianceStatus === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs sm:text-sm px-3 py-2 rounded-md">Your compliance registration is not completed.</div>
                )}
                {complianceStatus === 'under_review' && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm px-3 py-2 rounded-md">Your compliance registration is under review.</div>
                )}
                {complianceStatus === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm px-3 py-2 rounded-md">Your compliance registration was rejected.</div>
                )}
                {complianceStatus === 'approved' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 text-xs sm:text-sm px-3 py-2 rounded-md">Congratulations, your compliance registration has been approved.</div>
                )}
                {complianceStatus === 'started' && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs sm:text-sm px-3 py-2 rounded-md">You have started compliance, please continue your registration.</div>
                )}
              </div>
            )}
            {!roleGotten && (
              <div className="bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm px-3 py-2 rounded-md">
                Please reach out to the admin for assistance!
              </div>
            ) }

            <div className="flex justify-between align-center mt-3">
              <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                    Welcome back, {user.firstName}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-md md:text-lg pt-3">
                  Overview of your payment gateway performance
                  </p>
              </div>
              
              {/* <p className={`hidden sm:block text-xs sm:text-sm font-semibold ${merchant?.status === 'Sandbox' ? 'text-red-500' : 'text-green-500'}`}>{merchant?.status === 'Sandbox' ? 'Test Mode' : 'Live'}</p> */}
              <div>
                {roleGotten ? (
                  <div className="flex items-center gap-2">
                  <label className="flex items-center cursor-pointer select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isLive}
                        onChange={handleToggleEnv}
                        className="sr-only peer"
                        disabled={complianceStatus !== 'approved' || updatingEnv}
                      />
                      <div className="w-10 h-5 bg-red-200 rounded-full shadow-inner peer-checked:bg-green-200 transition-colors duration-200"></div>
                      <div className="dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                    </div>
                    <span
                      className={`ml-3 text-xs font-bold ${
                        isLive ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {updatingEnv ? 'Updating…' : (isLive ? 'Live Mode' : 'Test Mode')}
                    </span>
                  </label>
                </div>
                  ) :(
                    ""
                )}
                <div className="mt-4">
                  <select
                    id="interval"
                    onChange={handleIntervalChange}
                    value={interval}
                    className="border border-gray-300 p-1 md:p-2 rounded-md md:w-50 outline-green-300 z-40"
                  >
                    <option value="Daily">Today</option>
                    <option value="Weekly">Last 7 days</option>
                    <option value="Monthly">Last 30 days</option>
                    <option value="Yearly">Yearly</option>
                    <option value="">Custom Range</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <DashboardCards analytics={mergedAnalytics} onModeChange={setMode}/>
          </div>

          {/* <div className="xl:grid grid-cols-7 gap-4"> */}
          <div className="bg-white col-span-5 mb-4">
            {/* <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-4 sm:px-8 border-b border-b-gray-300 space-y-5 sm:space-y-0">
              <p className="text-2xl md:text-xl lg:text-2xl font-[800]">
                Revenue Trend Over Time
              </p>
              <div>
                <button
                  onClick={() => setInterval("Daily")}
                  className={`${
                    interval === "Daily"
                      ? "bg-gray-200 shadow-md text-priColor font-[600]"
                      : "font-[500] text-gray-300"
                  } text-xs md:text-sm px-5 py-2 rounded-md`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setInterval("Weekly")}
                  className={`${
                    interval === "Weekly"
                      ? "bg-gray-200 shadow-md text-priColor font-[600]"
                      : "font-[500] text-gray-300"
                  } text-xs md:text-sm px-5 py-2 rounded-md`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setInterval("Monthly")}
                  className={`${
                    interval === "Monthly"
                      ? "bg-gray-200 shadow-md text-priColor font-[600]"
                      : "font-[500] text-gray-300"
                  } text-xs md:text-sm px-5 py-2 rounded-md`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setInterval("Yearly")}
                  className={`${
                    interval === "Yearly"
                      ? "bg-gray-200 shadow-md text-priColor font-[600]"
                      : "font-[500] text-gray-300"
                  } text-xs md:text-sm px-5 py-2 rounded-md`}
                >
                  Yearly
                </button>
              </div>
            </div> */}
            <div className="xl:grid grid-cols-4">
              <div className="col-span-4 p-4 border-r border-r-gray-300">
                <DashboardChart trendLine={mergedAnalytics?.trendLine} type={transactionMode} title="Revenue Trend Over Time" subTitle="Total Processed Volume (₦M)" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
              <div className="col-span-2">
                <DashboardPie graph={mergedAnalytics?.paymentmethodBreakdown} title={"Channel Performance Breakdown"}/>
              </div>
              <div className="h-full">
                <Link to="/analytics/dispute-ratio" className="h-full block" >
                  <Card title="Dispute & Chargeback Ratio" value={`0.3%`} icon={<Shield size="40px" className="text-[#FFC107] bg-green-50  rounded-full p-2"/>} text="Within Safe range" subtitle2="12 active disputes"/>
                </Link>
            </div>
          </div>

          <div className="bg-white p-5 mt-10 rounded-lg">
            <div className="flex justify-between">
              <div>
                <h3 className="text-[18px] font-[500] pt-4">Transaction Details</h3>
              </div>

              <div className="">
                <button onClick={() => exportToCSV(mergedTransactions)} className="flex items-center gap-2 text-[14px] px-3 py-2 rounded-sm border border-gray-300 bg-gray-50 hover:bg-green-300/90 hover:text-white">
                  <DownloadIcon size={17} /> Export CSV
                </button>
              </div>
            </div>

            <p className="text-sm mt-8  font-[600] uppercase">
              Last 5 successful transactions
            </p>

            {isModalOpen && (
            <TransactionForm
              handleCloseModal={handleCloseModal}
              data={selectedTransactionData}
            />
          )}

             <TransactionTable
              data={mergedTransactions}
              handleOpenModal={handleOpenModal}
              drpp=""
              // totalSize={totalSize}
              // currentPage={pageNumber}
              // setCurrentPage={setPageNumber}
              // rowsPerPage={pageSize}
            />
          {roleGotten ? (
          <div className="flex justify-end mt-3">
            <Link
              className="flex items-center text-xs text-priColor gap-2"
              to="/transactions"
            >
              View more
              <ArrowRight size="16px" />
            </Link>
          </div>
          ) :(
            ""
          )}

          </div>
        </div>
      </div>
    </div>
   
  );
}

export default Dashboard;
