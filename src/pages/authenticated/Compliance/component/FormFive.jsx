import { useEffect, useState } from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import useAuth from "@/services/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import ComplianceService from "@/services/api/complianceApi";
import useAxiosPrivate from "@/services/hooks/useFormAxios";

const FormFive = ({
  handlePrevStep,
  handleNextStep,
  representativeDatas = [],
  setBusinessRepresentative,
  handleEditRepresentative,
}) => {
  const { auth } = useAuth();
  const user = auth?.data;
  const complianceState = useSelector((state) => state.compliance);
  const { complianceData } = complianceState;

  const [newData, setNewData] = useState(representativeDatas);
  const [progressValue, SetProgressValue] = useState(4)



  const formDataAxiosPrivate = useAxiosPrivate();
  const complianceService = new ComplianceService(formDataAxiosPrivate);
  const dispatch = useDispatch();

  const initialData = complianceData?.owners;


  const existingRecord = Array.isArray(initialData)
    ? initialData[0]
    : initialData || {};

  const handleSubmit = async () => {
    try {
      const finalFormData = new FormData();
      finalFormData.append("owners", JSON.stringify(representativeDatas));
      if(progressValue === 4) finalFormData.append("progress", 5)
      
      handleNextStep(finalFormData);

     
    } catch (error) {
      console.error("Error saving compliance reps:", error);
    }
  };

  useEffect(() => {
    if (initialData !== null) {
      setNewData(initialData);
      setBusinessRepresentative(initialData)
      
      SetProgressValue(complianceData.progress)
      
      
    }
    else{
      setNewData(representativeDatas);
    }
  },[initialData]);

  return (
    <div className="max-w-[450px] ">
      <ComplianceHeader
        title="Tell us about the business representative"
        subtitle="A business representative is either an owner, director or shareholder of your business."
      />

      {newData?.map((rep, index) => (
        <div
          key={index}
          className="grid grid-cols-7  border-b py-3 items-center "
        >
          <div className="col-span-2">
            <p className="text-[10px] md:text-[13px] text-gray-800">
              {rep.firstName} {rep.lastName}
            </p>
          </div>

          {rep.role ? (
            <div className="col-span-2 ">
              <p className="text-[11px] text-gray-600">{rep.role}</p>
            </div>
          ) : (
            <div className="col-span-2">
              <p className="text-[11px] text-gray-600">No role information</p>
            </div>
          )}

          {rep.percentOfBusiness ? (
            <div className="col-span-2  ">
              <p className=" text-[9px] md:text-[11px] text-gray-600">
                {rep.percentOfBusiness}% of ownership
              </p>
            </div>
          ) : (
            <div className="col-span-2"></div>
          )}

          <div className="col-span-1">
            <button
              className="text-blue-800 text-[11px]"
              onClick={() => handleEditRepresentative(index)}
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handlePrevStep}
        className="text-blue-600 mt-3 text-[11px]"
      >
        Add additional owners, directors or shareholders
      </button>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          onClick={handlePrevStep}
          className="bg-gray-200 w-full p-4 text-black text-[13px] rounded-md"
        >
          Go back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-priColor w-full p-4 text-white text-[13px] rounded-md "
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormFive;
