import { useEffect, useMemo  } from "react";
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
  const { complianceData, complianceLoading } = useSelector(
    (state) => state.compliance
  );
  const complianceService = useMemo(
    () => new ComplianceService(axiosPrivate),
    [axiosPrivate]
  );
  useEffect(() => {
    const updateAndNavigate = async () => {
      // Final verification now occurs when latest data collection (email step) completed at progress 6
      if (complianceData?.progress === 6) {
        const response = await complianceService.startComplianceVerification(
          user?.merchantCode,
          dispatch
        );
        const data = response?.data;
        if (data?.message === "success") {
          navigate("/success");
        }
      }
    };
    updateAndNavigate();
  }, [
    complianceData,
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
