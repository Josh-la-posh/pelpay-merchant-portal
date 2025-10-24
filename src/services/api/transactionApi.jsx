import { toast } from "react-toastify";
import { transactionFailure, transactionStart, transactionSuccess } from "@/redux/slices/transactionSlice";
import { saveAs } from "file-saver";
import { transactionSecondSuccess } from "../../redux/slices/transactionSlice";

class TransactionService {
  constructor(axiosPrivate, auth) {
    this.axiosPrivate = axiosPrivate;
    this.auth = auth;
  }

  buildQuery(merchantCode, env, pageNumber, pageSize, filters = {}) {
    const params = new URLSearchParams();
    if (pageNumber) params.set('pageNumber', pageNumber);
    if (pageSize) params.set('pageSize', pageSize);
    if (env) params.set('env', env);

    const mapping = [
      'startDate',
      'endDate',
      'paymentReference',
      'transactionId',
      'accountNumber',
      'sessionId',
      'customerEmail',
      'status'
    ];
    mapping.forEach(key => {
      const v = filters[key];
      if (v !== undefined && v !== null && v !== '') params.set(key, v);
    });
    return `api/Transaction/deep-search/${merchantCode}?${params.toString()}`;
  }

  async fetchtransactions(merchantCode, env, filters, pageNumber, pageSize, dispatch) {
    dispatch(transactionStart());
    try {
      const url = this.buildQuery(merchantCode, env, pageNumber, pageSize, filters);
      const response = await this.axiosPrivate.get(url);
      const data = response.data;
      dispatch(transactionSuccess(data.data || data.responseData || data));
      dispatch(transactionSecondSuccess(data));
    } catch (err) {
      if (!err.response) {
        dispatch(transactionFailure('No response from server'));
      } else {
        dispatch(transactionFailure('Failed to load Customer transactions. Try again.'));
      }
      console.error('fetchtransactions error:', err);
    }
  }

  // async downloadTransactionReceipt(
  //   merchantCode,
  //   pageNumber,
  //   pageSize,
  //   env,
  //   sDate,
  //   eDate,
  //   status,
  //   sessionId,
  //   accountNumber,
  //   transactionReference,
  // ) {
  //   try {
  //     const response = await this.axiosPrivate.post(
  //       `api/Transaction/deep-search/${merchantCode}/download?pageNumber=${pageNumber}&pageSize=${pageSize}&env=${env}`,
  //       {
  //         transactionReference,
  //         accountNumber,
  //         sessionId,
  //         sDate: sDate ?? '',
  //         eDate: eDate ?? '',
  //         status: (status || '').toLowerCase() === 'all' ? '' : (status || '')
  //       },
  //       { responseType: 'arraybuffer' }
  //     );
  //     if (!response.data) throw new Error('No data received from the server.');
  //     const fileBlob = new Blob([response.data], { type: 'application/xlsx' });
  //     const fileName = `Pelpay_transactions_${Date.now()}.xlsx`;
  //     saveAs(fileBlob, fileName);
  //     toast('Transations downloaded successfully');
  //   } catch (err) {
  //     if (!err.response) {
  //       toast('No response from server');
  //     } else {
  //       toast('Failed to download transactions data. Try again.');
  //     }
  //     console.error('downloadTransactionReceipt error:', err);
  //   }
  // }
  async downloadTransactionReceipt(merchantCode, env) {
  try {
    const response = await this.axiosPrivate.get(
      `/api/Transaction/search/download?env=${env}&merchantCode=${merchantCode}`,
      {  contentType: 'text/csv', responseType: 'blob' }
    );
    if (!response.data) throw new Error('No data received from the server.');

    const fileBlob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const fileName = `Pelpay_transactions_${Date.now()}.csv`;
    saveAs(fileBlob, fileName);
    toast('Transactions downloaded successfully');
  } catch (err) {
    if (!err.response) {
      toast('No response from server');
    } else {
      toast('Failed to download transactions data. Try again.');
    }
    // console.error('downloadTransactionReceipt error:', err);
  }
}


  async fetchTransactionReceipt(transactionId) {
    const getFileExtention = (data) => {
      const type = { 'image/png': '.png', 'application/pdf': '.pdf' };
      return type[data];
    };
    try {
      const response = await this.axiosPrivate.get(
        `api/Transaction/receipt/${transactionId}`,
        { responseType: 'blob' }
      );
      const contentType = response.headers['content-type'];
      const fileExt = getFileExtention(contentType);
      if (!response.data) throw new Error('No data received from the server.');
      const fileName = `Pelpay_transaction_receipt_${Date.now()}${fileExt}`;
      saveAs(response.data, fileName);
      toast('Transaction receipt downloaded successfully');
    } catch (err) {
      if (!err.response) {
        toast('No response from server');
      } else {
        toast('Failed to download transaction receipt. Try again.');
      }
      console.error('fetchTransactionReceipt error:', err);
    }
  }
}
  
  export default TransactionService;