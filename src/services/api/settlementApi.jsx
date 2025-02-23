import { settlementConfigurationDetailFailure, settlementConfigurationDetailStart, settlementConfigurationFailure, settlementConfigurationStart, settlementFailure, settlementStart, settlementSuccess, settlementTransactionFailure, settlementTransactionStart, settlementTransactionSuccess } from "@/redux/slices/settlementSlice";

class SettlementService {
    constructor(axiosPrivate) {
      this.axiosPrivate = axiosPrivate;
    }

    // settlement
  
    async fetchSettlement(merchantCode, pageNumber, pageSize, dispatch) {
        dispatch(settlementStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Settlement/batches/${merchantCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        );
        const data = response.data.data;
        dispatch(settlementSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(settlementFailure('No response from server'));
        } else {
            dispatch(settlementFailure('Failed to load settlement data. Try again.'));
        }
      } finally {
      }
    }
  
    async getSettlementBatchTransaction(merchantCode, pageNumber, pageSize, id, dispatch) {
        dispatch(settlementTransactionStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/Settlement/batch/${id}/transactions?merchantCode=${merchantCode}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
          JSON.stringify({merchantCode})
        );
        const data = response.data.data;
        dispatch(settlementTransactionSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(settlementTransactionFailure('No response from server'));
        } else {
            dispatch(settlementTransactionFailure('Failed to load settlement data. Try again.'));
        }
      } finally {
      }
    }

    // settlement configuration
  
    async createSettlementConfiguration(merchantCode, data, dispatch) {
        dispatch(settlementConfigurationStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/SettlementConfiguration/${merchantCode}`,
          JSON.stringify({data})
        );
        console.log('Settlement data created successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationFailure('Failed to create settlement data. Try again.'));
        }
      } finally {
      }
    }
  
    async updateSettlementConfiguration(id, data, dispatch) {
        dispatch(settlementConfigurationStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/SettlementConfiguration/${id}`,
          JSON.stringify({data})
        );
        console.log('settlement data updated ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationFailure('Failed to update settlement data. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchSettlementConfigurationById(id, dispatch) {
        dispatch(settlementConfigurationStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/SettlementConfiguration/${id}`,
        );
        console.log('This is the settlement data ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationFailure('Failed to load settlement data. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchSettlementConfigurationBySettlementCode(settlementCode, dispatch) {
        dispatch(settlementConfigurationStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/SettlementConfiguration/bycode/${settlementCode}`,
        );
        console.log('This is the settlement data ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationFailure('Failed to load settlement data. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchSettlementConfiguration(merchantCode, pageNumber, pageSize, dispatch) {
        dispatch(settlementConfigurationStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Settlement/${merchantCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        );
        console.log('This is the settlement data ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationFailure('Failed to load settlement data. Try again.'));
        }
      } finally {
      }
    }

    // settlement configuration detail
  
    async fetchSettlementConfigurationDetail(configId, dispatch) {
        dispatch(settlementConfigurationDetailStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/SettlementConfiguration/${configId}/details`,
        );
        console.log('This is the settlement detail data ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationDetailFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationDetailFailure('Failed to load settlement configuration detail data. Try again.'));
        }
      } finally {
      }
    }
  
    async createSettlementConfigurationDetail(configId, merchantCode, data, dispatch) {
        dispatch(settlementConfigurationDetailStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/SettlementConfiguration/${configId}/details?merchantCode=${merchantCode}`,
          JSON.stringify({data})
        );
        console.log('settlement detail data created ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationDetailFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationDetailFailure('Failed to create settlement configuration detail data. Try again.'));
        }
      } finally {
      }
    }
  
    async updateSettlementConfigurationDetail(detailId, data, dispatch) {
        dispatch(settlementConfigurationDetailStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/SettlementConfiguration/details/${detailId}`,
          JSON.stringify({data})
        );
        console.log('settlement detail data updated ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationDetailFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationDetailFailure('Failed to update settlement configuration detail data. Try again.'));
        }
      } finally {
      }
    }
  
    async activateSettlementConfigurationDetail(detailId, data, dispatch) {
        dispatch(settlementConfigurationDetailStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/SettlementConfiguration/activate/${detailId}`
        );
        console.log('settlement detail data activated ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationDetailFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationDetailFailure('Failed to activate settlement configuration detail data. Try again.'));
        }
      } finally {
      }
    }
  
    async deactivateSettlementConfigurationDetail(detailId, data, dispatch) {
        dispatch(settlementConfigurationDetailStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/SettlementConfiguration/deactivate/${detailId}`
        );
        console.log('settlement detail data deactivated ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationDetailFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationDetailFailure('Failed to deactivate settlement configuration detail data. Try again.'));
        }
      } finally {
      }
    }
  }
  
  export default SettlementService;
  