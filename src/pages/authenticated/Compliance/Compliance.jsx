import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTitle from "@/services/hooks/useTitle";
import useAuth from "@/services/hooks/useAuth";
import FormOne from "./component/FormOne";
import FormTwo from "./component/FormTwo";
import FormThree from "./component/FormThree";
import FormFour from "./component/FormFour";
import FormFive from "./component/FormFive";
import ComplianceService from "@/services/api/complianceApi";
import useAxiosPrivate from "../../../services/hooks/useFormAxios";
import { complianceStep } from "../../../redux/slices/complianceSlice";
import { useNavigate } from "react-router-dom";

const Compliance = () => {
  const { setAppTitle } = useTitle();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { complianceData, step, businessRepresentatives } =
    useSelector((state) => state.compliance);
  const complianceService = new ComplianceService(axiosPrivate);
  const [editOwnerIndex, setEditOwnerIndex] = useState(null);
  const dispatch = useDispatch();
  const user = auth?.data.merchants[0];

  useEffect(() => {
    setAppTitle("Compliance");
    if (complianceData.progress === 5) {
      navigate("/success");
    }
  }, [complianceData, navigate]);

  const handleNextStep = async (val, next) => {
    const progress = complianceData.progress;

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
  }, [dispatch]);

  return (
    <div className="">
      <div className="flex border-0 border-b-1 mb-4 p-1">
        <h3 className="text-[18px] font-bold ">Activate your account</h3>
      </div>
      <div className="p-2 m--0 relative ">
        <div className="absolute top-[-1px] sm:top-4 left-[70%] md:left-0   bg-amber-300 px-2 py-1 rounded-md ">
          Step {step + 1} of 5
        </div>

        <div className="flex justify-center mt-5 md:mt-0">
          {/* {steps[step]} */}

          {step === 0 && <FormOne handleNextStep={handleNextStep} />}
          {step === 1 && (
            <FormTwo
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
            />
          )}
          {step === 2 && (
            <FormThree
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
            />
          )}
          {step === 3 && (
            <FormFour
              handlePrevStep={handlePrevStep}
              handleNextStep={handleNextStep}
              editRepresentativeData={
                editOwnerIndex !== null
                  ? businessRepresentatives[editOwnerIndex]
                  : null
              }
            />
          )}
          {step === 4 && (
            <FormFive
              handlePrevStep={handlePrevStep}
              handleNextStep={handleNextStep}
              handleEditRepresentative={handleEditRepresentative}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Compliance;
