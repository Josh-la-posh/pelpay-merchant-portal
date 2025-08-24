import React, { useState } from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";
import ComplianceTextArea from "../../../../components/ComplianceTextArea";
import ComplianceInputSelect from "../../../../components/ComplianceInputSelect";

const FormOne = ({ handleNextStep }) => {
  const [formData, setFormData] = useState({
    businessName: "",
    tradingName: "",
    description: "",
    category: "",
    salesVolume: "",
    website: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="max-w-[450px]">
      <ComplianceHeader
        title="Hi Demi, let's setup your account real quick"
        subtitle="As a regulated financial services company, we would need to verify your identification and business registration information."
      />

      <ComplianceInput
        label="What is your legal business name?"
        type="text"
        value={formData.businessName}
        onChange={(e) => handleChange("businessName", e.target.value)}
      />

      <ComplianceInput
        label="Trading name"
        type="text"
        value={formData.tradingName}
        onChange={(e) => handleChange("tradingName", e.target.value)}
      />

      <ComplianceTextArea
        label="Business description"
        type="text"
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
        type="text"
        value={formData.salesVolume}
        onChange={(e) => handleChange("salesVolume", e.target.value)}
      />

      <ComplianceInput
        label="Website"
        type="text"
        value={formData.website}
        onChange={(e) => handleChange("website", e.target.value)}
      />

      <button
        onClick={() => handleNextStep(formData)}
        className="bg-priColor w-full p-2 text-white text-[13px] rounded-md mt-3"
      >
        Save and continue
      </button>
    </div>
  );
};

export default FormOne;
