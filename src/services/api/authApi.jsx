import { toast } from "react-toastify";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "@/redux/slices/authSlice";
import axios from "./axios";
import { complianceStep, complianceSuccess, setComplianceStatus } from "../../redux/slices/complianceSlice";

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
      const merchant = data?.merchants?.[0];
      const merchantCode = merchant?.merchantCode;
      const token = data?.accessToken;
      const rawStatus = data?.complianceStatus || null; // may be missing for brand new account

      // Determine routing & whether we need an immediate compliance fetch.
      // Treat missing status as brand new -> route to compliance and mark status 'pending' locally.
      let effectiveStatus = rawStatus;
      // let shouldFetchCompliance = false;
      let targetRoute = '/';

      // if (!effectiveStatus) {
      //   effectiveStatus = 'pending';
      //   targetRoute = '/compliance';
      // } else if (['pending', 'started'].includes(effectiveStatus)) {
      //   // Need progress & data details -> fetch
      //   shouldFetchCompliance = true;
      //   targetRoute = '/compliance';
      // } else if (effectiveStatus === 'rejected') {
      //   targetRoute = '/compliance';
      // } else if (effectiveStatus === 'under_review') {
      //   targetRoute = '/success';
      // } else if (effectiveStatus === 'approved') {
      //   targetRoute = '/';
      // }

      // Set auth state early so app has base identity & status
      await setAuth({ data, merchant, complianceStatus: effectiveStatus });
      dispatch(setComplianceStatus(effectiveStatus));
      try { localStorage.setItem('complianceStatus', effectiveStatus); } catch { /* ignore */ }

      // if (shouldFetchCompliance && merchantCode && token) {
      //   // This call will navigate internally; override targetRoute after fetch logic
      //   await this.fetchComplianceData(dispatch, merchantCode, navigate, token);
      // } else {
        navigate(targetRoute, { replace: true });
      // }

      dispatch(loginSuccess(data));
      toast.success('Login successful');


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

      // Determine internal compliance status (backend may supply either 'complianceStatus' or generic 'status')
      const inferredStatus = data?.complianceStatus || data?.status || null;
      if (inferredStatus) {
        dispatch(setComplianceStatus(inferredStatus));
        try { localStorage.setItem('complianceStatus', inferredStatus); } catch { /* ignore */ }
      }

      if (!data) {
        from = "/compliance"; // user hasn't started compliance at all
      } else {
        let progress = data?.progress ?? 0;
        const terminalStatuses = ["under_review", "approved"];
        if (terminalStatuses.includes(inferredStatus) && progress === 6) {
          progress = 7; // elevate for final state consistency
        }
        dispatch(complianceStep(progress));
        dispatch(complianceSuccess({ ...data, progress }));
        if (inferredStatus === 'rejected') {
          from = '/compliance';
        } else if (inferredStatus === 'under_review') {
          from = '/success';
        } else if (inferredStatus === 'approved') {
          from = '/';
        } else {
          from = '/compliance';
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
