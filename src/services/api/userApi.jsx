import { toast } from "react-toastify";
import { aggregatorUserFailure, aggregatorUserStart, aggregatorUserSuccess, newUserFailure, newUserStart, newUserSuccess, usersFailure, usersStart, usersSuccess } from "@/redux/slices/userSlice";

class userService {
    constructor(axiosPrivate, auth, setAuth) {
      this.axiosPrivate = axiosPrivate;
      this.auth = auth;
      this.setAuth = setAuth;
    }
  
    async createUser(merchantCode, data, dispatch) {
        dispatch(usersStart());
      try {
        await this.axiosPrivate.post(
          `api/Users/createuser/${merchantCode}`,
          JSON.stringify({data})
        );
        
      } catch (err) {
        if (!err.response) {
            dispatch(usersFailure('No response from server'));
        } else {
            dispatch(usersFailure('Failed to create user. Try again.'));
        }
  console.error('createUser error:', err);
      }
    }
  
    async fetchUsersByMerchantCode(merchantCode, pageNumber, pageSize, dispatch) {
        dispatch(usersStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Users/bymerchant/${merchantCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`
        );
        const data = response.data.responseData.data;
        dispatch(usersSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(usersFailure('No response from server'));
        } else {
            dispatch(usersFailure('Failed to load users. Try again.'));
        }
  console.error('fetchUsersByMerchantCode error:', err);
      }
    }
  
    async fetchUsersMerchantByAggregatorCode(aggregatorCode, pageNumber, pageSize, dispatch) {
        dispatch(aggregatorUserStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Users/merchant/${aggregatorCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`
        );
        const data = response.data.responseData;
        dispatch(aggregatorUserSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorUserFailure('No response from server'));
        } else {
            dispatch(aggregatorUserFailure('Failed to load users. Try again.'));
        }
  console.error('fetchUsersMerchantByAggregatorCode error:', err);
      }
    }
  
    async fetchUserMerchantByAggregatorCode(userId, aggregatorCode, pageNumber, pageSize, dispatch) {
        dispatch(usersStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Users/${userId}/merchant/${aggregatorCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(usersFailure('No response from server'));
        } else {
            dispatch(usersFailure('Failed to load users. Try again.'));
        }
  console.error('fetchUserMerchantByAggregatorCode error:', err);
      }
    }
  
    async fetchUserByAggregatorCode(aggregatorCode, pageNumber, pageSize, dispatch) {
        dispatch(aggregatorUserStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Users/byaggregator/${aggregatorCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`
        );
        const data = response.data.responseData;
        dispatch(aggregatorUserSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorUserFailure('No response from server'));
        } else {
            dispatch(aggregatorUserFailure('Failed to load users. Try again.'));
        }
  console.error('fetchUserByAggregatorCode error:', err);
      }
    }
  
    async fetchUserProfile(merchantCode, dispatch) {
        dispatch(newUserStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Users/profile?merchantCode=${merchantCode}`
        );
        const data = response.data.responseData;
        dispatch(newUserSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(newUserFailure('No response from server'));
        } else {
            dispatch(newUserFailure('Failed to load users. Try again.'));
        }
  console.error('fetchUserProfile error:', err);
      }
    }
  
    async updateUserData(userId, formData, dispatch) {
        dispatch(newUserStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/Users/${userId}`,
          JSON.stringify(formData)
        );
        const data = response.data.responseData;
        dispatch(newUserSuccess(data));
        toast('Profile updated successfully');
      } catch (err) {
        if (!err.response) {
            dispatch(newUserFailure('No response from server'));
        } else {
            dispatch(newUserFailure('Failed to update user data. Try again.'));
        }
  console.error('updateUserData error:', err);
      }
    }
  
    async activateUser(userId, merchantCode, aggregatorCode, dispatch) {
        dispatch(usersStart());
      try {
        await this.axiosPrivate.put(
          `api/Users/activate`,
          JSON.stringify({userId, merchantCode})
        );
        toast('User data has been activated');
        await this.fetchUserByAggregatorCode(aggregatorCode, 1, 40, dispatch);
      } catch (err) {
        if (!err.response) {
            dispatch(usersFailure('No response from server'));
        } else {
            dispatch(usersFailure('Failed to activate user. Try again.'));
        }
  console.error('activateUser error:', err);
      }
    }
  
    async deactivateUser(userId, merchantCode, aggregatorCode, dispatch) {
        dispatch(usersStart());
      try {
        await this.axiosPrivate.put(
          `api/Users/deactivate`,
          JSON.stringify({userId, merchantCode})
        );
        toast('User data has been deactivated');
        await this.fetchUserByAggregatorCode(aggregatorCode, 1, 40, dispatch);
      } catch (err) {
        if (!err.response) {
            dispatch(usersFailure('No response from server'));
        } else {
            dispatch(usersFailure('Failed to deactivate user data. Try again.'));
        }
  console.error('deactivateUser error:', err);
      }
    }
  }
  
  export default userService;