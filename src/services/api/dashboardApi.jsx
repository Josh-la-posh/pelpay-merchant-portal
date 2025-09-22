import { graphFailure, graphStart, graphSuccess, lumpsumFailure, lumpsumStart, lumpsumSuccess } from "@/redux/slices/dashboardSlice";
import { transactionFailure, transactionStart, transactionSuccess } from "../../redux/slices/dashboardSlice";

class DashboardService {
    constructor(axiosPrivate, auth) {
      this.axiosPrivate = axiosPrivate;
      this.auth = auth;
    }
  
    async fetchLumpsum(merchantCode, env, interval, dispatch) {
        dispatch(lumpsumStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Dashboard/tnx/lumpsum/${merchantCode}?env=${env}&interval=${interval}`,
        );
        const data = response.data.ResponseData;
        dispatch(lumpsumSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(lumpsumFailure('No response from server'));
        } else {
            dispatch(lumpsumFailure('Failed to load dashboard data. Try again.'));
        }
  }
    }
  
    async fetchGraph(merchantCode, env, interval, dispatch) {
      try {
        dispatch(graphStart());
        const response = await this.axiosPrivate.get(
          `api/Dashboard/tnx/graph/${merchantCode}?env=${env}&interval=${interval}`,
        );
        const data = response.data.ResponseData;
        dispatch(graphSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(graphFailure('No response from server'));
        } else {
            dispatch(graphFailure('Failed to load data. Try again.'));
        }
  }
    }

    
  
    async fetchtransactions(merchantCode, env, dispatch) {
      dispatch(transactionStart());
    try {
      // Use the unified deep-search endpoint (GET) with query params
      const params = new URLSearchParams({
        pageNumber: '1',
        pageSize: '5',
        env: env,
        status: 'Successful'
      }).toString();

      const response = await this.axiosPrivate.get(
        `api/Transaction/deep-search/${merchantCode}?${params}`
      );

      const data = response.data;
      // API returns data in different shapes; normalize to data.data when available
      dispatch(transactionSuccess(data.data || data.responseData || data));
      // dispatch(transactionSecondSuccess(data));
    } catch (err) {
      if (!err.response) {
          dispatch(transactionFailure('No response from server'));
      } else {
          dispatch(transactionFailure('Failed to load Customer transactions. Try again.'));
      }
  }
  }
  }
  
  export default DashboardService;
  