import { toast } from "react-toastify";
import { aggregatorFailure, aggregatorMerchantFailure, aggregatorMerchantStart, aggregatorMerchantSuccess, aggregatorStart, aggregatorSuccess } from "@/redux/slices/aggregatorSlice";
import { merchantAccountFailure, merchantAccountStart, merchantAccountSuccess, merchantAddressFailure, merchantAddressStart, merchantBusinessTypesSucess, merchantContactFailure, merchantContactStart, merchantContactSuccess, merchantCredentialsFailure, merchantCredentialsStart, merchantCredentialsSuccess, merchantDocumentFailure, merchantDocumentStart, merchantDocumentSuccess, merchantDocumentTypeFailure, merchantDocumentTypeStart, merchantDocumentTypeSuccess, merchantDomainFailure, merchantDomainStart, merchantDomainSuccess, merchantFailure, merchantProfileFailure, merchantProfileStart, merchantProfileSuccess, merchantRegistrationTypesSucess, merchantStart, merchantSuccess } from "@/redux/slices/merchantSlice";
import jsPDF from "jspdf";
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
      } finally {
      }
    }
  
    async createMerchantDocument(merchantCode, documentId, fileData, dispatch) {
        dispatch(merchantDocumentStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/MechantDocuments/${merchantCode}/document-type/${documentId}`,
          fileData
        );
        // console.log('Merchant document created ', response.data);
        dispatch(merchantDocumentSuccess('Merchant document created successfully'));
        await this.fetchMerchantDocument(merchantCode, dispatch);
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDocumentFailure('No response from server'));
        } else {
            dispatch(merchantDocumentFailure('Failed to create merchant document. Try again.'));
        }
      } finally {
      }
    }
  
    async createMerchantDocumentType2(merchantCode, documentId, data, dispatch) {
        dispatch(merchantDocumentStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/MerchantDocuments/${merchantCode}/document-type_2/${documentId}`,
          JSON.stringify({data})
        );
        console.log('Merchant document type 2 created ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDocumentFailure('No response from server'));
        } else {
            dispatch(merchantDocumentFailure('Failed to create merchant document. Try again.'));
        }
      } finally {
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
      } finally {
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
        console.log(err)
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to fetch merchant data. Try again.');
        }
      } finally {
      }
    }
  
    async deleteMerchantDocument(documentId, merchantCode, dispatch) {
        dispatch(merchantDocumentStart());
      try {
        const response = await this.axiosPrivate.delete(
          `api/MechantDocuments/${documentId}`
        );
        const data = response.data.responseData;
        console.log('Merchant document deleted sucessfully: ', data);
        await this.fetchMerchantDocument(merchantCode, dispatch);
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDocumentFailure('No response from server'));
        } else {
            dispatch(merchantDocumentFailure('Failed to delete Merchant document. Try again.'));
        }
      } finally {
      }
    }

    // merchant
  
    async fetchMerchantCredentials(merchantCode, dispatch) {
        dispatch(merchantCredentialsStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Merchant/credentials/${merchantCode}`
        );
        const data = response.data.responseData;
        dispatch(merchantCredentialsSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantCredentialsFailure('No response from server'));
        } else {
            dispatch(merchantCredentialsFailure('Failed to fetch merchant data. Try again.'));
        }
      } finally {
      }
    }
  
    async createMerchant(data, dispatch) {
        dispatch(merchantStart());
      try {
        const response = await this.axiosPrivate.post(
          'api/Merchant',
          JSON.stringify({data})
        );
        console.log('merchant credential created successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantFailure('No response from server'));
        } else {
            dispatch(merchantFailure('Failed to create merchant. Try again.'));
        }
      } finally {
      }
    }
  
    async addUserMerchant(formData) {
      try {
        const response = await this.axiosPrivate.post(
          'api/Merchant/adduser',
          JSON.stringify(formData)
        );
        toast('User added successfully');
      } catch (err) {
        console.log(err);
        if (!err.response) {
          toast('No response from server');
        } else {
          const errMsg = err.response.data.message;
          toast(errMsg);
        }
      } finally {
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
        console.log('Fetched data: ', data);
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
      } finally {
      }
    }
  
    async deleteMerchantUser(data, dispatch) {
        dispatch(merchantStart());
      try {
        const response = await this.axiosPrivate.delete(
          'api/Merchant/user',
          JSON.stringify({data})
        );
        console.log('merchant deleted successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantFailure('No response from server'));
        } else {
            dispatch(merchantFailure('Failed to delete merchant. Try again.'));
        }
      } finally {
      }
    }
  
    async deleteMerchant(merchantId, dispatch) {
        dispatch(merchantStart());
      try {
        const response = await this.axiosPrivate.delete(
          `api/Merchant/${merchantId}`
        );
        console.log('merchant deleted successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantFailure('No response from server'));
        } else {
            dispatch(merchantFailure('Failed to delete merchant. Try again.'));
        }
      } finally {
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
        console.log('merchant account created successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to create merchant account. Try again.'));
        }
      } finally {
      }
    }
  
    async updateMerchantAccount(Id, dispatch) {
        dispatch(merchantAccountStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/MerchantAccount/${Id}`
        );
        console.log('merchant Account updated successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to update merchant account. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchMerchantAccount(Id, dispatch) {
        dispatch(merchantAccountStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantAccount/${Id}`
        );
        console.log('merchant Account fetched successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to fetch merchant account. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchMerchantAccountByAccountNumber(accountNumber, dispatch) {
        dispatch(merchantAccountStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantAccount/${accountNumber}`
        );
        console.log('merchant Account fetched successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to fetch merchant account. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchMerchantAccountByPage(merchantCode, pageNumber, pageSize, dispatch) {
        dispatch(merchantAccountStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantAccount/by-merchant-paginated/${merchantCode}?pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
        const data = response.data.data;
        console.log(data);
        dispatch(merchantAccountSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to fetch merchant account. Try again.'));
        }
      } finally {
      }
    }
  
    async setMerchantAccountAsDefault(id, dispatch) {
        dispatch(merchantAccountStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantAccount/setasdefault/${id}`
        );
        console.log('merchant Account set as default successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAccountFailure('No response from server'));
        } else {
            dispatch(merchantAccountFailure('Failed to set merchant account as default. Try again.'));
        }
      } finally {
      }
    }

    // merchant address
  
    async fetchMerchantAddress(merchantCode, dispatch) {
        dispatch(merchantAddressStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantAddress/${merchantCode}`
        );
        console.log('merchant address fetched successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantAddressFailure('No response from server'));
        } else {
            dispatch(merchantAddressFailure('Failed to fetch merchant address. Try again.'));
        }
      } finally {
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
        console.log(data);
        dispatch(merchantProfileSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantProfileFailure('No response from server'));
        } else {
            dispatch(merchantProfileFailure('Failed to update merchant address. Try again.'));
        }
      } finally {
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
      } finally {
      }
    }
  
    async updateMerchantContact(merchantCode, data, dispatch) {
        dispatch(merchantContactStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/MerchantContact/${merchantCode}`,
          JSON.stringify({data})
        );
        console.log('merchant contact updated successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantContactFailure('No response from server'));
        } else {
            dispatch(merchantContactFailure('Failed to update merchant Contact. Try again.'));
        }
      } finally {
      }
    }

    // merchant domain
  
    async createMerchantDomain(merchantCode, dispatch) {
        dispatch(merchantDomainStart());
      try {
        const response = await this.axiosPrivate.post(
          `api/MerchantDomain/${merchantCode}`
        );
        console.log('merchant Domain created successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDomainFailure('No response from server'));
        } else {
            dispatch(merchantDomainFailure('Failed to create merchant domain. Try again.'));
        }
      } finally {
      }
    }
  
    async updateMerchantDomain(id, data, dispatch) {
        dispatch(merchantDomainStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/MerchantDomain/${id}`,
          JSON.stringify({data})
        );
        console.log('merchant domain updated successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDomainFailure('No response from server'));
        } else {
            dispatch(merchantDomainFailure('Failed to update merchant donin. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchMerchantDomainById(id, dispatch) {
        dispatch(merchantDomainStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantDomain/${id}`
        );
        console.log('merchant Domain fetched successfully ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDomainFailure('No response from server'));
        } else {
            dispatch(merchantDomainFailure('Failed to fetch merchant Domain. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchMerchantDomain(merchantCode, dispatch) {
        dispatch(merchantDomainStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantDomain/all/${merchantCode}`
        );
        const data = response.data.responseData;
        console.log('Hte domain: ', data);
        dispatch(merchantDomainSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantDomainFailure('No response from server'));
        } else {
            dispatch(merchantDomainFailure('Failed to fetch merchant Domain. Try again.'));
        }
      } finally {
      }
    }

    // merchant profile
  
    async fetchMerchantProfileBusinessType(dispatch) {
        // dispatch(merchantProfileStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantProfile/business-type`
        );
        const data = response.data.responseData;
        dispatch(merchantBusinessTypesSucess(data));
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
        const data = response.data.responseData;
        dispatch(merchantRegistrationTypesSucess(data));
      } catch (err) {
        toast('Couldn\'t fetch registration types');
      }
    }
  
    async updateMerchantProfile(merchantCode, formData, addressData, dispatch, navigate) {
        dispatch(merchantProfileStart());
      try {
        const response = await this.axiosPrivate.put(
          `api/MerchantProfile/${merchantCode}`,
          JSON.stringify(formData)
        );
        const data = response.data.responseData;
        await this.updateMerchantAddress(merchantCode, addressData, dispatch);
        navigate(-1);
      } catch (err) {
        console.log('E no gree work oooo, ', err.response)
        if (!err.response) {
            dispatch(merchantProfileFailure('No response from server'));
        } else {
            dispatch(merchantProfileFailure('Failed to update merchant profile. Try again.'));
        }
      } finally {
      }
    }
  
    async fetchMerchantProfile(merchantCode, dispatch) {
        dispatch(merchantProfileStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/MerchantProfile/${merchantCode}`
        );
        const data = response.data.responseData;
        dispatch(merchantProfileSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(merchantProfileFailure('No response from server'));
        } else {
            dispatch(merchantProfileFailure('Failed to fetch merchant profile. Try again.'));
        }
      } finally {
      }
    }
  }
  
  export default MerchantService;