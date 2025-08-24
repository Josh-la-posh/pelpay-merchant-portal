import React from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";

const FormTwo = ({ handleNextStep, handlePrevStep }) => {
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
        onChange={(e) => handleChange("registrationNumber", e.target.value)}
      />

      <ComplianceInput
        label="Tax identification number"
        type="text"
        value={""}
        minLength={10}
        maxLength={12}
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
          onClick={handleNextStep}
          className="bg-priColor w-full p-4 text-white text-[13px] rounded-md "
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormTwo;
