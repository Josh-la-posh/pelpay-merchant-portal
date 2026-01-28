import { useEffect, useRef } from "react";
import { formDataAxiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const logoutTriggered = useRef(false);

  useEffect(() => {
    const requestIntercept = formDataAxiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.data?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = formDataAxiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;

          if (!logoutTriggered.current) {
            logoutTriggered.current = true;
            toast.error("Session expired. Redirecting to login...");
            setTimeout(() => {
              setAuth({});
              navigate("/login", { state: { from: location }, replace: true });
            }, 2000);
          }
        }

        if (error?.response?.status >= 500) {
          toast.error('Service temporarily unavailable. Please try again later.');
          // return Promise.reject(error);
          }
          
          if (!error.response) {
          toast.error('Network error. Please check your connection.');
          // return Promise.reject(error);
        }

        // return Promise.reject(error);
      }
    );

    return () => {
      formDataAxiosPrivate.interceptors.request.eject(requestIntercept);
      formDataAxiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh, setAuth, navigate, location]);

  return formDataAxiosPrivate;
};

export default useAxiosPrivate;
