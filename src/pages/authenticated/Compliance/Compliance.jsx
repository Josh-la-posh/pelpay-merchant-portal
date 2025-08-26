import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTitle from "@/services/hooks/useTitle";
import useAuth from "@/services/hooks/useAuth";
import FormOne from "./component/FormOne";
import FormTwo from "./component/FormTwo";
import FormThree from "./component/FormThree";
import FormFour from "./component/FormFour";
import FormFive from "./component/FormFive";
import { useNavigate } from "react-router-dom";
import ComplianceService from "@/services/api/complianceApi";
import useAxiosPrivate from "../../../services/hooks/useFormAxios";
import Spinner from "@/components/Spinner";
import { complianceStep } from "../../../redux/slices/complianceSlice";
const Compliance = () => {
  const { setAppTitle } = useTitle();
  const { auth } = useAuth();

  const [isOpen, setIsOpen] = useState(true);

  const [businessRepresentative, setBusinessRepresentative] = useState([]);

  const complianceState = useSelector((state) => state.compliance);
  const { complianceData, complianceLoading, complianceSuccess, step } =
    complianceState;

  const axiosPrivate = useAxiosPrivate();
  const complianceService = new ComplianceService(axiosPrivate);

  const [editOwnerIndex, setEditOwnerIndex] = useState(null);

  const dispatch = useDispatch();

  const user = auth?.data.merchants[0];

  console.log("Compliance Step: ", step);

  useEffect(() => {
    console.log("Compliance data fetched successfully:", complianceData);
  }, [complianceSuccess]);

  useEffect(() => {
    setAppTitle("Compliance");
  }, []);

  const handleNextStep = (val) => {
    dispatch(complianceStep(step + 1));
  };

  const handlePrevStep = () => {
    if (step === 0) return;
    dispatch(complianceStep(step - 1));
  };

  const handleEditRepresentative = (index) => {
    setEditOwnerIndex(index);
    dispatch(complianceStep(3));
  };

  const navigate = useNavigate();

  const handleCloseButton = () => {
    setIsOpen(false);
    navigate("/");
  };

  const businessRepresentativeData = (representativeData) => {
    if (editOwnerIndex !== null) {
      const updated = [...businessRepresentative];
      updated[editOwnerIndex] = representativeData;
      setBusinessRepresentative(updated);
      setEditOwnerIndex(null);
    } else {
      setBusinessRepresentative([
        ...businessRepresentative,
        representativeData,
      ]);
    }

    handleNextStep();
  };

  const handleSaveStep = async (formData) => {
    try {
      if (step > 0) {
        await complianceService.updateComplianceData(
          dispatch,
          user?.merchantCode,
          formData
        );
      } else {
        await complianceService.complianceUpload(
          dispatch,
          user?.merchantCode,
          formData
        );
      }

      handleNextStep();
    } catch (error) {
      console.error("Error saving compliance data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // console.log("Compliance data fetched", user);
      await complianceService.fetchComplianceData(dispatch, user?.merchantCode);
    };

    loadData();
  }, [dispatch]);

  if (complianceLoading)
    return (
      <div className="h-[40vh] w-full">
        <Spinner />
      </div>
    );
  return (
    <div className="">
      <div className="flex border-0 border-b-1  justify-between items-center mb-4 p-1">
        <div>
          <h3 className="text-[18px] font-bold ">Activate your account</h3>
        </div>

        <div>
          <button
            className="bg-gray-200 w-full py-3 px-5 text-black text-[13px] rounded-md"
            onClick={handleCloseButton}
          >
            Close
          </button>
        </div>
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
              handleSaveStep={handleSaveStep}
              merchantCode={user?.merchantCode}
            />
          )}
          {step === 3 && (
            <FormFour
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              handleSave={businessRepresentativeData}
              editOwnerIndex={editOwnerIndex}
              editRepresentativeData={
                editOwnerIndex !== null
                  ? businessRepresentative[editOwnerIndex]
                  : null
              }
            />
          )}
          {step === 4 && (
            <FormFive
              handlePrevStep={handlePrevStep}
              representativeDatas={businessRepresentative || []}
              handleEditRepresentative={handleEditRepresentative}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Compliance;
