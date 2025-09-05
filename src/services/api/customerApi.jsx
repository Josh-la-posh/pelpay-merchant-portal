import { customerFailure, customerStart, customerSuccess } from "@/redux/slices/customerSlice";

class CustomerService {
    constructor(axiosPrivate, auth) {
      this.axiosPrivate = axiosPrivate;
      this.auth = auth;
    }
  
    async fetchAllCustomer(merchantCode, pageNumber, pageSize, dispatch) {
        dispatch(customerStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Customer/paginated/${pageNumber}/${pageSize}?merchantCode=${merchantCode}`,
        );
        const data = response.data.data;
        
        dispatch(customerSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(customerFailure('No response from server'));
        } else {
            dispatch(customerFailure('Failed to load Customer data. Try again.'));
        }
  }
    }
  
    async fetchCustomerByEmail(merchantCode, customerEmail, dispatch) {
        dispatch(customerStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Customer/paginated/${customerEmail}?merchantCode=${merchantCode}`,
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(customerFailure('No response from server'));
        } else {
            dispatch(customerFailure('Failed to load Customer data. Try again.'));
        }
  }
    }
  
    async fetchCustomerById(merchantCode, customerId, dispatch) {
        dispatch(customerStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Customer/paginated/${customerId}?merchantCode=${merchantCode}`,
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(customerFailure('No response from server'));
        } else {
            dispatch(customerFailure('Failed to load Customer data. Try again.'));
        }
  }
    }
  }
  
  export default CustomerService;
  