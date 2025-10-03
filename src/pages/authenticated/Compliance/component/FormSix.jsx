import { useEffect, useMemo, useRef } from "react";
import Spinner from "@/components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import ComplianceService from "@/services/api/complianceApi";
import useAxiosPrivate from "../../../../services/hooks/useFormAxios";
import useAuth from "@/services/hooks/useAuth";
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    const maybeStartVerification = async () => {
      if (
        complianceData?.progress === 6 &&
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
          navigate("/success");
        }
      } else if (['under_review', 'approved'].includes(complianceStatus)) {
        // If already under review or approved, just navigate away (safety)
        navigate('/success');
      }
    };
    maybeStartVerification();
  }, [
    complianceData?.progress,
    complianceStatus,
    complianceService,
    dispatch,
    navigate,
    user?.merchantCode,
  ]);
  if (complianceLoading)
    return (
      <div className="h-[50vh] w-full">
        <Spinner />
      </div>
    );
  return (
    <div>
      <div className="max-w-[450px] "></div>
    </div>
  );
};

export default FormSeven;
