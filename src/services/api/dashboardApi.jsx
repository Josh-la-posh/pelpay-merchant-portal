import { graphFailure, graphStart, graphSuccess, lumpsumFailure, lumpsumStart, lumpsumSuccess } from "@/redux/slices/dashboardSlice";

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
        const data = response.data.responseData;
        dispatch(lumpsumSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(lumpsumFailure('No response from server'));
        } else {
            dispatch(lumpsumFailure('Failed to load dashboard data. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchGraph(merchantCode, interval, dispatch) {
      try {
        dispatch(graphStart());
        const response = await this.axiosPrivate.get(
          `api/Dashboard/tnx/graph/${merchantCode}?interval=${interval}`,
        );
        const data = response.data.responseData;
        dispatch(graphSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(graphFailure('No response from server'));
        } else {
            dispatch(graphFailure('Failed to load data. Try again.'));
        }
      } finally {
      }
    }
  }
  
  export default DashboardService;
  