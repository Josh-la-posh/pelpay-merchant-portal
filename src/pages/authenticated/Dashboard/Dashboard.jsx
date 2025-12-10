import { useEffect, useState, useMemo, useCallback } from "react";
import useTitle from "@/services/hooks/useTitle";
import useAuth from "@/services/hooks/useAuth";
// import useAxiosPrivate from "@/services/hooks/useAxiosPrivate";
import useAxiosPrivate from "@/services/hooks/useFormAxios";
import DashboardService from "@/services/api/dashboardApi";
import { useDispatch, useSelector } from "react-redux";
import DashboardCards from "./component/DashboardCards";
import DashboardChart from "./component/DashboardChart";
import DashboardPie from "./component/DashboardPie";
import Spinner from "@/components/Spinner";
import ErrorLayout from "@/components/ErrorLayout";
import TransactionTable from "../Transaction/components/TransactionTable";
import { ArrowRight, DownloadIcon, SendHorizontalIcon, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import TransactionForm from "../Transaction/components/TransactionForm";
import { toggleEnv, setEnv } from "../../../redux/slices/envSlice";
import SettingsService from '@/services/api/settingsApi';
import { use } from "react";
import Card from "../../../components/Card";
import AnalyticsChart from "./component/AnalyticsChart";
import { saveAs } from "file-saver";
import AnalyticsPie from "./component/AnalyticsPie";
import useWebSocket from "@/services/hooks/useWebSocket";
import { useDashboardData } from "@/services/hooks/useDashboardData";
import { updateRealtimeAnalytics, setConnectionStatus } from "@/redux/slices/realtimeSlice";

function Dashboard() {
  const { setAppTitle } = useTitle();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const [interval, setInterval] = useState("Daily");
  const [ mode, setMode] = useState("")
  const [transactionMode, setTransactionMode] = useState("Count");

  const user = auth?.data.user;
  const merchant = auth?.merchant;
  const merchantCode = merchant?.merchantCode;
  const dashboardService = useMemo(() => new DashboardService(axiosPrivate, auth), [axiosPrivate, auth]);
  const settingsService = useMemo(() => new SettingsService(axiosPrivate), [axiosPrivate]);
  
  // WEB SOCKET SETUP
  const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
  const { on, off, joinRoom, fetchAnalysis, isConnected: wsConnected } = useWebSocket(wsUrl);

  // Use merged data from realtime and API - pass WebSocket connection status
  const { analytics: mergedAnalytics, lumpsum: mergedLumpsum, graph: mergedGraph, transactions: mergedTransactions, isRealtime } = useDashboardData();
  
  const {
    lumpsumLoading,
    lumpsumError,
    graphLoading,
    graphError,
    transactionLoading,
    transactionError,
    analyticsLoading,
    analyticsError,
  } = useSelector((state) => state.dashboard);

  const [isLumpsumLoading, setIsLumpsumLoading] = useState(lumpsumLoading);
  const [isGraphLoading, setIsGraphLoading] = useState(graphLoading);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(analyticsLoading)
  const [isLoading, setIsLoading] = useState(analyticsLoading)
  const [errMsg, setErrMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransactionData, setSelectedTransactionData] = useState({});
    // const {transactionPageNumber, transactionPageSize, transactionTotalSize, } = useSelector((state) => state.transaction);
  // const [pageNumber, setPageNumber] = useState(transactionPageNumber);
  // const [pageSize, setPageSize] = useState(transactionPageSize);
  // const [totalSize, setTotalSize] = useState(transactionTotalSize);
  // const [currentFilters, setCurrentFilters] = useState({});

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

  useEffect(() => {
    setIsLumpsumLoading(lumpsumLoading);
  }, [lumpsumLoading]);

  useEffect(() => {
    setIsGraphLoading(graphLoading);
  }, [graphLoading]);

  useEffect(() => {
    setIsAnalyticsLoading(analyticsLoading);
  }, [analyticsLoading])

  useEffect(() => {
    setIsLoading(analyticsLoading);
  }, [analyticsLoading])

  useEffect(() => {
    if (lumpsumError !== null) {
      setErrMsg(lumpsumError);
    } else if (graphError !== null) {
      setErrMsg(graphError);
    }
    else{
      setErrMsg(analyticsError)
    }
  }, [lumpsumError, graphError, analyticsError]);

  const loadData = useCallback(async () => {
    // Only fetch from API if WebSocket is not connected or not providing realtime data
    if (merchantCode && !wsConnected) {
      await dashboardService.fetchLumpsum(
        merchantCode,
        env,
        interval,
        dispatch
      );
      await dashboardService.fetchGraph(merchantCode, env, interval, dispatch);
      await dashboardService.fetchAnalytics(merchantCode, env, interval, mode, dispatch)
    }
  }, [dashboardService, merchantCode, env, interval, mode, dispatch, wsConnected]);

  useEffect(() => {
    if (!merchant) return;
    // Load API data on initial mount or when WebSocket disconnects
    if (!wsConnected) {
      loadData();
    }
  }, [merchant, interval, dispatch, dashboardService, loadData, wsConnected]);

  const loadTransactions = useCallback(async () => {
    // Only fetch from API if WebSocket is not connected or not providing realtime data
    if (merchantCode && !wsConnected) {
      await dashboardService.fetchtransactions(merchantCode, env, dispatch);
    }
  }, [dashboardService, merchantCode, env, dispatch, wsConnected]);

// Join room whenever env / merchant / interval / mode changes
useEffect(() => {
  if (!merchantCode) return;

  joinRoom({
    room_id: merchantCode,
    env: env === "Live" ? "Live" : "Test",
    interval: interval || "Daily",
    mode: mode || "OVER_VIEW",
  });

}, [merchantCode, env, interval, mode, joinRoom, fetchAnalysis]);

// Join room whenever env / merchant / interval / mode changes
// useEffect(() => {
//   if (!merchantCode) return;

//   fetchAnalysis({
//     room_id: merchantCode,
//     env: env === "Live" ? "Live" : "Test",
//     interval: interval || "Daily",
//     mode: mode || "OVER_VIEW",
//   });

// }, [merchantCode, env, interval, mode, joinRoom, fetchAnalysis]);


// Listen for real-time events
useEffect(() => {
  if (!on || !off) return;

  const handleAnalytics = (data) => {
    console.log("📊 Real-time analytics update:", data);
    // Data is automatically processed in the realtimeSlice
    dispatch(updateRealtimeAnalytics(data));
  };

  const handleDashboardUpdate = () => {
    console.log("⚡ Real-time dashboard update received");
    // Refresh analytics when dashboard updates
    fetchAnalysis({
      room_id: merchantCode,
      env: env === "Live" ? "Live" : "Test",
      interval: interval || "Daily",
      mode: mode || "OVER_VIEW",
    });
  };

  const handleTransactionUpdate = () => {
    console.log("📡 Real-time transaction update");
    // Fetch fresh analytics which includes transaction data
    fetchAnalysis({
      room_id: merchantCode,
      env: env === "Live" ? "Live" : "Test",
      interval: interval || "Daily",
      mode: mode || "OVER_VIEW",
    });
  };

  // Initial fetch when params change
  fetchAnalysis({
    room_id: merchantCode,
    env: env === "Live" ? "Live" : "Test",
    interval: interval || "Daily",
    mode: mode || "OVER_VIEW",
  });

  on("analytics", handleAnalytics);
  on("dashboard:update", handleDashboardUpdate);
  on("transaction:new", handleTransactionUpdate);
  on("transaction:update", handleTransactionUpdate);

  // Update connection status
  dispatch(setConnectionStatus(wsConnected));

  return () => {
    off("analytics", handleAnalytics);
    off("dashboard:update", handleDashboardUpdate);
    off("transaction:new", handleTransactionUpdate);
    off("transaction:update", handleTransactionUpdate);
  };
}, [on, off, dispatch, wsConnected, merchantCode, env, interval, mode, fetchAnalysis]);


  useEffect(() => {
    if (!merchant) return;
    // Load API data on initial mount or when WebSocket disconnects
    if (!wsConnected) {
      loadTransactions();
    }
  }, [merchant, dispatch, dashboardService, loadTransactions, wsConnected]);

  const handleRefresh = useCallback(() => {
    if (wsConnected) {
      // If connected to WebSocket, request fresh data
      fetchAnalysis({
        room_id: merchantCode,
        env: env === "Live" ? "Live" : "Test",
        interval: interval || "Daily",
        mode: mode || "OVER_VIEW",
      });
    } else {
      // Fallback to API calls when disconnected
      loadData();
      loadTransactions();
    }
  }, [wsConnected, fetchAnalysis, merchantCode, env, interval, mode, loadData, loadTransactions]);

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
    if (complianceStatus !== 'approved' || updatingEnv) return; // guard
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

  const exportToCSV = (data, filename = "transactions.csv", columns) => {
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


  if (errMsg !== null)
    return <ErrorLayout errMsg={errMsg} handleRefresh={handleRefresh} />;

  // if (isLoading) return (
  //   <div className='h-[80vh] w-full '>
  //     <Spinner />
  //   </div>
  // );
  return (
    <div>
      <div className="relative">
        {/* <div
          className={`absolute h-[100%] w-full bg-gray-100 ${
              isAnalyticsLoading ? "block" : "hidden"
          }`}
        >
          <Spinner />
        </div> */}
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
                    <option value="Today">Today</option>
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
            <DashboardCards lumpsum={mergedLumpsum} analytics={mergedAnalytics} onModeChange={(m) => setMode(m)} isRealtime={isRealtime} isLoading={isLoading}/>
          </div>

          <div className="xl:grid grid-cols-7 gap-4">
          <div className="bg-white col-span-5 mb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 px-4 sm:px-8 border-b border-b-gray-300 space-y-5 sm:space-y-0">
              <p className="text-2xl md:text-xl lg:text-2xl font-[800]">
                Transaction {transactionMode}
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
            </div>
            <div className="xl:grid grid-cols-4">
              <div className="col-span-4 p-4 border-r border-r-gray-300">
                <DashboardChart graph={mergedGraph} type={transactionMode} />
              </div>
              {/* <div className="hidden xl:block py-4 px-5">
                <DashboardCards lumpsum={lumpsum} />
              </div> */}
            </div>
          </div>
          <div className="bg-white col-span-2 border-b border-b-gray-300">
            <p className="text-2xl md:text-xl lg:text-2xl font-[800] mb-5 py-5 px-6 border-b border-b-gray-300">
              {transactionMode}
            </p>
            <div className="flex justify-center mb-5">
              <button
                onClick={() => setTransactionMode("Count")}
                className={`${
                  transactionMode === "Count"
                    ? "bg-gray-200 shadow-md text-priColor font-[600]"
                    : "font-[500] text-gray-300"
                } text-sm px-5 py-2 rounded-md`}
              >
                Count
              </button>
              <button
                onClick={() => setTransactionMode("Volume")}
                className={`${
                  transactionMode === "Volume"
                    ? "bg-gray-200 shadow-md text-priColor font-[600]"
                    : "font-[500] text-gray-300"
                } text-sm px-5 py-2 rounded-md`}
              >
                Volume
              </button>
            </div>
            <div className="border-b border-b-gray-300 pb-8">
              <DashboardPie graph={mergedLumpsum} type={transactionMode} />
            </div>
          </div>
          </div>


          <div className="col-span-3 p-4 border-r border-r-gray-300 text-blue-300">
            <AnalyticsChart 
                analytics={mergedAnalytics?.trendLine}
                type="count"
                title="Total Processed Volume (₦M)"
                name="Total Processed Volume"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-10">
              <div className="col-span-2">
                <AnalyticsPie analytics={mergedAnalytics?.paymentmethodBreakdown}  title={"Volume Breakdown by Payment Method"}/>
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
