import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayouts';
import RequireAuth from '../services/hooks/RequiredAuth';
import LoginPage from '../pages/unauthenticated/Login/LoginPage';
import RegisterPage from '../pages/unauthenticated/Register/RegisterPage';
import ResetPasswordPage from '../pages/unauthenticated/ResetPassword/ResetPasswordPage';
import ForgotPasswordPage from '../pages/unauthenticated/ForgotPassword/ForgotPasswordPage';
import Dashboard from '../pages/authenticated/Dashboard/Dashboard';
import CustomersPage from '../pages/authenticated/Customers/Customers';
import DisputesPage from '../pages/authenticated/Disputes/Disputes';
import Aggregator from '../pages/authenticated/Aggregator/Aggregator';
import MerchantPage from '../pages/authenticated/Merchant/Merchant';
import AllSettlement from '../pages/authenticated/Settlement/AllSettlement';
import InvoicesPage from '../pages/authenticated/Invoices/Invoices';
import TransactionPage from '../pages/authenticated/Transaction/Transaction';
import HelpCenter from '../pages/authenticated/HelpCenter/HelpCenter';
import SettlementConfiguration from '../pages/authenticated/Settlement/Configuration';
import SettlementBankAccount from '../pages/authenticated/Settlement/BankAccount';
import ProfilePage from '../pages/authenticated/Settings/Profile';
import SecuritySettings from '../pages/authenticated/Settings/SecuritySettingsPage';
import NotificationSettings from '../pages/authenticated/Settings/NotificationSettingsPage';
import PrivacySettings from '../pages/authenticated/Settings/PrivacySettings';
import AddMerchantPage from '../pages/authenticated/Merchant/AddMerchant';
import MerchantProfile from '../pages/authenticated/Merchant/MerchantProfile';
import MerchantProfileUpdate from '../pages/authenticated/Merchant/ProfileUpdate';
import MerchantDomain from '../pages/authenticated/Merchant/MerchantDomain';
import MerchantDocument from '../pages/authenticated/Merchant/MerchantDocument';
import MerchantCredential from '../pages/authenticated/Merchant/MerchantCredentials';
import SettlementBatchTransaction from '../pages/authenticated/Settlement/SettlementBatchTransaction';
import ContactPage from '../pages/authenticated/Settings/Contact';
import UserManagement from '../pages/authenticated/Settings/UserManagement';
import SettingsLayout from '../layouts/SettingsLayout';
import RolesAndPermission from '../pages/authenticated/Settings/Roles';
import ManagePermission from '../pages/authenticated/Settings/ManagePermission';
import RoleAssignment from '../pages/authenticated/Settings/RoleAssignment';
import MerchantLayout from '../layouts/MerchantLayout';

const RoutesSystem = () => {
  return (
    <Routes>

      {/* public routes */}

      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/reset-password' element={<ResetPasswordPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      {/* <Route path='/confirm-email' element={<ConfirmEmailPage />} /> */}
      {/* <Route path='/complete-registration' element={<RegisterMultiStepPage />} /> */}


      {/* protected routes */}

      <Route element={<RequireAuth />}>
        <Route path='/' element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="disputes" element={<DisputesPage />} />
          
          <Route path="/merchants">
            <Route element={<MerchantLayout />}>
              <Route path='' element={<MerchantPage />} />
              <Route path='addNew' element={<AddMerchantPage />} />
              <Route path="aggregator" element={<Aggregator />} />
              <Route path='profile' element={<MerchantProfile />} />
              <Route path='document' element={<MerchantDocument />} />
              <Route path='credential' element={<MerchantCredential />} />
            </Route>
            <Route path='profile/update/:merchantCode' element={<MerchantProfileUpdate />} />
            <Route path='domain/:merchantCode' element={<MerchantDomain />} />
          </Route>
          <Route path="/settlement" >
            <Route path='all' element={<AllSettlement />} />
            <Route path='batch/transaction/:transactionId' element={<SettlementBatchTransaction />} />
            <Route path='bank' element={<SettlementBankAccount />} />
            <Route path='configuration' element={<SettlementConfiguration />} />
          </Route>
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="transactions" element={<TransactionPage />} />
          <Route path="help-center" element={<HelpCenter />} />
          <Route path='/settings' element={<SettingsLayout/>}>
            <Route path='/settings'>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="notification" element={<NotificationSettings />} />
              <Route path="privacy" element={<PrivacySettings />} />
              <Route path="user" element={<UserManagement />} />
              <Route path="role" element={<RolesAndPermission />} />
              <Route path="role/:id/managePermission" element={<ManagePermission />} />
              <Route path="user/:id/roleAssign" element={<RoleAssignment />} />
            </Route>
          </Route>


          {/* Add other routes */}

          {/* 
          <Route path='/change-password' element={<ChangePasswordPage />} /> */}

          {/* Compliance Routes */}

          {/* <Route path="compliance" element={<ComplianceLayout />} >
            <Route path="contact" element={<ContactForm />} />
            <Route path="profile" element={<ProfileForm />} />
            <Route path="bank" element={<BankForm />} />
            <Route path="business" element={<BusinessForm />} />
            <Route path="service-agreement" element={<MerchantServiceAgreement />} />
            <Route index element={<Navigate to='profile' />} />
          </Route> */}

        </Route>
      </Route>
    </Routes>
  );
};

export default RoutesSystem;