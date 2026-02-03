import { toast } from "react-toastify";
import { aggregatorMerchantFailure, aggregatorMerchantStart, aggregatorMerchantSuccess } from "@/redux/slices/aggregatorSlice";
import { merchantAccountFailure, merchantAccountStart, merchantAccountSuccess, merchantAddressFailure, merchantAddressStart, merchantBusinessTypesSucess, merchantContactFailure, merchantContactStart, merchantContactSuccess, merchantCredentialsFailure, merchantCredentialsStart, merchantCredentialsSuccess, merchantDocumentFailure, merchantDocumentStart, merchantDocumentSuccess, merchantDocumentTypeFailure, merchantDocumentTypeStart, merchantDocumentTypeSuccess, merchantDomainFailure, merchantDomainStart, merchantDomainSuccess, merchantFailure, merchantProfileFailure, merchantProfileStart, merchantProfileSuccess, merchantRegistrationTypesSucess, merchantStart, merchantAdduserStart, merchantAdduserSuccess, merchantAdduserFailure, } from "@/redux/slices/merchantSlice";
import { saveAs } from "file-saver";

class MerchantService {
    constructor(axiosPrivate) {
      this.axiosPrivate = axiosPrivate;
    }

    // merchant document
  
    async fetchMerchantDocumentTypes(dispatch) {
        dispatch(merchantDocumentTypeStart());
      try {
        const response = await this.axiosPrivate.get(
          'api/MechantDocuments/document-types',
        );
        const data = response.data.responseData;
        dispatch(merchantDocumentTypeSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDocumentTypeFailure('No response from server'));
        } else {
            dispatch(merchantDocumentTypeFailure('Failed to fetch merchant data. Try again.'));
        }
      }
    }
  
    async createMerchantDocument(merchantCode, documentId, fileData, dispatch) {
        dispatch(merchantDocumentStart());
      try {
        await this.axiosPrivate.post(
          `api/MechantDocuments/${merchantCode}/document-type/${documentId}`,
          fileData
        );
        
        dispatch(merchantDocumentSuccess('Merchant document created successfully'));
        await this.fetchMerchantDocument(merchantCode, dispatch);
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDocumentFailure('No response from server'));
        } else {
            dispatch(merchantDocumentFailure('Failed to create merchant document. Try again.'));
        }
    
      }
    }
  
    async createMerchantDocumentType2(merchantCode, documentId, data, dispatch) {
        dispatch(merchantDocumentStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/MerchantDocuments/${merchantCode}/document-type_2/${documentId}`,
          JSON.stringify({data})
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDocumentFailure('No response from server'));
        } else {
            dispatch(merchantDocumentFailure('Failed to create merchant document. Try again.'));
        }
    
      }
    }
  
    async fetchMerchantDocument(merchantCode, dispatch) {
        dispatch(merchantDocumentStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MechantDocuments/${merchantCode}`,
        );
        const data = response.data.responseData;
        dispatch(merchantDocumentSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDocumentFailure('No response from server'));
        } else {
            dispatch(merchantDocumentFailure('Failed to fetch merchant data. Try again.'));
        }
    
      }
    }
  
    async downloadMerchantDocument(Id) {

      const getFileExtention = (data) => {
        const type = {
          'image/png': '.png',
          'application/pdf': '.pdf'
        }
        return type[data];
      }

      try {
        const response = await this.axiosPrivate.get(
          `api/MechantDocuments/download/${Id}`,
          {
            responseType: 'blob'
          }
        );

        const contentTYpe = response.headers['content-type'];
        const fileExt = getFileExtention(contentTYpe);


        if (!response.data) {
          throw new Error('No data received from the server.');
        }

        const fileName = `Pelpay_document${Date.now()}${fileExt}`;

        saveAs(response.data, fileName);

        toast('Merchant document downloaded successfully');
        
      } catch (err) {
        
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to fetch merchant data. Try again.');
        }
    
      }
    }
  
    async deleteMerchantDocument(documentId, merchantCode, dispatch) {
        dispatch(merchantDocumentStart());
      try {
    await this.axiosPrivate.delete(`api/MechantDocuments/${documentId}`);
    await this.fetchMerchantDocument(merchantCode, dispatch);
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDocumentFailure('No response from server'));
        } else {
            dispatch(merchantDocumentFailure('Failed to delete Merchant document. Try again.'));
        }
    
      }
    }

    // merchant
  
    async fetchMerchantCredentials(merchantCode, env, dispatch) {
        dispatch(merchantCredentialsStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Merchant/Credentials/${merchantCode}?env=${env}`
        );
        const data = response.data.responseData;

        dispatch(merchantCredentialsSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantCredentialsFailure('No response from server'));
        } else {
            dispatch(merchantCredentialsFailure('Failed to fetch merchant data. Try again.'));
        }
      }
    }
  
    async createMerchant(formData, dispatch) {
        dispatch(merchantStart());
      try {
        const response = await this.axiosPrivate.post(
          'api/Merchant/AddMerchant',
          JSON.stringify(formData),
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        toast.success('Merchant created successfully');
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantFailure('No response from server'));
        } else {
            dispatch(merchantFailure('Failed to create merchant. Try again.'));
        }
      }
    }
  
    async addUserMerchant(formData, dispatch) {
        dispatch(merchantAdduserStart());
      try {
        await this.axiosPrivate.post('api/Merchant/adduser', 
          JSON.stringify(formData),
        {
            headers: {
              "Content-Type": "application/json"
            }
          });
        toast.success('User added successfully');
      } catch (err) {
        if (!err.response) {
          dispatch(merchantAdduserFailure('No response from server'));
        } else {
          const errMsg = err.response.data.message;
          dispatch(merchantAdduserFailure(errMsg));
        }
    
      }
    }
  
    async searchMerchantAggregator(formData, aggregatorCode, dispatch) {
        // dispatch(aggregatorStart());
        dispatch(aggregatorMerchantStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/Merchant/search/${aggregatorCode}`,
          JSON.stringify(formData)
        );
        const data = response.data.responseData;
        
        // dispatch(aggregatorSuccess(data));
        dispatch(aggregatorMerchantSuccess(data));
      } catch (err) {
        if (!err.response) {
            // dispatch(aggregatorFailure('No response from server'));
            dispatch(aggregatorMerchantFailure('No response from server'));
        } else {
            // dispatch(aggregatorFailure('Failed to create merchant. Try again.'));
            dispatch(aggregatorMerchantFailure('Failed to create merchant. Try again.'));
        }
    
      }
    }
  
    async deleteMerchantUser(data, dispatch) {
        dispatch(merchantStart());
      try {
        const response = await this.axiosPrivate.delete(
          'api/Merchant/user',
          JSON.stringify({data})
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantFailure('No response from server'));
        } else {
            dispatch(merchantFailure('Failed to delete merchant. Try again.'));
        }
    
      }
    }
  
    async deleteMerchant(merchantId, dispatch) {
        dispatch(merchantStart());
      try {
        const response = await this.axiosPrivate.delete(
          `api/Merchant/${merchantId}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantFailure('No response from server'));
        } else {
            dispatch(merchantFailure('Failed to delete merchant. Try again.'));
        }
  }
    }

    // merchant account
  
    async createMerchantAccount(merchantCode, data, dispatch) {
        dispatch(merchantAccountStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/MerchantAccount/${merchantCode}`,
          JSON.stringify({data})
        );
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to create merchant account. Try again.'));
        }
    
      }
    }
  
    async updateMerchantAccount(Id, dispatch) {
        dispatch(merchantAccountStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/MerchantAccount/${Id}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to update merchant account. Try again.'));
        }
    
      }
    }
  
    async fetchMerchantAccount(Id, dispatch) {
        dispatch(merchantAccountStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantAccount/${Id}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to fetch merchant account. Try again.'));
        }
    
      }
    }
  
    async fetchMerchantAccountByAccountNumber(accountNumber, dispatch) {
        dispatch(merchantAccountStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantAccount/${accountNumber}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to fetch merchant account. Try again.'));
        }
    
      }
    }
  
    async fetchMerchantAccountByPage(merchantCode, pageNumber, pageSize, dispatch) {
        dispatch(merchantAccountStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantAccount/by-merchant-paginated/${merchantCode}?pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        const data = response.data.data;
        
        dispatch(merchantAccountSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to fetch merchant account. Try again.'));
        }
    
      }
    }
  
    async setMerchantAccountAsDefault(id, dispatch) {
        dispatch(merchantAccountStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantAccount/setasdefault/${id}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to set merchant account as default. Try again.'));
        }
    
      }
    }

    // merchant address
  
    async fetchMerchantAddress(merchantCode, dispatch) {
        dispatch(merchantAddressStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantAddress/${merchantCode}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAddressFailure('No response from server'));
        } else {
            dispatch(merchantAddressFailure('Failed to fetch merchant address. Try again.'));
        }
    
      }
    }
  
    async updateMerchantAddress(merchantCode, formData, dispatch) {
        dispatch(merchantProfileStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/MerchantAddress/${merchantCode}`,
          JSON.stringify(formData)
        );
        toast('Merchant profile updated successfully');
        const data = response.data.responseData;
        
        dispatch(merchantProfileSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantProfileFailure('No response from server'));
        } else {
            dispatch(merchantProfileFailure('Failed to update merchant address. Try again.'));
        }
    
      }
    }

    // merchant contact
  
    async fetchMerchantContact(merchantCode, dispatch) {
        dispatch(merchantContactStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantContact/${merchantCode}`
        );
        const data = response.data.responseData;
        dispatch(merchantContactSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantContactFailure('No response from server'));
        } else {
            dispatch(merchantContactFailure('Failed to fetch merchant contact. Try again.'));
        }
    
      }
    }
  
    async updateMerchantContact(merchantCode, data, dispatch) {
        dispatch(merchantContactStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/MerchantContact/${merchantCode}`,
          JSON.stringify({data})
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantContactFailure('No response from server'));
        } else {
            dispatch(merchantContactFailure('Failed to update merchant Contact. Try again.'));
        }
    
      }
    }

    // merchant domain
  
    async createMerchantDomain(merchantCode, dispatch) {
        dispatch(merchantDomainStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/MerchantDomain/${merchantCode}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDomainFailure('No response from server'));
        } else {
            dispatch(merchantDomainFailure('Failed to create merchant domain. Try again.'));
        }
    
      }
    }
  
    async updateMerchantDomain(id, data, dispatch) {
        dispatch(merchantDomainStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/MerchantDomain/${id}`,
          JSON.stringify({data})
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDomainFailure('No response from server'));
        } else {
            dispatch(merchantDomainFailure('Failed to update merchant donin. Try again.'));
        }
    
      }
    }
  
    async fetchMerchantDomainById(id, dispatch) {
        dispatch(merchantDomainStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantDomain/${id}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDomainFailure('No response from server'));
        } else {
            dispatch(merchantDomainFailure('Failed to fetch merchant Domain. Try again.'));
        }
    
      }
    }
  
    async fetchMerchantDomain(merchantCode, dispatch) {
        dispatch(merchantDomainStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantDomain/all/${merchantCode}`
        );
        const data = response.data.responseData;
        
        dispatch(merchantDomainSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDomainFailure('No response from server'));
        } else {
            dispatch(merchantDomainFailure('Failed to fetch merchant Domain. Try again.'));
        }
  }
    }

    // merchant profile
  
    async fetchMerchantProfileBusinessType(dispatch) {
        // dispatch(merchantProfileStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantProfile/business-type`
        );
  dispatch(merchantBusinessTypesSucess(response.data.responseData));
      } catch (err) {
        toast('Couldn\'t fetch business types');
    
      }
    }
  
    async fetchMerchantProfileRegistrationType(dispatch) {
        dispatch(merchantProfileStart());
      try {
        const response = await this.axiosPrivate.get(
          'api/MerchantProfile/registration-type'
        );
        dispatch(merchantRegistrationTypesSucess(response.data.responseData));
      } catch (err) {
        toast('Couldn\'t fetch registration types');
    
      }
    }
  
    async updateMerchantProfile(merchantCode, formData, addressData, dispatch, navigate) {
        dispatch(merchantProfileStart());
      try {
        await this.axiosPrivate.put(`api/MerchantProfile/${merchantCode}`, JSON.stringify(formData));
        await this.updateMerchantAddress(merchantCode, addressData, dispatch);
        navigate(-1);
      } catch (err) {
        
        if (!err.response) {
            dispatch(merchantProfileFailure('No response from server'));
        } else {
            dispatch(merchantProfileFailure('Failed to update merchant profile. Try again.'));
        }
    
      }
    }
  
    async fetchMerchantProfile(merchantCode, dispatch) {
        dispatch(merchantProfileStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Merchant/Profile/${merchantCode}`
        );
  dispatch(merchantProfileSuccess(response.data.responseData));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantProfileFailure('No response from server'));
        } else {
            dispatch(merchantProfileFailure('Failed to fetch merchant profile. Try again.'));
        }
    
      }
    }
  }
  
  export default MerchantService;