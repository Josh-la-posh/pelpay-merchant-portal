import { toast } from "react-toastify";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "@/redux/slices/authSlice";
import axios from "./axios";
import { complianceStep, complianceSuccess, setComplianceStatus } from "../../redux/slices/complianceSlice";
import RoleService from "@/services/api/rolesApi";
import PermissionService from "@/services/api/permissionApi";

class AuthService {
  constructor(axiosPrivate) {
    this.axiosPrivate = axiosPrivate;
  }
  baseUrl = import.meta.env.VITE_MERCHANT_BASE_URL;
  baseUrl2 = import.meta.env.VITE_MERCHANT_BASE_URL_NEW;

  async submitLogin(email, password, setAuth, location, navigate, dispatch) {
    dispatch(loginStart());

    try {
      const response = await axios.post(
        `${this.baseUrl2}api/Account`,
        JSON.stringify({  email,  password })
      );

      const data = response?.data?.responseData;
      const merchant = data?.merchants[0];
      const complianceStatus = data?.complianceStatus || null;
      const merchantCode = merchant?.merchantCode;
      const aggregatorCode = data?.aggregator?.aggregatorCode;

      await setAuth({ data, merchant, complianceStatus });
      if (complianceStatus) {
        dispatch(setComplianceStatus(complianceStatus));  
        try { localStorage.setItem('complianceStatus', complianceStatus); } catch { /* ignore */ }
      }
      const token = data?.accessToken;
      await this.fetchComplianceData(dispatch, merchantCode, navigate, token)

      const roleService = new RoleService(this.axiosPrivate);
      await roleService.fetchRolesByAggregatorCode(aggregatorCode, dispatch);

      const permissionService = new PermissionService(this.axiosPrivate);
      await permissionService.fetchUserRolePermission(aggregatorCode, dispatch);
      // console.log("Saved Role Permission", localStorage.getItem('RolePermission'))
      // const permission = localStorage.getItem('RolePermission');
      // if (permission === undefined) {
      //   console.log('The permission: ', permission)
      //   console.log('I cannot login at this point');
      // } else {
      // }
      dispatch(loginSuccess());
      // setTimeout(() => {

      // }, [3000])
      
      toast.success("Login successful");


    } catch (err) {
      if (!err.response) {
        dispatch(loginFailure("No Server Response"));
      } else {
        if (err.response.status === 400) {
          dispatch(loginFailure(err.response?.data?.responseData?.message || err.response.data.message));
        } else {
          if (err.response?.data?.responseData?.status === 400) {
              dispatch(loginFailure(err.response?.data?.responseData?.message));
              return;
          }
          dispatch(loginFailure(err.response?.data?.responseData?.message || "Login Failed"));
        }
      }
    }
  }

  async fetchComplianceData(dispatch, merchantCode, navigate, token) {
      try {
        const response = await axios.get(
          `${this.baseUrl2}api/compliance?merchantCode=${merchantCode}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // const response = await this.axiosPrivate.get(
      //   `api/compliance?merchantCode=${merchantCode}`
      // );

      const data = response.data?.responseData;

      let from;

      const status = data?.complianceStatus || null;
      if (status) {
        dispatch(setComplianceStatus(status));
        try { localStorage.setItem('complianceStatus', status); } catch { /* ignore */ }
      }

      if (data === null) {
        from = "/compliance";
      } else {
        const progress = data?.progress;
        dispatch(complianceStep(progress));
        dispatch(complianceSuccess(data));
        const terminalStatuses = ["under_review", "approved"];
        if (terminalStatuses.includes(status)) {
          from = "/"; // dashboard
        } else {
          from = "/compliance";
        }
      }
      navigate(from, { replace: true });
    } catch (err) {
      let from;
      from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });

      // log error for debugging
  console.error('fetchComplianceData error:', err);
    }
  }

  async submitForgotPassword(
    email,
    setLoading,
    setIsTokenSent,
    setErrMsg,
    errRef
  ) {
    setLoading(true);
    try {
      const response = await axios.post(
        `${this.baseUrl2}api/account/forget-password`,
        JSON.stringify({ email })
      );
      const data = response.data;

      if (data.requestSuccessful === true) {
        setIsTokenSent(true);
        toast.success(data.message);
      }
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        if (err.response?.data?.responseData?.status === 400) {
          setErrMsg(err.response?.data?.responseData?.message);
          return;
        }
        setErrMsg(err.response?.data?.responseData?.message || err.response.data.message);
      }

      errRef.current.focus();
  console.error('submitForgotPassword error:', err);
    } finally {
      setLoading(false);
    }
  }
}

export default AuthService;
