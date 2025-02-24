import { invoiceFailure, invoiceStart, invoiceSuccess } from "@/redux/slices/invoiceSlice";

class InvoiceService {
    constructor(axiosPrivate, auth) {
      this.axiosPrivate = axiosPrivate;
      this.auth = auth;
    }
  
    async postInvoice(merchantCode, data, dispatch) {
        dispatch(invoiceStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/Invoices/${merchantCode}`,
          JSON.stringify({data})
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(invoiceFailure('No response from server'));
        } else {
            dispatch(invoiceFailure('Failed to create invoice. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchInvoices(merchantCode, pageNumber, pageSize, dispatch) {
        dispatch(invoiceStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Invoice?merchantCode=${merchantCode}&pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        const data = response.data.responseData.data;
        
        dispatch(invoiceSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(invoiceFailure('No response from server'));
        } else {
            dispatch(invoiceFailure('Failed to load Customer invoices. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchInvoiceByInvoiceNumber(merchantCode, invoiceNumber, dispatch) {
        dispatch(invoiceStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Invoice/${invoiceNumber}?merchantCode=${merchantCode}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(invoiceFailure('No response from server'));
        } else {
            dispatch(invoiceFailure('Failed to load Customer invoices. Try again.'));
        }
      } finally {
      }
    }
  
    async deleteInvoice(merchantCode, invoiceNumber, dispatch) {
        dispatch(invoiceStart());
      try {
        const response = await this.axiosPrivate.delete(
          `api/Invoice/cancel/${invoiceNumber}?merchantCode=${merchantCode}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(invoiceFailure('No response from server'));
        } else {
            dispatch(invoiceFailure('Failed to delete Customer invoices. Try again.'));
        }
      } finally {
      }
    }
  }
  
  export default InvoiceService;