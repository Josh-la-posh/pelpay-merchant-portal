import React from 'react';
import RegisterForm from './RegisterForm';
import AuthLayout from '@/components/AuthLayout';

const RegisterPage = () => {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;