import { toast } from "react-toastify";
import {
  complianceStart,
  complianceFailure,
  complianceSuccess,
  setComplianceStatus,
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
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
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
      let progress = 0;
      if (data?.progress && data.progress > 0) progress = data.progress;

      // Map backend 'status' to internal complianceStatus if provided.
      if (data?.status) {
        dispatch(setComplianceStatus(data.status));
        // If backend already moved to review/approved but progress still 6, elevate to 7 for UI consistency
        if (["under_review", "approved"].includes(data.status) && progress === 6) {
          progress = 7;
        }
      }

      // Dispatch step first so UI stepper updates before data-driven renders
      dispatch(complianceStep(progress));
      // Ensure stored complianceData reflects adjusted progress
      const enrichedData = { ...data, progress };
      dispatch(complianceSuccess(enrichedData));
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
      } else {
        dispatch(
          complianceFailure("Failed to fetch compliance data. Try again.")
        );
      }
    }
  }

  async updateComplianceData(merchantCode, formData, dispatch) {
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

  async updateComplianceOwnerData(id, merchantCode, formData, dispatch) {
    dispatch(complianceStart());
    try {
      const response = await this.axiosPrivate.put(
        `api/compliance/owner/${id}?merchantCode=${merchantCode}`,
        formData, 
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );  
      const data = response.data;
      // dispatch(complianceSuccess(data));
      await this.fetchComplianceData(dispatch, merchantCode);
      toast.success("Compliance owner data updated successfully.");
    } catch (err) {
      if (!err.response) {
        dispatch(complianceFailure("No response from server"));
      } else {
        dispatch(
          complianceFailure("Failed to update compliance owner data. Try again.")
        );
      }
    }
  }

  async fetchComplianceAgreementsDocs(dispatch) {
    try {
      const response = await this.axiosPrivate.get("api/complianceju");
      const data = response.data;
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
      // Optimistically set status to under_review to prevent repeated triggers
      dispatch(setComplianceStatus('under_review'));
      toast.success("Compliance verification started successfully.");
      return response;
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
