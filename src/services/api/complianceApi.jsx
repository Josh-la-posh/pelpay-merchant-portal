import { toast } from "react-toastify";
import {
  complianceStart,
  complianceFailure,
  complianceSuccess,
} from "@/redux/slices/complianceSlice";
import { complianceStep } from "../../redux/slices/complianceSlice";

class ComplianceService {
  constructor(axiosPrivate) {
    this.axiosPrivate = axiosPrivate;
  }

  async complianceUpload(merchantCode, formData, dispatch) {
    dispatch(complianceStart());
    try {
      const response = await this.axiosPrivate.post(
        `api/compliance/upload?merchantCode=${merchantCode}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = response?.data;

      dispatch(complianceSuccess(data));
    
      await this.fetchComplianceData(dispatch, merchantCode);
      toast.success("Compliance data uploaded successfully.");
      console.log("Compliance data uploaded sucess:", data);
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
        console.error("Error uploading compliance data:", err);
      } else {
        dispatch(
          complianceFailure(
            "Failed to upload merchant compliance data. Try again."
          )
        );
      }
    }
  }

  async fetchComplianceData(dispatch, merchantCode) {
    dispatch(complianceStart());

    try {
      const response = await this.axiosPrivate.get(
        `api/compliance?merchantCode=${merchantCode}`
      );

      const data = response.data?.responseData;
      console.log("Compliance data fetched successfully22:", data);
      
      dispatch(complianceStep(data?.progress || 0));

     
      dispatch(complianceSuccess(data));
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
      } else {
        dispatch(
          complianceFailure("Failed to fetch compliance data. Try again.")
        );
      }
    }
    console.log("Fetch compliance data process completed.");
  }

  async updateComplianceData(formData, dispatch, merchantCode) {
    dispatch(complianceStart());
    try {
      const response = await this.axiosPrivate.put(
        `api/compliance/?merchantCode=${merchantCode}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const data = response.data;
      dispatch(complianceSuccess(data));
      await this.fetchComplianceData(dispatch, merchantCode);
      console.log("Compliance data updated successfully:", data);
      toast.success("Compliance data updated successfully.");
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
      } else {
        dispatch(
          complianceFailure("Failed to update compliance data. Try again.")
        );
      }
    }
  }

  async fetchComplianceAgreementsDocs(dispatch) {
    try {
      const response = await this.axiosPrivate.get("api/complianceju");
      const data = response.data;
      console.log("Compliance agreements documents fetched:", data);
      dispatch(complianceSuccess(data));
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
      } else {
        dispatch(
          complianceFailure(
            "Failed to fetch compliance agreements documents. Try again."
          )
        );
      }
    }
  }

  async fetchDownloadComplianceDocs(dispatch, id, merchantCode) {
    dispatch(complianceStart());
    try {
      const response = await this.axiosPrivate.get(
        `api/compliance/download?id=${id}&merchantCode=${merchantCode}`
      );
      const data = response.data;
      dispatch(complianceSuccess(data));
      toast.success("Compliance documents downloaded successfully.");
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
      } else {
        dispatch(
          complianceFailure(
            "Failed to download compliance documents. Try again."
          )
        );
      }
    }
  }

  async deleteComplianceDoc(id, merchantCode, dispatch) {
    dispatch(complianceStart());
    try {
      const response = await this.axiosPrivate.delete(
        `api/compliance/${id}?merchantCode=${merchantCode}`
      );
      const data = response.data;
      dispatch(complianceSuccess(data));
      toast.success("Compliance document deleted successfully.");
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
      } else {
        dispatch(
          complianceFailure("Failed to delete compliance document. Try again.")
        );
      }
    }
  }

  async deleteComplianceDocPermanently(id, merchantCode, dispatch) {
    dispatch(complianceStart());
    try {
      const response = await this.axiosPrivate.delete(
        `api/compliance/owner/${id}?merchantCode=${merchantCode}`
      );
      const data = response.data;
      dispatch(complianceSuccess(data));
      toast.success("Compliance document deleted successfully.");
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
      } else {
        dispatch(
          complianceFailure("Failed to delete compliance document. Try again.")
        );
      }
    }
  }

  async startComplianceVerification(merchantCode, dispatch) {
    dispatch(complianceStart());
    try {
      const response = await this.axiosPrivate.put(
        `api/compliance/startVerification?merchantCode=${merchantCode}`
      );
      const data = response.data;
      dispatch(complianceSuccess(data));
      toast.success("Compliance verification started successfully.");
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
      } else {
        dispatch(
          complianceFailure(
            "Failed to start compliance verification. Try again."
          )
        );
      }
    }
  }

  async fetchComplianceWebhooks(dispatch) {
    dispatch(complianceStart());
    try {
      const response = await this.axiosPrivate.get(`api/compliance/webhook`);
      const data = response.data;
      dispatch(complianceSuccess(data));
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
      } else {
        dispatch(
          complianceFailure("Failed to fetch compliance webhooks. Try again.")
        );
      }
    }
  }
}

export default ComplianceService;
