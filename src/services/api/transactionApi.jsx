import { toast } from "react-toastify";
import { transactionFailure, transactionStart, transactionSuccess } from "@/redux/slices/transactionSlice";
import { saveAs } from "file-saver";
import { transactionSecondSuccess } from "../../redux/slices/transactionSlice";

class TransactionService {
    constructor(axiosPrivate, auth) {
      this.axiosPrivate = axiosPrivate;
      this.auth = auth;
    }
  
    async downloadTransactionReceipt(
      merchantCode,
      pageNumber,
      pageSize,
      env,
      sDate,
      eDate,
      status,
      sessionId,
      accountNumber,
      transactionReference,

    ) {

      try {
        const response = await this.axiosPrivate.post(
          `api/Transaction/search/download?merchantCode=${merchantCode}&pageNumber=${pageNumber}&pageSize=${pageSize}&env=${env}`,
          {
            "transactionReference": transactionReference,
            "accountNumber": accountNumber,
            "sessionId": sessionId,
            "sDate": sDate ?? '',
            "eDate": eDate ?? '',
            "status": status.toLowerCase() === 'all' ? '' : status.toLowerCase()
          },
          {
            responseType: 'arraybuffer'
          }
        );
        if (!response.data) {
          throw new Error('No data received from the server.');
        }
        
        // const decryptData = (data) => {
        //   const res = new TextDecoder().decode(data);
        //   return res;
        // }

        // const encryptedData = new Uint8Array(response.data);
        // const decryptedData = decryptData(encryptedData);
        const fileBlob = new Blob([response.data], {type: 'application/xlsx'});

        const fileName = `Pelpay_transactions_${Date.now()}.xlsx`;
        saveAs(fileBlob, fileName);
        
        toast('Transations downloaded successfully');
      } catch (err) {
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to download transactions data. Try again.');
        }
      } finally {
      }
    }
  
    async fetchtransactionsByPaymentReference(merchantCode, paymentReference, env, dispatch) {
        dispatch(transactionStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Transaction/bypayemtreference/${paymentReference}?merchantCode=${merchantCode}&env=${env}`
        );
        const data = response.data;
        dispatch(transactionSuccess(data.responseData));
        dispatch(transactionSecondSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(transactionFailure('No response from server'));
        } else {
            dispatch(transactionFailure('Failed to load Customer transactions. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchtransactionsByDate(merchantCode, startDate, endDate, pageNumber, pageSize, env, dispatch) {
        dispatch(transactionStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Transaction/bydate/${startDate}/${endDate}?merchantCode=${merchantCode}&pageNumber=${pageNumber}&pageSize=${pageSize}&env=${env}`
        );
        const data = response.data;
        dispatch(transactionSuccess(data.data));
        dispatch(transactionSecondSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(transactionFailure('No response from server'));
        } else {
            dispatch(transactionFailure('Failed to load Customer transactions. Try again.'));
        }
      } finally {
      }
    }
  
    async searchTransaction(merchantCode, pageNumber, pageSize, env, formData, dispatch) {
        dispatch(transactionStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/Transaction/search?merchantCode=${merchantCode}&pageNumber=${pageNumber}&pageSize=${pageSize}&env=${env}`,
          JSON.stringify(formData)
        );
        const data = response.data;
        dispatch(transactionSuccess(data.data));
        dispatch(transactionSecondSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(transactionFailure('No response from server'));
        } else {
            dispatch(transactionFailure('Failed to create transaction. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchtransactionsByCustomerEmail(merchantCode, customerEmail, dispatch) {
        dispatch(transactionStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Transaction/bycustomeremail/${customerEmail}?merchantCode=${merchantCode}`
        );
        const data = response.data;
        dispatch(transactionSuccess(data.data));
        dispatch(transactionSecondSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(transactionFailure('No response from server'));
        } else {
            dispatch(transactionFailure('Failed to load Customer transactions. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchtransactions(merchantCode, env, pageNumber, pageSize, dispatch) {
        dispatch(transactionStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Transaction/paginated/${pageNumber}/${pageSize}?merchantCode=${merchantCode}&env=${env}`
        );
        const data = response.data;
        dispatch(transactionSuccess(data.data));
        dispatch(transactionSecondSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(transactionFailure('No response from server'));
        } else {
            dispatch(transactionFailure('Failed to load Customer transactions. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchTransactionReceipt(transactionId) {

      const getFileExtention = (data) => {
        const type = {
          'image/png': '.png',
          'application/pdf': '.pdf'
        }
        return type[data];
      }

      try {
        const response = await this.axiosPrivate.get(
          `api/Transaction/receipt/${transactionId}`,
          {
            responseType: 'blob'
          }
        );

        const contentTYpe = response.headers['content-type'];
        const fileExt = getFileExtention(contentTYpe);

        if (!response.data) {
          throw new Error('No data received from the server.');
        }

        const fileName = `Pelpay_transaction_receipt_${Date.now()}${fileExt}`;

        saveAs(response.data, fileName);

        toast('Transaction receipt downloaded successfully');
      } catch (err) {
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to download transaction receipt. Try again.');
        }
      } finally {
      }
    }
  }
  
  export default TransactionService;