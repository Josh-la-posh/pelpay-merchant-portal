import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { CheckCircle, Clock, RefreshCw, ArrowRight } from 'lucide-react';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import ComplianceService from '@/services/api/complianceApi';

const statusMessages = {
  pending: {
    title: 'Submission Received',
    note: 'You have submitted your compliance information. Please complete any remaining sections to proceed.'
  },
  under_review: {
    title: 'Submission Received',
    note: 'Your compliance documents have been submitted and are now under review. We typically complete reviews within 24 hours.'
  },
  rejected: {
    title: 'Action Required',
    note: 'Your submission was rejected. Please review the issues and resubmit your documents.'
  },
  approved: {
    title: 'Compliance Approved',
    note: 'Congratulations! Your account is now fully enabled. You can start processing live transactions.'
  },
  default: {
    title: 'Processing',
    note: 'Your documents are being processed. We will update your status shortly.'
  }
};

const SuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const { complianceStatus, complianceData } = useSelector(state => state.compliance || {});
  const auth = useSelector(state => state.auth?.data);
  const merchant = auth?.merchants ? auth?.merchants[0] : null;
  const [refreshing, setRefreshing] = useState(false);
  const [localStatus, setLocalStatus] = useState(complianceStatus || complianceData?.complianceStatus || 'pending');

  useEffect(() => {
    if (complianceStatus && complianceStatus !== localStatus) {
      setLocalStatus(complianceStatus);
    }
  }, [complianceStatus, localStatus]);

  const handleGoDashboard = () => navigate('/');
  const handleGoSettings = () => navigate('/settings/profile');
  const handleResumeCompliance = () => navigate('/compliance');

  const handleRefreshStatus = async () => {
    if (!merchant?.merchantCode) return;
    setRefreshing(true);
    try {
      const service = new ComplianceService(axiosPrivate);
      await service.fetchComplianceData(dispatch, merchant.merchantCode);
    } catch {
      // optional: toast error
    } finally {
      setRefreshing(false);
    }
  };

  const current = statusMessages[localStatus] || statusMessages.default;
  const isApproved = localStatus === 'approved';
  const isRejected = localStatus === 'rejected';
  const isUnderReview = localStatus === 'under_review';
  const isPending = localStatus === 'pending' || localStatus === 'started';

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100 p-8 relative overflow-hidden">
        <div className="absolute -right-14 -top-14 w-40 h-40 bg-emerald-100 rounded-full opacity-40" />
        <div className="absolute -left-10 -bottom-10 w-52 h-52 bg-emerald-50 rounded-full opacity-30" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            {isApproved ? (
              <CheckCircle className="text-green-600" size={40} />
            ) : (
              <Clock className="text-amber-500" size={40} />
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">{current.title}</h1>
              <p className="text-sm text-gray-500">Status: <span className="font-medium capitalize">{localStatus.replace('_',' ')}</span></p>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">{current.note}</p>

          {/* Next Steps */}
          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {isUnderReview && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold text-blue-700 mb-1">What happens next?</p>
                <p className="text-[11px] text-blue-700">A compliance specialist is reviewing your submission. You will receive an email once a decision is made.</p>
              </div>
            )}
            {isPending && (
              <div className="rounded-lg border border-yellow-100 bg-yellow-50 p-4">
                <p className="text-xs font-semibold text-yellow-700 mb-1">Finish Required Steps</p>
                <p className="text-[11px] text-yellow-700">Some sections appear incomplete. Return to the compliance wizard to finish and submit.</p>
              </div>
            )}
            {isRejected && (
              <div className="rounded-lg border border-red-100 bg-red-50 p-4 md:col-span-2">
                <p className="text-xs font-semibold text-red-700 mb-1">Submission Rejected</p>
                <p className="text-[11px] text-red-700">Please review the email sent to you for details. Correct the highlighted issues and resubmit your documents.</p>
              </div>
            )}
            {isApproved && (
              <div className="rounded-lg border border-green-100 bg-green-50 p-4 md:col-span-2">
                <p className="text-xs font-semibold text-green-700 mb-1">All Set!</p>
                <p className="text-[11px] text-green-700">Your account now has full access to live processing features and production API keys.</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleGoDashboard}
              className="flex items-center gap-2 bg-priColor text-white px-5 py-2.5 rounded-md text-sm font-medium shadow hover:opacity-90 transition"
            >
              Go to Dashboard <ArrowRight size={16} />
            </button>
            {isRejected && (
              <button
                onClick={handleResumeCompliance}
                className="text-sm font-medium px-5 py-2.5 rounded-md border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 transition"
              >
                Fix & Resubmit
              </button>
            )}
            {!isApproved && (
              <button
                onClick={handleRefreshStatus}
                disabled={refreshing}
                className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-md border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Checking...' : 'Refresh Status'}
              </button>
            )}
            {isApproved && (
              <button
                onClick={handleGoSettings}
                className="text-sm font-medium px-5 py-2.5 rounded-md border border-green-300 text-green-700 bg-green-50 hover:bg-green-100 transition"
              >
                View API Credentials
              </button>
            )}
          </div>

          <div className="mt-10 border-t pt-4">
            <p className="text-[11px] text-gray-400">If you have questions, reach out to support or reply to the compliance notification email you received.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
