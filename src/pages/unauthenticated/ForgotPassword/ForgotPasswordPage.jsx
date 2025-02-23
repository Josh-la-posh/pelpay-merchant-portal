import React from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';
import AuthLayout from '@/components/AuthLayout';

const ForgotPasswordPage = () => {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;