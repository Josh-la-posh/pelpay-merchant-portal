import { setEnv } from '@/redux/slices/envSlice';
import { toast } from 'react-toastify';

class SettingsService {
  constructor(axiosPrivate) {
    this.axiosPrivate = axiosPrivate;
  }

  async fetchEnv(dispatch) {
    try {
      const response = await this.axiosPrivate.get('api/settings');
      const env = response?.data?.responseData?.env;
      if (env) {
        // Backend returns 'None', 'Test', 'Live' etc. Normalize if needed
        dispatch(setEnv(env === 'None' ? 'Test' : env));
      }
      return env;
    } catch {
      // silent fail; could add toast.debug
    }
  }

  async updateEnv(newEnv, dispatch) {
    try {
      const body = { env: newEnv };
      const response = await this.axiosPrivate.put('api/settings', body, {
        headers: { 'Content-Type': 'application/json' },
      });
      const env = response?.data?.responseData?.env || newEnv;
      dispatch(setEnv(env === 'None' ? 'Test' : env));
      toast.success('Environment updated');
      return env;
    } catch (err) {
      toast.error('Failed to update environment');
      throw err;
    }
  }
}

export default SettingsService;
