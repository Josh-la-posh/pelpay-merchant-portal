import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        const refreshToken = auth.refreshToken;
        const response = await axios.post('/api/auth/refresh',
            JSON.stringify({refreshToken}),
            {
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }
        );
        setAuth(prev => {
            return { ...prev, accessToken: response.data.responseData.accessToken }
        });
        return response.data.responseData.accessToken;
    }
    return refresh;
}

export default useRefreshToken;