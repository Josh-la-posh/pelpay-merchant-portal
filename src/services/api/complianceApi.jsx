import { toast } from "react-toastify";
import {
  complianceStart,
  complianceFailure,
  complianceSuccess,
} from "@/redux/slices/complianceSlice";

class ComplianceService {
  constructor(axiosPrivate, auth) {
    this.axiosPrivate = axiosPrivate;
    this.auth = auth;
  }

  async complianceUpload(merchantCode, formData, dispatch) {
    dispatch(complianceStart());
    try {
      const response = awaitthis.axiosPrivate.post(
        `api/compliance/upload?merchantCode=${merchantCode}`,
        formData
      );

      const data = response.data;
      dispatch(complianceSuccess(data));
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
      const data = response.data;
      console.log("Compliance data fetched:", data);
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
  }

  async updateComplianceData(formData, dispatch) {
    dispatch(complianceStart());
    try {
      const response = await this.axiosPrivate.put(
        "api/compliance",
        JSON.stringify(formData)
      );
      const data = response.data;
      dispatch(complianceSuccess(data));
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
      const response = await this.axiosPrivate.get(
        "api/compliance/agreement-docs"
      );
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
