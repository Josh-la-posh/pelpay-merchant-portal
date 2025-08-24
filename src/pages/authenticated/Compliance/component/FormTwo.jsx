import React, { useState } from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";

const FormTwo = ({ handleNextStep, handlePrevStep }) => {
  const [err, setErr] = useState([
    '',
    ''
  ])
  const [formData, setFormData] = React.useState({
    registrationNumber: "",
    taxIdNumber: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const newErrors = ["", ""];
    if (formData.registrationNumber.length < 10 || formData.registrationNumber.length > 12) newErrors[0] = 'Registration number should be between 10 and 12 characters';
    if (formData.taxIdNumber.length < 10 || formData.taxIdNumber.length > 12) newErrors[1] = 'Tax Identification number should be between 10 and 12 characters';
    setErr(newErrors)

    if (newErrors.every((e) => e === '')) {
      handleNextStep(formData)
    }
  }
  return (
    <div className="max-w-[450px] ">
      <ComplianceHeader
        title="Enter your business registration information"
        subtitle="Provide your registered business details, so we can verify your business information."
      />

      <ComplianceInput
        label="Registration number"
        type="text"
        value={formData.registrationNumber}
        minLength={10}
        maxLength={12}
        errMsg={err[0]}
        onChange={(e) => handleChange("registrationNumber", e.target.value)}
      />

      <ComplianceInput
        label="Tax identification number"
        type="text"
        value={formData.taxIdNumber}
        minLength={10}
        maxLength={12}
        errMsg={err[1]}
        onChange={(e) => handleChange("taxIdNumber", e.target.value)}
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
          className={`${(!formData.registrationNumber || !formData.taxIdNumber) ? 'bg-priColor/35' : 'bg-priColor'} w-full p-4 text-white text-[13px] rounded-md`}
          disabled={!formData.registrationNumber || !formData.taxIdNumber}
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormTwo;
