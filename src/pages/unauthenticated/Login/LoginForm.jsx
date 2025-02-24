import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '@/services/hooks/useAuth';
import AuthService from '@/services/api/authApi';
import { Eye, EyeOff, Lock } from 'lucide-react';
import TextButton from '@/components/ui/text-button';

const LoginForm = () => {
  const { setAuth } = useAuth();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const userRef = useRef();
  const authService = new AuthService();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errMsg, setErrMsg] = useState(error);

  useEffect(() => {
    userRef.current.focus();
  }, [])

  useEffect(() => {
    setErrMsg(error);

    setTimeout(() => {
      setErrMsg('');
    }, 5000);
  }, [error])

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
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
        <div className="">
          <label className="block text-black text-[13px] mb-1 lg:mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg">            
            <Lock size='15px' className='absolute top-3 left-3 text-gray-500' />
            <input
              type="email"
              id="email"
              ref={userRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm focus:outline-none w-full bg-transparent"
              required
            />
          </div>
        </div>
        <div className="">
          <label className="block text-black text-[13px] mb-1 lg:mb-2" htmlFor="password">
            Password
          </label>
          <div className="relative w-full pl-9 pr-12 py-2 border border-gray-300 rounded-lg">            
            <Lock size='15px' className='absolute top-3 left-3 text-gray-500' />
            <input
              type={!showPassword ? 'password' : 'text'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm focus:outline-none w-full bg-transparent"
              required
            />
            <TextButton 
              onClick={handleShowPassword}
              variant= "custom"
              className="absolute top-3 right-3 text-gray-500"
            >
              {!showPassword 
                ? <EyeOff size='15px' />
                : <Eye size='15px' />
              }

            </TextButton>
          </div>
        </div>
        <div className="flex items-center justify-end">
          {/* <label className="text-black text-[11px] sm:text-xs mb-1 lg:mb-2 flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2"
            />
            Remember me
          </label> */}
          <Link to="/forgot-password" className="text-xs lg:text-sm text-priColor hover:underline">Forgot password?</Link>
        </div>
        <button
          type="submit"
          className="w-full bg-priColor text-sm text-white py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        <div className="text-center mt-4">
          <Link to="/register" className="text-[12px] lg:text-sm">Don't have an account? <span className='text-priColor hover:underline'> Sign Up</span></Link>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;