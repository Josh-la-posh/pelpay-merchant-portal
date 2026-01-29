import { setEnv } from '@/redux/slices/envSlice';
import { toast } from 'react-toastify';
import { setToken } from '../../redux/slices/envSlice';

class SettingsService {
  constructor(axiosPrivate) {
    this.axiosPrivate = axiosPrivate;
  }

  async fetchEnv(dispatch) {
    try {
      const env = 'Live';
      // const response = await this.axiosPrivate.get('api/settings');
      // const env = response?.data?.responseData?.env;
      // const tokenizationStatus = response?.data?.responseData?.tokenizationStatus
      // const merchantLogo = response?.data?.responseData?.merchantLogo
      if (env) {
        // Backend returns 'None', 'Test', 'Live' etc. Normalize if needed
        dispatch(setEnv(env === 'None' ? 'Test' : env));
      }
      // localStorage.setItem("tokenizationStatus", tokenizationStatus)
      // localStorage.setItem("merchantLogo", merchantLogo)
      return env;
    } catch {
      // silent fail; could add toast.debug
    }
  }

  async updateEnv(newEnv, tokenizationStatus, dispatch) {
    try {
      const body = { env: newEnv, tokenizationStatus};
      const response = await this.axiosPrivate.put('api/settings', body, {
        headers: { 'Content-Type': 'application/json' },
      });
      const env = response?.data?.responseData?.env || newEnv;
      dispatch(setEnv(env === 'None' ? 'Test' : env));

      const updateToken = response?.data?.responseData?.tokenizationStatus ?? tokenizationStatus;
      dispatch(setToken(updateToken))
      toast.success('Environment updated');
      return env;
    } catch (err) {
      toast.error('Failed to update environment');
      console.log("error", err)
      throw err;
    }
  }
}

export default SettingsService;
