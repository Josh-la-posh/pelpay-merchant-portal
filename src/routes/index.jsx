import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayouts';
import RequireAuth from '../services/hooks/RequiredAuth';

// unauthenticated pages
const LoginPage = lazy(() => import('../pages/unauthenticated/Login/LoginPage'));
const RegisterPage = lazy(() => import('../pages/unauthenticated/Register/RegisterPage'));
const ResetPasswordPage = lazy(() => import('../pages/unauthenticated/ResetPassword/ResetPasswordPage'));
const ForgotPasswordPage = lazy(() => import('../pages/unauthenticated/ForgotPassword/ForgotPasswordPage'));
const VerifyEmailPage = lazy(() => import('../pages/unauthenticated/VerifyEmail/VerifyEmailPage'));

// authenticated layouts
const SettingsLayout = lazy(() => import('../layouts/SettingsLayout'));
const MerchantLayout = lazy(() => import('../layouts/MerchantLayout'));

// authenticated pages (lazy)
const Dashboard = lazy(() => import('../pages/authenticated/Dashboard/Dashboard'));
const AnalyticsDetailPage = lazy(() => import('../pages/authenticated/Dashboard/component/AnalyticsDetailPage'));
const DisputeDashboard = lazy(() => import('../pages/authenticated/Dashboard/component/DisputeDashboard'));
const CustomersPage = lazy(() => import('../pages/authenticated/Customers/Customers'));
const DisputesPage = lazy(() => import('../pages/authenticated/Disputes/Disputes'));
const Aggregator = lazy(() => import('../pages/authenticated/Aggregator/Aggregator'));
const MerchantPage = lazy(() => import('../pages/authenticated/Merchant/Merchant'));
const AllSettlement = lazy(() => import('../pages/authenticated/Settlement/AllSettlement'));
const InvoicesPage = lazy(() => import('../pages/authenticated/Invoices/Invoices'));
const TransactionPage = lazy(() => import('../pages/authenticated/Transaction/Transaction'));
const HelpCenter = lazy(() => import('../pages/authenticated/HelpCenter/HelpCenter'));
const SettlementConfiguration = lazy(() => import('../pages/authenticated/Settlement/Configuration'));
const SettlementBankAccount = lazy(() => import('../pages/authenticated/Settlement/BankAccount'));
const SettlementBatchTransaction = lazy(() => import('../pages/authenticated/Settlement/SettlementBatchTransaction'));
const ActivityPage= lazy(() => import('../pages/authenticated/Activity/Activity'));

// merchant pages
const AddMerchantPage = lazy(() => import('../pages/authenticated/Merchant/AddMerchant'));
const MerchantProfile = lazy(() => import('../pages/authenticated/Merchant/MerchantProfile'));
const MerchantProfileUpdate = lazy(() => import('../pages/authenticated/Merchant/ProfileUpdate'));
const MerchantDomain = lazy(() => import('../pages/authenticated/Merchant/MerchantDomain'));
const MerchantDocument = lazy(() => import('../pages/authenticated/Merchant/MerchantDocument'));
const MerchantCredential = lazy(() => import('../pages/authenticated/Merchant/MerchantCredentials'));

// settings
const ProfilePage = lazy(() => import('../pages/authenticated/Settings/Profile'));
const SecuritySettings = lazy(() => import('../pages/authenticated/Settings/SecuritySettingsPage'));
const NotificationSettings = lazy(() => import('../pages/authenticated/Settings/NotificationSettingsPage'));
const PrivacySettings = lazy(() => import('../pages/authenticated/Settings/PrivacySettings'));
const ContactPage = lazy(() => import('../pages/authenticated/Settings/Contact'));
const UserManagement = lazy(() => import('../pages/authenticated/Settings/UserManagement'));
const RolesAndPermission = lazy(() => import('../pages/authenticated/Settings/Roles'));
const ManagePermission = lazy(() => import('../pages/authenticated/Settings/ManagePermission'));
const RoleAssignment = lazy(() => import('../pages/authenticated/Settings/RoleAssignment'));
const Branding = lazy(() => import('../pages/authenticated/Settings/Branding'));

// alias variables removed - use direct lazy imports where needed

const Compliance = lazy(() => import('../pages/authenticated/Compliance/Compliance'));
const SuccessPage = lazy(() => import('../pages/authenticated/SuccessPage'));

const RoutesSystem = () => {
  return (
    <Suspense fallback={<div className="p-6"></div>}>
      <Routes>

      {/* public routes */}

      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/reset-password' element={<ResetPasswordPage />} />
      <Route path='/verify-email' element={<VerifyEmailPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      {/* <Route path='/confirm-email' element={<ConfirmEmailPage />} /> */}
      {/* <Route path='/complete-registration' element={<RegisterMultiStepPage />} /> */}


      {/* protected routes */}

      <Route element={<RequireAuth />}>
        <Route path='/' element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} ></Route>
          <Route path='/analytics/total-processed-volume' element={<AnalyticsDetailPage mode="OVER_VIEW"/>}/>
          <Route path='/analytics/net-settled-volume' element={<AnalyticsDetailPage mode="NET_SETTLED"/>}/>
          <Route path='/analytics/average-transaction-value' element={<AnalyticsDetailPage mode="AVERAGE_TRANSACTION_VALUE"/>}/>
          <Route path='/analytics/transaction-count' element={<AnalyticsDetailPage mode="TRANSACTION_COUNT"/>}/>
          <Route path='/analytics/dispute-ratio' element={<DisputeDashboard/>}/>
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
              <Route path='branding' element={<Branding/>} />
            </Route>
          </Route>
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/compliance" element={<Compliance />} />


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
        <Route path="/success" element={<SuccessPage />} />
      </Route>
      </Routes>
    </Suspense>
  );
};

export default RoutesSystem;