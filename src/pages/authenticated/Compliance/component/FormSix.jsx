import { useEffect, useMemo, useRef, useState } from "react";
import Spinner from "@/components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import ComplianceService from "@/services/api/complianceApi";
import useAxiosPrivate from "../../../../services/hooks/useFormAxios";
import useAuth from "@/services/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { complianceSuccess } from '@/redux/slices/complianceSlice';
const FormSeven = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const user = auth?.data.merchants[0];
  const { complianceData, complianceLoading, complianceStatus } = useSelector(
    (state) => state.compliance
  );
  const complianceService = useMemo(
    () => new ComplianceService(axiosPrivate),
    [axiosPrivate]
  );
  const startedRef = useRef(false);
  const [redirectCountdown, setRedirectCountdown] = useState(null); // null until verification starts

  useEffect(() => {
    const maybeStartVerification = async () => {
      if (
        complianceData?.progress === 6 && // user has completed all data entry steps
        !['under_review', 'approved'].includes(complianceStatus) &&
        !startedRef.current
      ) {
        startedRef.current = true; // prevent duplicate calls in same session
        const response = await complianceService.startComplianceVerification(
          user?.merchantCode,
          dispatch
        );
        const data = response?.data;
        if (data?.message === "success") {
          // Manually bump progress to 7 (final state) so UI reflects completed submission
          // Preserve existing complianceData fields while updating progress.
          dispatch(
            complianceSuccess({
              ...(complianceData || {}),
              progress: 7,
              complianceStatus: 'under_review', // ensure status consistency
            })
          );
          // Start 5s countdown instead of immediate navigation
          setRedirectCountdown(5);
        }
      } else if (['under_review', 'approved'].includes(complianceStatus)) {
        // If already under review or approved, just navigate away (safety)
        if (redirectCountdown === null) navigate('/success');
      }
    };
    maybeStartVerification();
  }, [
    complianceData, // include whole object so progress/status changes retrigger
    complianceStatus,
    complianceService,
    dispatch,
    navigate,
    user?.merchantCode,
    redirectCountdown,
  ]);

  // Countdown effect
  useEffect(() => {
    if (redirectCountdown === null) return; // not started yet
    if (redirectCountdown <= 0) {
      navigate('/success');
      return;
    }
    const id = setTimeout(() => setRedirectCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [redirectCountdown, navigate]);
  if (complianceLoading)
    return (
      <div className="h-[50vh] w-full">
        <Spinner />
      </div>
    );
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[160px] text-center p-6">
      {redirectCountdown !== null ? (
        <div>
          <h2 className="text-lg font-semibold mb-2">Submitting for review…</h2>
          <p className="text-sm text-gray-600 mb-4">
            Your compliance documents have been sent. Redirecting to status page in{' '}
            <span className="font-bold">{redirectCountdown}s</span>.
          </p>
          <div className="flex justify-center">
            <Spinner />
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-2">Starting verification…</h2>
          <p className="text-sm text-gray-600">Please wait while we initiate your compliance review.</p>
          <div className="flex justify-center mt-4">
            <Spinner />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSeven;
