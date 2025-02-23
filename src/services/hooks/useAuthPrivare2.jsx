import { useEffect } from "react";
import { noHeaderAxiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const useNoHeaderAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    const location  = useLocation();

    useEffect(() => {
        const requestIntercept = noHeaderAxiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.data.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = noHeaderAxiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error.response.status === 401) {
                    try {
                        toast.error('Session expired.\n Redirecting to login');
                        setTimeout(() => {
                            // const logout = await noHeaderAxiosPrivate.put('api/account/logout');
                            setAuth({});
                            navigate('/login', {state: {from: location}, replace: true});
                        }, 2000);
                    } catch (err) {
                        console.log('New error ', err);
                    }
                }
                // if (error?.response?.status === 401 && !prevRequest?.sent) {
                //     prevRequest.sent = true;
                //     try {
                //         const newAccessToken = await refresh();
                //         prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                //         return noHeaderAxiosPrivate(prevRequest);
                //     } catch (refreshError) {
                //         await noHeaderAxiosPrivate('api/account/logout');
                //         console.log('It has worked out');
                //         setAuth({});
                //         navigate('/login', {state: {from: location}, replace: true});
                //     }
                // } 
                return Promise.reject(error);
            }
        );
        return () => {
            noHeaderAxiosPrivate.interceptors.request.eject(requestIntercept);
            noHeaderAxiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh, navigate, setAuth]);

    return noHeaderAxiosPrivate;
}

export default useNoHeaderAxiosPrivate;