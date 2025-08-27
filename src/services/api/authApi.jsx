import { toast } from "react-toastify";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "@/redux/slices/authSlice";
import axios from "./axios";

class AuthService {
  constructor(location, navigate) {
    this.location = location;
    this.navigate = navigate;
  }
  baseUrl = import.meta.env.VITE_MERCHANT_BASE_URL;

  async submitLogin(email, password, setAuth, location, navigate, dispatch) {
    dispatch(loginStart());

    try {
      const response = await axios.post(
        `${this.baseUrl}api/Account`,
        JSON.stringify({  email,  password })
      );

      const data = response.data.responseData;
      console.log("Login response data: ", response.data.responseData);

      setAuth({ data, merchant: null });
      // localStorage.setItem("pelpay-merchant-auth", JSON.stringify(data));
      // localStorage.setItem("pelpay-merchant-token", data.accessToken);
      dispatch(loginSuccess(data));

      toast.success("Login successful");

      const from = location.state?.from?.pathname || "/compliance";
      console.log("Navigating to the previous page or home: ", from);
      navigate(from, { replace: true });
    } catch (err) {
      if (!err.response) {
        console.log("The same error: ", err.response);
        dispatch(loginFailure("No Server Response"));
      } else {
        if (err.response.status === 400) {
          dispatch(loginFailure(err.response.data.message));
          setTimeout(() => {
            dispatch(loginFailure(""));
          }, [4000]);
        } else {
          dispatch(loginFailure("Login Failed"));
          setTimeout(() => {
            dispatch(loginFailure(""));
          }, [2000]);
        }
      }
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
        `${this.baseUrl}/api/account/forget-password`,
        JSON.stringify({ email })
      );
      const data = response.data;

      if (data.requestSuccessful === true) {
        setIsTokenSent(true);
        toast.success(data.message);
      }
    } catch (error) {
      if (!error.response) {
        setErrMsg("No Server Response");
        setTimeout(() => {
          setErrMsg("");
        }, [2000]);
      } else {
        setErrMsg(error.response.data.message);
        setTimeout(() => {
          setErrMsg("");
        }, [2000]);
      }

      errRef.current.focus();
    } finally {
      setLoading(false);
    }
  }
}

export default AuthService;
