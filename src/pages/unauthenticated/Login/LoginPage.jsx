import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '@/services/hooks/useAuth';
import LoginForm from './LoginForm';
import AuthLayout from '@/components/AuthLayout';
import { logout } from '@/redux/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { setAuth } = useAuth();

  useEffect(() => {
    dispatch(logout());
    setAuth({});
    window.localStorage.clear();
  }, [dispatch, setAuth]);

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;