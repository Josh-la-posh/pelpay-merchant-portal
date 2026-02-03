import { settlementConfigurationDetailFailure, settlementConfigurationDetailStart, settlementConfigurationFailure, settlementConfigurationStart, settlementFailure, settlementStart, settlementSuccess, settlementTransactionFailure, settlementTransactionStart, settlementTransactionSuccess } from "@/redux/slices/settlementSlice";
import { toast } from "react-toastify";
import { saveAs } from "file-saver";
class SettlementService {
    constructor(axiosPrivate) {
      this.axiosPrivate = axiosPrivate;
    }
    buildQuery(merchantCode, pageNumber, pageSize, env) {
      const params = new URLSearchParams();

      if (pageNumber) params.set('pageNumber', pageNumber);
      if (pageSize) params.set('pageSize', pageSize);
      if (env) params.set('env', env);

      return `api/Settlement/batch/bymerchantCode/${merchantCode}?${params.toString()}`;
    }

    // settlement
  
    async fetchSettlement(merchantCode, pageNumber, pageSize, env, dispatch) {
        dispatch(settlementStart());
      try {
        
        // const response = await this.axiosPrivate.get(
        //   `api/Settlement/batch/bymerchantCode/${merchantCode}?pageNumber=${pageNumber}&pageSize=${pageSize}&env=${env}`,
        //   // `api/Settlement/batches/${merchantCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        // );
        const url = this.buildQuery(merchantCode, pageNumber, pageSize, env);
        const response = await this.axiosPrivate.get(url);
        const data = response.data.responseData;
        dispatch(settlementSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(settlementFailure('No response from servers'));
        } else {
            dispatch(settlementFailure('Failed to load settlement data. Try again.'));
        }
  }
    }
  
    async getSettlementBatchTransaction(pageNumber, pageSize,  id, env, formData, dispatch) {
        dispatch(settlementTransactionStart());
      try {  
        const response = await this.axiosPrivate.post(
          `api/Settlement/batch/${id}?pageNumber=${pageNumber}&pageSize=${pageSize}&env=${env}`,
          JSON.stringify(formData),
          {
            headers: { "Content-Type": "application/json" } 
          }
        );
        const data = response.data.responseData;
        dispatch(settlementTransactionSuccess(data));
      } catch (err) {
          if (!err.response) {
              dispatch(settlementTransactionFailure('No response from server'));
          } else {
              dispatch(settlementTransactionFailure('Failed to load settlement data. Try again.'));
          }
        }
    }

    async downloadSettlementBatchTransaction(pageNumber, pageSize, id, env, formData){
      try{
        const response = await this.axiosPrivate.post(
          `/api/Settlement/download_batch/${id}?pageNumber=${pageNumber}&pageSize=${pageSize}&env=${env}`,
          JSON.stringify(formData),
          {
            headers: { "Content-Type": "application/json", "Accept": "application/pdf" },
            responseType: "blob"
          }
        );
        if (!response.data) throw new Error('No data received from the server.');
        const fileBlob = new Blob([response.data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const fileName = `BatchSettlementTransaction_${Date.now()}.csv`;
            saveAs(fileBlob, fileName);
            toast('BatchSettlement downloaded successfully');
      }
      catch (err){
        if (!err.response) {
          toast('No response from server');
        } else {
          toast('Failed to download transactions data. Try again.');
        }
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
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationFailure('Failed to create settlement data. Try again.'));
        }
  }
    }
  
    async updateSettlementConfiguration(id, data, dispatch) {
        dispatch(settlementConfigurationStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/SettlementConfiguration/${id}`,
          JSON.stringify({data})
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationFailure('Failed to update settlement data. Try again.'));
        }
  }
    }
  
    async fetchSettlementConfigurationById(id, dispatch) {
        dispatch(settlementConfigurationStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/SettlementConfiguration/${id}`,
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationFailure('Failed to load settlement data. Try again.'));
        }
  }
    }
  
    async fetchSettlementConfigurationBySettlementCode(settlementCode, dispatch) {
        dispatch(settlementConfigurationStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/SettlementConfiguration/bycode/${settlementCode}`,
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationFailure('Failed to load settlement data. Try again.'));
        }
  }
    }
  
    async fetchSettlementConfiguration(merchantCode, pageNumber, pageSize, dispatch) {
        dispatch(settlementConfigurationStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Settlement/${merchantCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`,
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationFailure('Failed to load settlement data. Try again.'));
        }
  }
    }

    // settlement configuration detail
  
    async fetchSettlementConfigurationDetail(configId, dispatch) {
        dispatch(settlementConfigurationDetailStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/SettlementConfiguration/${configId}/details`,
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationDetailFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationDetailFailure('Failed to load settlement configuration detail data. Try again.'));
        }
  }
    }
  
    async createSettlementConfigurationDetail(configId, merchantCode, data, dispatch) {
        dispatch(settlementConfigurationDetailStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/SettlementConfiguration/${configId}/details?merchantCode=${merchantCode}`,
          JSON.stringify({data})
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationDetailFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationDetailFailure('Failed to create settlement configuration detail data. Try again.'));
        }
  }
    }
  
    async updateSettlementConfigurationDetail(detailId, data, dispatch) {
        dispatch(settlementConfigurationDetailStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/SettlementConfiguration/details/${detailId}`,
          JSON.stringify({data})
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationDetailFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationDetailFailure('Failed to update settlement configuration detail data. Try again.'));
        }
  }
    }
  
    async activateSettlementConfigurationDetail(detailId, data, dispatch) {
        dispatch(settlementConfigurationDetailStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/SettlementConfiguration/activate/${detailId}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationDetailFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationDetailFailure('Failed to activate settlement configuration detail data. Try again.'));
        }
  }
    }
  
    async deactivateSettlementConfigurationDetail(detailId, data, dispatch) {
        dispatch(settlementConfigurationDetailStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/SettlementConfiguration/deactivate/${detailId}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(settlementConfigurationDetailFailure('No response from server'));
        } else {
            dispatch(settlementConfigurationDetailFailure('Failed to deactivate settlement configuration detail data. Try again.'));
        }
  }
    }
  }
  
  export default SettlementService;
  