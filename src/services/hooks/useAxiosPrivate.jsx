import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const location  = useLocation();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.data.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    if (error.response.status === 401) {
                        try {
                            toast.error('Session expired.\n Redirecting to login');
                            setTimeout(() => {
                                setAuth({});
                                navigate('/login', {state: {from: location}, replace: true});
                            }, 2000);
                        } catch (err) {
                        }
                    }
                    // try {
                    //     const newAccessToken = await refresh();
                    //     prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    //     return axiosPrivate(prevRequest);
                    // } catch(err) {
                    //     navigate('/login', {state: {from: location}, replace: true});
                    // }
                    return axiosPrivate(prevRequest);
                } else Promise.reject(error);
            }
        );
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;