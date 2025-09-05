import { aggregatorBankFailure, aggregatorBankStart, aggregatorDocumentFailure, aggregatorDocumentStart, aggregatorFailure, aggregatorMerchantFailure, aggregatorMerchantStart, aggregatorMerchantSuccess, aggregatorStart, aggregatorSuccess } from "@/redux/slices/aggregatorSlice";

class AggregatorService {
    constructor(axiosPrivate) {
      this.axiosPrivate = axiosPrivate;
    }

    // fetch aggregator
  
    async fetchAggregator(dispatch) {
        dispatch(aggregatorStart());
      try {
        const response = await this.axiosPrivate.get(
          'api/Aggregator',
        );
        const data = response.data.responseData;
        dispatch(aggregatorSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorFailure('No response from server'));
        } else {
            dispatch(aggregatorFailure('Failed to load data. Try again.'));
        }
  }
    }

    // fetch aggregator merchants
  
    async fetchAggregatorMerchants(dispatch) {
        dispatch(aggregatorMerchantStart());
      try {
        const response = await this.axiosPrivate.get(
          'api/Aggregator/merchants',
        );
        const data = response.data.responseData;
        dispatch(aggregatorMerchantSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorMerchantFailure('No response from server'));
        } else {
            dispatch(aggregatorMerchantFailure('Failed to load data. Try again.'));
        }
  }
    }

    // update aggregator
  
    async updateAggregator(dispatch, data) {
        dispatch(aggregatorStart());
      try {
        const response = await this.axiosPrivate.put(
          'api/Aggregator',
          JSON.stringify({data})
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorFailure('No response from server'));
        } else {
            dispatch(aggregatorFailure('Failed to load Customer data. Try again.'));
        }
  }
    }

    // aggregator bank

    // fetch aggregator bank
  
    async fetchAggregatorBank(dispatch) {
        dispatch(aggregatorBankStart());
      try {
        const response = await this.axiosPrivate.get(
          'api/AggregatorBank',
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorBankFailure('No response from server'));
        } else {
            dispatch(aggregatorBankFailure('Failed to load data. Try again.'));
        }
  }
    }

    // fetch aggregator bank by id
  
    async fetchAggregatorBankById(dispatch, id) {
        dispatch(aggregatorBankStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/AggregatorBank/${id}`,
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorBankFailure('No response from server'));
        } else {
            dispatch(aggregatorBankFailure('Failed to load data. Try again.'));
        }
  }
    }

    // add aggregator bank
  
    async addAggregatorBankById(dispatch) {
        dispatch(aggregatorBankStart());
      try {
        const response = await this.axiosPrivate.post(
          'api/AggregatorBank',
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorBankFailure('No response from server'));
        } else {
            dispatch(aggregatorBankFailure('Failed to load data. Try again.'));
        }
  }
    }

    // update aggregator bank by id
  
    async updateAggregatorBankById(dispatch, id, data) {
        dispatch(aggregatorBankStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/AggregatorBank/${id}`,
          JSON.stringify({data})
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorBankFailure('No response from server'));
        } else {
            dispatch(aggregatorBankFailure('Failed to load data. Try again.'));
        }
  }
    }

    // deactivate aggregator bank
  
    async deactivateAggregatorBankById(dispatch, id) {
        dispatch(aggregatorBankStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/AggregatorBank/deactivate/${id}`
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorBankFailure('No response from server'));
        } else {
            dispatch(aggregatorBankFailure('Failed to deactivate bank. Try again.'));
        }
  }
    }

    // activate aggregator bank
  
    async activateAggregatorBankById(dispatch, id) {
        dispatch(aggregatorBankStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/AggregatorBank/activate/${id}`
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorBankFailure('No response from server'));
        } else {
            dispatch(aggregatorBankFailure('Failed to activate bank. Try again.'));
        }
  }
    }

    // set aggregator bank as primary account
  
    async setAggregatorBankAsPrimary(data, dispatch, id) {
        dispatch(aggregatorBankStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/AggregatorBank/set-primary-account/${id}`,
          JSON.stringify({data})
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorBankFailure('No response from server'));
        } else {
            dispatch(aggregatorBankFailure('Failed to set as primary account. Try again.'));
        }
  }
    }


    // aggregator documents

    // fetch aggregator document type
  
    async fetchAggregatorDocumentTypes(dispatch) {
        dispatch(aggregatorDocumentStart());
      try {
        const response = await this.axiosPrivate.get(
          'api/AggregatorDocuments/document-types',
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorDocumentFailure('No response from server'));
        } else {
            dispatch(aggregatorDocumentFailure('Failed to load data. Try again.'));
        }
  }
    }

    // fetch aggregator document
  
    async fetchAggregatorDocuments(dispatch) {
        dispatch(aggregatorDocumentStart());
      try {
        const response = await this.axiosPrivate.get(
          'api/AggregatorDocuments',
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorDocumentFailure('No response from server'));
        } else {
            dispatch(aggregatorDocumentFailure('Failed to load data. Try again.'));
        }
  }
    }

    // download aggregator document
  
    async downloadAggregatorDocuments(dispatch, id) {
        dispatch(aggregatorDocumentStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/AggregatorDocuments/download/${id}`,
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorDocumentFailure('No response from server'));
        } else {
            dispatch(aggregatorDocumentFailure('Failed to download data. Try again.'));
        }
  }
    }

    // post aggregator document
  
    async postAggregatorDocuments(dispatch, documentId, data) {
        dispatch(aggregatorDocumentStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/AggregatorDocuments/document/${documentId}`,
          JSON.stringify({data})
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorDocumentFailure('No response from server'));
        } else {
            dispatch(aggregatorDocumentFailure('Failed to download data. Try again.'));
        }
  }
    }
  }
  
  export default AggregatorService;