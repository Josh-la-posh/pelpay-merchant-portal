import React, { useState, useEffect } from "react";
import useTitle from "@/services/hooks/useTitle";
import useAuth from "@/services/hooks/useAuth";
import FormOne from "./component/FormOne";
import FormTwo from "./component/FormTwo";
import FormThree from "./component/FormThree";
import FormFour from "./component/FormFour";
import FormFive from "./component/FormFive";
import { useNavigate } from "react-router-dom";


const Compliance = () => {
  const { setAppTitle } = useTitle();
  const { auth } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(0);
  const [businessRepresentative, setBusinessRepresentative] = useState([]);
  const [editRepresentative, setEditRepresentative] = useState(null);

  const user = auth?.data.user;

  useEffect(() => {
    setAppTitle("Compliance");
  }, []);
  const handleNextStep = (val) => {
    console.log("The result is: ", val);
    setStep((prevStep) => prevStep + 1);
  };
  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };
  const handleEditRepresentative = (index) => {
    setEditRepresentative(index);
    setStep(3);
  };

  const navigate = useNavigate();

  const handleCloseButton=()=>{
    setIsOpen(false);
    navigate('/')
  }

  const businessRepresentativeData = (representativeData) => {
    if (editRepresentative !== null) {
      const updated = [...businessRepresentative];
      updated[editRepresentative] = representativeData;
      setBusinessRepresentative(updated);
      setEditRepresentative(null);
    } else {
      setBusinessRepresentative([
        ...businessRepresentative,
        representativeData,
      ]);
    }

    setStep(4);
  };

  const steps = [
    <FormOne handleNextStep={handleNextStep} />,
    <FormTwo handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />,
    <FormThree
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
    />,
    <FormFour
      handleNextStep={handleNextStep}
      handlePrevStep={handlePrevStep}
      handleSave={businessRepresentativeData}
      editRepresentativeData={
        editRepresentative !== null
          ? businessRepresentative[editRepresentative]
          : null
      }
    />,
    <FormFive
      handlePrevStep={handlePrevStep}
      representativeDatas={businessRepresentative || []}
      handleEditRepresentative={handleEditRepresentative}
    />,
  ];

  return (
    <div className="">
      <div className="flex border-0 border-b-1  justify-between items-center mb-4 p-1">
        <div>
          <h3 className="text-[18px] font-bold ">Activate your account</h3>
        </div>

        <div>
          <button className="bg-gray-200 w-full py-3 px-5 text-black text-[13px] rounded-md" onClick={handleCloseButton}>
            Close
          </button>
        </div>
      </div>
      <div className="p-2 m--0 relative ">
        <div className="absolute top-[-1px] sm:top-4 left-[70%] md:left-0   bg-amber-300 px-2 py-1 rounded-md ">
          Step {step + 1} of {steps.length}
        </div>

        <div className="flex justify-center mt-5 md:mt-0">{steps[step]}</div>
      </div>
    </div>
  );
};

export default Compliance;
