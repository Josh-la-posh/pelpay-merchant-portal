import { useState, useEffect } from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";
import { useSelector } from "react-redux";

const FormTwo = ({ handleNextStep, handlePrevStep }) => {
  const { complianceData } = useSelector((state) => state.compliance);;
  const [err, setErr] = useState(["", ""]);  

  const initialData = complianceData;
  const [formData, setFormData] = useState({
    rcNumber: initialData?.businessInfo?.rcNumber || "",
    tin: initialData?.financialInfo?.tin || "",
    progress: complianceData?.progress || 1
  });
  
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (initialData !== null) {
      setFormData({
        rcNumber: initialData.businessInfo?.rcNumber || "",
        tin: initialData.financialInfo?.tin || "",
        progress: initialData.progress || 1
      });
    }
  }, [initialData]);


const handleSubmit = async () => {
    const newErrors = ["", ""];
    if (formData.rcNumber.length < 5 || formData.rcNumber.length > 10)
      newErrors[0] =
        "Registration number should be between 10 and 12 characters";
    if (formData.tin.length < 10 || formData.tin.length > 12)
      newErrors[1] =
        "Tax Identification number should be between 10 and 12 characters";
    setErr(newErrors);

    if (!newErrors.every((e) => e === "")) return;

    const newFormData = new FormData();
    if (formData.rcNumber) newFormData.append("rcNumber", formData.rcNumber);
    if (formData.tin) newFormData.append("tin", formData.tin);
    if (formData.progress === 1) newFormData.append("progress", 2)
    
    handleNextStep(newFormData);
  };

  return (
    <div className="max-w-[450px] ">
      <ComplianceHeader
        title="Enter your business registration information"
        subtitle="Provide your registered business details, so we can verify your business information."
      />

      <ComplianceInput
        label="Registration number"
        type="text"
        value={formData.rcNumber}
        minLength={10}
        maxLength={12}
        errMsg={err[0]}
        onChange={(e) => handleChange("rcNumber", e.target.value)}
      />

      <ComplianceInput
        label="Tax identification number"
        type="text"
        value={formData.tin}
        minLength={10}
        maxLength={12}
        errMsg={err[1]}
        onChange={(e) => handleChange("tin", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          onClick={handlePrevStep}
          className="bg-gray-200 w-full p-4 text-black text-[13px] rounded-md"
        >
          Go back
        </button>
        <button
          onClick={handleSubmit}
          className={`${
            !formData.rcNumber || !formData.tin
              ? "bg-priColor/35"
              : "bg-priColor"
          } w-full p-4 text-white text-[13px] rounded-md`}
          disabled={!formData.rcNumber || !formData.tin}
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormTwo;
