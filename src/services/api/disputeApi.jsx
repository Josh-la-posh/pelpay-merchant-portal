import { disputeFailure, disputeStart, disputeSuccess } from "@/redux/slices/disputeSlice";

class DisputeService {
    constructor(axiosPrivate, auth) {
      this.axiosPrivate = axiosPrivate;
      this.auth = auth;
    }
  
    async fetchDisputes(merchantCode, pageNumber, pageSize, env, dispatch) {
        dispatch(disputeStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Disputes/${merchantCode}/?pageNumber=${pageNumber}&pageSize=${pageSize}&env=${env}`,
        );
        const data = response.data.data;
        dispatch(disputeSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(disputeFailure('No response from server'));
        } else {
            dispatch(disputeFailure('Failed to load Customer data. Try again.'));
        }
      } finally {
      }
    }
  
    async searchDisputes(merchantCode, pageNumber, pageSize, env, dispatch, transactionReference, sDate, eDate, status, customerEmail, disputeStatus) {
        dispatch(disputeStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/Disputes/search/${merchantCode}/?pageNumber=${pageNumber}&pageSize=${pageSize}&env=${env}`,
          JSON.stringify({
            transactionReference, sDate, eDate, status, customerEmail, disputeStatus
          })
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(disputeFailure('No response from server'));
        } else {
            dispatch(disputeFailure('Failed to load Customer data. Try again.'));
        }
      } finally {
      }
    }
  
    async approveDisputes(merchantCode, comment, disputeId, dispatch) {
        dispatch(disputeStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/Disputes/approve/${merchantCode}`,
          JSON.stringify({
            comment, disputeId
          })
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(disputeFailure('No response from server'));
        } else {
            dispatch(disputeFailure('Failed to load Customer data. Try again.'));
        }
      } finally {
      }
    }
  
    async declineDisputes(merchantCode, comment, disputeId, dispatch) {
        dispatch(disputeStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/Disputes/decline/${merchantCode}`,
          JSON.stringify({
            comment, disputeId
          })
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(disputeFailure('No response from server'));
        } else {
            dispatch(disputeFailure('Failed to load Customer data. Try again.'));
        }
      } finally {
      }
    }
  }
  
  export default DisputeService;