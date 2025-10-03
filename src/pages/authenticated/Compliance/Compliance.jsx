import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTitle from "@/services/hooks/useTitle";
import useAuth from "@/services/hooks/useAuth";
// Step components and configuration
import { COMPLIANCE_STEPS, TOTAL_STEPS } from './stepsConfig';
import ComplianceStepper from './component/ComplianceStepper';
import ComplianceService from "@/services/api/complianceApi";
import useAxiosPrivate from "../../../services/hooks/useFormAxios";
import { complianceStep } from "../../../redux/slices/complianceSlice";
import { useNavigate } from 'react-router-dom';

const Compliance = () => {
  const { setAppTitle } = useTitle();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { complianceData, step, businessRepresentatives, complianceStatus } =
    useSelector((state) => state.compliance);
  const navigate = useNavigate();
  // Redirect guard: if approved, send to dashboard. If under_review, send to success page.
  useEffect(() => {
    if (complianceStatus === 'approved') {
      navigate('/', { replace: true });
    } else if (complianceStatus === 'under_review') {
      navigate('/success', { replace: true });
    }
  }, [complianceStatus, navigate]);
  const complianceService = useMemo(() => new ComplianceService(axiosPrivate), [axiosPrivate]);
  const [editOwnerIndex, setEditOwnerIndex] = useState(null);
  const dispatch = useDispatch();
  const user = auth?.data.merchants[0];

  useEffect(() => {
    setAppTitle("Compliance");
  }, [ setAppTitle]);

  const handleNextStep = async (val, next) => {
    const progress = complianceData?.progress;

    if (next) {
      dispatch(complianceStep(step + 1));
    } else {
      if (progress > 0) {
        await complianceService.updateComplianceData(
          user?.merchantCode,
          val,
          dispatch
        );
      } else {
        await complianceService.complianceUpload(
          user?.merchantCode,
          val,
          dispatch
        );
      }
    }
  };

  const handlePrevStep = () => {
    if (step === 0) return;
    dispatch(complianceStep(step - 1));
  };

  const handleEditRepresentative = (index) => {
    setEditOwnerIndex(index);
    dispatch(complianceStep(3));
  };

  useEffect(() => {
    const loadData = async () => {
      await complianceService.fetchComplianceData(dispatch, user?.merchantCode);
    };

    loadData();
  }, [dispatch, complianceService, user?.merchantCode]);

  return (
    <div className="">
      <div className="flex border-0 border-b-1 mb-4 p-1">
        <h3 className="text-[18px] font-bold ">Activate your account</h3>
      </div>
      <div className="p-2 m--0 relative ">
        <div className="absolute top-[-1px] sm:top-4 left-[70%] md:left-0 bg-amber-300 px-2 py-1 rounded-md">
          Step {step + 1} of {TOTAL_STEPS}
        </div>
        <div className="mt-10 md:mt-6">
          <ComplianceStepper current={step} total={TOTAL_STEPS} steps={COMPLIANCE_STEPS} />
        </div>

        <div className="flex justify-center mt-5 md:mt-0">
          {/* {steps[step]} */}

          {COMPLIANCE_STEPS.map((cfg, idx) => {
            if (idx !== step) return null;
            const StepComp = cfg.component;
            // Additional props routing for specific steps
            if (cfg.key === 'representative') {
              return (
                <StepComp
                  key={cfg.key}
                  handlePrevStep={handlePrevStep}
                  handleNextStep={handleNextStep}
                  editRepresentativeData={
                    editOwnerIndex !== null
                      ? businessRepresentatives[editOwnerIndex]
                      : null
                  }
                />
              );
            }
            if (cfg.key === 'owners') {
              return (
                <StepComp
                  key={cfg.key}
                  handlePrevStep={handlePrevStep}
                  handleNextStep={handleNextStep}
                  handleEditRepresentative={handleEditRepresentative}
                />
              );
            }
            if (cfg.key === 'contact_emails') {
              return (
                <StepComp
                  key={cfg.key}
                  handlePrevStep={handlePrevStep}
                  handleNextStep={handleNextStep}
                  existingData={complianceData}
                />
              );
            }
            return (
              <StepComp
                key={cfg.key}
                handlePrevStep={idx > 0 ? handlePrevStep : undefined}
                handleNextStep={handleNextStep}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Compliance;
