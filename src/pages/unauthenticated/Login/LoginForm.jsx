import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/services/hooks/useAuth';
import AuthService from '@/services/api/authApi';
import { Eye, EyeOff, Lock } from 'lucide-react';
import UpdateInputField from '../../../components/UpdateInputField';
import Button from '../../../components/ui/button';
import useAxiosPrivate from '../../../services/hooks/useFormAxios';

const LoginForm = () => {
  const { setAuth } = useAuth();
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const authService = new AuthService(axiosPrivate);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errMsg, setErrMsg] = useState(error);

  useEffect(() => {
    if (error) {
      setErrMsg(error);      
    }
  }, [error])

  const handleShowPassword = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrMsg('');
    await authService.submitLogin(email, password, setAuth, location, navigate, dispatch);
  };

  return (
    <section className="pt-8 space-y-4">
      <div className="lg:flex justify-center">
        <img src='/assets/logo.jpg' />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Login</h2>
        <h2 className="text-[15px] text-black/60">Kindly fill the field below to login</h2>
      </div>

      {errMsg && <p className='text-xs text-red-600'>{errMsg}</p>}
      <form onSubmit={handleLogin} className='space-y-6'>
        <UpdateInputField
          label='Email'
          icon={<Lock size='15px' className='text-gray-500' />}
          type='email'
          id='email'
          valueName={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
        />
        <UpdateInputField
          label='Password'
          icon={<Lock size='15px' className='text-gray-500' />}
          type={!showPassword ? 'password' : 'text'}
          id='password'
          valueName={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
          prefixIcon={!showPassword 
              ? <EyeOff size='15px' />
              : <Eye size='15px' />
            }
          prefixOnclick={handleShowPassword}
        />
        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-xs lg:text-sm text-priColor hover:underline">Forgot password?</Link>
        </div>
        <Button
          type='submit'
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
        <div className="text-center mt-4">
          <Link to="/register" className="text-[12px] lg:text-sm">Don't have an account? <span className='text-priColor hover:underline'> Sign Up</span></Link>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;