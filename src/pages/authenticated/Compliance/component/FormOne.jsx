import React, { useState } from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";
import ComplianceTextArea from "../../../../components/ComplianceTextArea";
import ComplianceInputSelect from "../../../../components/ComplianceInputSelect";

const FormOne = ({ handleNextStep }) => {
  const [err, setErr] = useState([
    '',
    '',
    '',
    ''
  ])
  const [formData, setFormData] = useState({
    legalBusinessName: "",
    tradingName: "",
    description: "",
    category: "individual",
    salesVolume: "",
    website: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const newErrors = ["", "", "", ""];
    if (formData.legalBusinessName.length < 3) newErrors[0] = 'Business name must be greater than 2 characters';
    if (formData.tradingName.length < 3) newErrors[1] = 'Trading name must be greater than 2 characters';
    if (formData.description.length < 100) newErrors[2] = 'Business description must be greater than 100 characters';
    if (formData.website.length < 3) newErrors[3] = 'Website must be a valid website';

    setErr(newErrors)

    if (newErrors.every((e) => e === '')) {
      handleNextStep(formData)
    }
  }

  return (
    <div className="max-w-[450px]">
      <ComplianceHeader
        title="Hi Demi, let's setup your account real quick"
        subtitle="As a regulated financial services company, we would need to verify your identification and business registration information."
      />

      <ComplianceInput
        label="What is your legal business name?"
        type="text"
        errMsg={err[0]}
        value={formData.legalBusinessName}
        onChange={(e) => handleChange("legalBusinessName", e.target.value)}
      />

      <ComplianceInput
        label="Trading name"
        type="text"
        errMsg={err[1]}
        value={formData.tradingName}
        onChange={(e) => handleChange("tradingName", e.target.value)}
      />

      <ComplianceTextArea
        label="Business description"
        type="text"
        errMsg={err[2]}
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        minLength={100}
      />

      <ComplianceInputSelect
        label="Business category"
        options={[
          { value: "individual", label: "Individual" },
          { value: "company", label: "Company" },
        ]}
        value={formData.category}
        onChange={(e) => handleChange("category", e.target.value)}
      />

      <ComplianceInput
        label="Projected sales volume"
        type="number"
        value={formData.salesVolume}
        onChange={(e) => handleChange("salesVolume", e.target.value)}
      />

      <ComplianceInput
        label="Website"
        type="text"
        errMsg={err[3]}
        value={formData.website}
        onChange={(e) => handleChange("website", e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className={`${(!formData.legalBusinessName || !formData.category || !formData.description || !formData.salesVolume || !formData.tradingName) ? 'bg-priColor/35' : 'bg-priColor'} w-full p-2 text-white text-[13px] rounded-md mt-3`}
        disabled={!formData.legalBusinessName || !formData.category || !formData.description || !formData.salesVolume || !formData.tradingName}
      >
        Save and continue
      </button>
    </div>
  );
};

export default FormOne;
