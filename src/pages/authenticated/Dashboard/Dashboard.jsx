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
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import TransactionForm from "../Transaction/components/TransactionForm";
import { toggleEnv } from "../../../redux/slices/envSlice";

function Dashboard() {
  const { setAppTitle } = useTitle();
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const [interval, setInterval] = useState("Daily");
  const [transactionMode, setTransactionMode] = useState("Count");

  const user = auth?.data.user;
  const merchant = auth?.merchant;
  const merchantCode = merchant?.merchantCode;
  const dashboardService = useMemo(
    () => new DashboardService(axiosPrivate, auth),
    [axiosPrivate, auth]
  );
  const {
    lumpsum,
    lumpsumLoading,
    lumpsumError,
    graph,
    graphLoading,
    graphError,
    transactions,
    transactionLoading,
    transactionError,
  } = useSelector((state) => state.dashboard);

  const [isLumpsumLoading, setIsLumpsumLoading] = useState(lumpsumLoading);
  const [isGraphLoading, setIsGraphLoading] = useState(graphLoading);
  const [errMsg, setErrMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransactionData, setSelectedTransactionData] = useState({});
  const { env } = useSelector((state) => state.env);

  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const newData = env === "Live" ? true : false;
    setIsLive(newData);
  }, [env]);

  useEffect(() => {
    setAppTitle("Dashboard");
  }, [setAppTitle]);

  useEffect(() => {
    setIsLumpsumLoading(lumpsumLoading);
  }, [lumpsumLoading]);

  useEffect(() => {
    setIsGraphLoading(graphLoading);
  }, [graphLoading]);

  useEffect(() => {
    if (lumpsumError !== null) {
      setErrMsg(lumpsumError);
    } else {
      setErrMsg(graphError);
    }
  }, [lumpsumError, graphError]);

  const loadData = useCallback(async () => {
    if (merchantCode) {
      await dashboardService.fetchLumpsum(
        merchantCode,
        env,
        interval,
        dispatch
      );
      await dashboardService.fetchGraph(merchantCode, env, interval, dispatch);
    }
  }, [dashboardService, merchantCode, env, interval, dispatch]);

  useEffect(() => {
    if (!merchant) return;
    loadData();
  }, [merchant, interval, dispatch, dashboardService, loadData]);

  const loadTransactions = useCallback(async () => {
    if (merchantCode) {
      await dashboardService.fetchtransactions(merchantCode, env, dispatch);
    }
  }, [dashboardService, merchantCode, env, dispatch]);

  useEffect(() => {
    if (!merchant) return;
    loadTransactions();
  }, [merchant, dispatch, dashboardService, loadTransactions]);

  const handleRefresh = useCallback(() => {
    loadData();
    loadTransactions();
  }, [loadData, loadTransactions]);

  const handleOpenModal = (val) => {
    setSelectedTransactionData(val);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransactionData(null);
  };

  const handleToggleEnv = () => {
    // compute the next env based on current isLive (avoid stale state)
    const nextLive = !isLive;
    setIsLive(nextLive);
    const newEnv = nextLive ? "Live" : "Test";
    dispatch(toggleEnv(newEnv));
  };
  // useEffect(() => {
  //   if (merchant?.status === 0) {
  //     setIsLive(false);
  //   }
  // }, [merchant?.status]);

  if (errMsg !== null)
    return <ErrorLayout errMsg={errMsg} handleRefresh={handleRefresh} />;

  return (
    <div className="relative">
      <div
        className={`absolute h-full w-full ${
          isLumpsumLoading || isGraphLoading ? "block" : "hidden"
        }`}
      >
        <Spinner />
      </div>
      <div className="space-y-8">
        {/* {merchant?.status === 0 && (
          <p className="text-xs sm:text-sm font-semibold text-red-500 text-wrap">
            You can only go live after your compliance documents has been
            approved
          </p>
        )} */}
        <div className="">
          <div className="flex justify-between align-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
              Welcome back, {user.firstName}
            </h1>
            {/* <p className={`hidden sm:block text-xs sm:text-sm font-semibold ${merchant?.status === 'Sandbox' ? 'text-red-500' : 'text-green-500'}`}>{merchant?.status === 'Sandbox' ? 'Test Mode' : 'Live'}</p> */}

            <div className="flex items-center gap-2">
              <label className="flex items-center cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isLive}
                    onChange={handleToggleEnv}
                    className="sr-only peer"
                    // disabled={merchant?.status === 0 ? true : false}
                  />
                  <div className="w-10 h-5 bg-red-200 rounded-full shadow-inner peer-checked:bg-green-200 transition-colors duration-200"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                </div>
                <span
                  className={`ml-3 text-xs font-bold ${
                    isLive ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {isLive ? "Live Mode" : "Test Mode"}
                </span>
              </label>
            </div>
          </div>
          <p className="text-gray-600 text-sm sm:text-md md:text-lg">
            Overview of your payment gateway performance
          </p>
        </div>
        <p
          className={`sm:hidden text-end text-xs sm:text-sm font-semibold ${
            merchant?.status === "Sandbox" ? "text-red-500" : "text-green-500"
          }`}
        >
          {merchant?.status === "Sandbox" ? "Test Mode" : "Live"}
        </p>

        {/* <div className="mt-8">
          <label htmlFor="interval" className="mr-2 text-sm">Select Interval:</label>
          <select id="interval" value={interval} onChange={handleIntervalChange} className="p-2 border focus:outline-none rounded-md bg-white selection:bg-transparent">
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div> */}

        <div className="xl:hidden">
          <DashboardCards lumpsum={lumpsum} />
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
              <div className="col-span-3 p-4 border-r border-r-gray-300">
                <DashboardChart graph={graph} type={transactionMode} />
              </div>
              <div className="hidden xl:block py-4 px-5">
                <DashboardCards lumpsum={lumpsum} />
              </div>
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
              <DashboardPie graph={lumpsum} type={transactionMode} />
            </div>
          </div>

          <p className="text-sm mt-8  font-[600] uppercase">
            Last 5 successful transactions
          </p>
        </div>
        {isModalOpen && (
          <TransactionForm
            handleCloseModal={handleCloseModal}
            data={selectedTransactionData}
          />
        )}

        {transactionLoading ? (
          <div className="h-[40vh] w-full">
            <Spinner />
          </div>
        ) : transactionError ? (
          <ErrorLayout
            errMsg={transactionError}
            handleRefresh={loadTransactions}
          />
        ) : (
          <TransactionTable
            data={transactions}
            handleOpenModal={handleOpenModal}
            drpp=""
          />
        )}
        <div className="flex justify-end">
          <Link
            className="flex items-center text-xs text-priColor gap-2"
            to="/transactions"
          >
            View more
            <ArrowRight size="16px" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
