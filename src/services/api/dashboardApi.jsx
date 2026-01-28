import {
  graphFailure,
  graphStart,
  graphSuccess,
  lumpsumFailure,
  lumpsumStart,
  lumpsumSuccess,
} from "@/redux/slices/dashboardSlice";
import {
  analyticsFailure,
  analyticsStart,
  analyticsSuccess,
  transactionFailure,
  transactionStart,
  transactionSuccess,
} from "../../redux/slices/dashboardSlice";
class DashboardService {
  constructor(axiosPrivate, auth) {
    this.axiosPrivate = axiosPrivate;
    this.auth = auth;
  }

  buildQuery(merchantCode, env, filters = {}) {
    const params = new URLSearchParams();

    if (env) params.set('env', env)

    const mapping = ['interval']

    mapping.forEach((key) =>{
      const value = filters[key]
      if (value) params.set(key, value)
    });

    return `/api/Dashboard/analytics/${merchantCode}?${params.toString()}`;
  }

  async fetchLumpsum(merchantCode, env, interval, dispatch) {
    dispatch(lumpsumStart());
    try {
      const response = await this.axiosPrivate.get(
        `api/Dashboard/tnx/lumpsum/${merchantCode}?env=${env}&interval=${interval}`
      );
      const data = response.data.ResponseData;
      dispatch(lumpsumSuccess(data));
    } catch (err) {
      if (!err.response) {
        dispatch(lumpsumFailure("No response from server"));
      } else {
        dispatch(lumpsumFailure("Failed to load dashboard data. Try again."));
      }
    }
  }

  async fetchGraph(merchantCode, env, interval, dispatch) {
    try {
      dispatch(graphStart());
      const response = await this.axiosPrivate.get(
        `api/Dashboard/tnx/graph/${merchantCode}?env=${env}&interval=${interval}`
      );
      const data = response.data.ResponseData;
      dispatch(graphSuccess(data));
    } catch (err) {
      if (!err.response) {
        dispatch(graphFailure("No response from server"));
      } else {
        dispatch(graphFailure("Failed to load data. Try again."));
      }
    }
  }

  async fetchtransactions(merchantCode, env, dispatch) {
    dispatch(transactionStart());
    try {
      // Use the unified deep-search endpoint (GET) with query params
      const params = new URLSearchParams({
        pageNumber: "1",
        pageSize: "5",
        totalSize: "1",
        env: env,
        status: "Successful",
      }).toString();

      const response = await this.axiosPrivate.get(
        `api/Transaction/deep-search/${merchantCode}?${params}`
      );

      const data = response.data;
      // console.log("Dashboard transaction", data)
      // API returns data in different shapes; normalize to data.data when available
      dispatch(transactionSuccess(data));
      // dispatch(transactionSecondSuccess(data));
    } catch (err) {
      if (!err.response) {
        dispatch(transactionFailure("No response from server"));
      } else {
        dispatch(
          transactionFailure("Failed to load Customer transactions. Try again.")
        );
      }
    }
  }

  // async fetchAnalytics(merchantCode, env, filters, dispatch){
  //   dispatch(analyticsStart());
  //   try{
  //     const url = this.buildQuery(merchantCode, env, filters);
  //     const response = await this.axiosPrivate.get(url);
  //     const data = response.data.ResponseData
  //     dispatch(analyticsSuccess(data));
  //     console.log("Analytics Api data", data)
  //   }
  //   catch(err){
  //     if(!err.response){
  //       dispatch(analyticsFailure('No response from server'))
  //     }else {
  //         dispatch(analyticsFailure('Failed to load Analytics. Try again.'));
  //     }
  //     console.error('fetchAnalytics error:', err);
  //   }

  // }

  async fetchAnalytics(merchantCode, env, interval, mode, dispatch){
    dispatch(analyticsStart());
    try{
      const response = await this.axiosPrivate.get(
        `api/Dashboard/analytics/${merchantCode}?env=${env}&interval=${interval}&mode=${mode}`
      );
      const data = response.data.ResponseData
      dispatch(analyticsSuccess(data));
    }
    catch(err){
      if(!err.response){
        dispatch(analyticsFailure('No response from server'))
      }else {
          dispatch(analyticsFailure('Failed to load Analytics. Try again.'));
      }
      console.error('fetchAnalytics error:', err);
    }

  }

}

export default DashboardService;
