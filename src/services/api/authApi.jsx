import { toast } from "react-toastify";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "@/redux/slices/authSlice";
import axios from "./axios";
import { complianceStep, complianceSuccess } from "../../redux/slices/complianceSlice";

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

      await setAuth({ data, merchant: null });
      const token = data?.accessToken;
      const merchantCode = data?.merchants[0]?.merchantCode;
      
      await this.fetchComplianceData(dispatch, merchantCode, navigate, token)
      dispatch(loginSuccess(data));
      toast.success("Login successful");


    } catch (err) {
      if (!err.response) {
        dispatch(loginFailure("No Server Response"));
      } else {
        if (err.response.status === 400) {
          dispatch(loginFailure(err.response.data.message));
          setTimeout(() => {
            dispatch(loginFailure(""));
          }, [4000]);
        } else {
          if (err.response?.data?.responseData?.status === 400) {
              dispatch(loginFailure(err.response?.data?.responseData?.message));
              return;
          }
          dispatch(loginFailure("Login Failed"));
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

      if (data === null) {
        from = location.state?.from?.pathname || "/compliance";
        navigate(from, { replace: true });
        return;
      } else {
        const progress = data?.progress;
        if (progress === 5) {
          from = location.state?.from?.pathname || "/";
        } else {
          from = location.state?.from?.pathname || "/compliance";          
        }
        dispatch(complianceStep(progress));
        dispatch(complianceSuccess(data));
      }

      navigate(from, { replace: true });
    } catch (err) {
      let from;
      from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });

      console.log(err)
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
        `${this.baseUrl2}/api/account/forget-password`,
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
        setErrMsg(err.response.data.message);
      }

      errRef.current.focus();
    } finally {
      setLoading(false);
    }
  }
}

export default AuthService;
