import React, { useState } from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceUploader from "../../../../components/ComplianceUploader";

const FormThree = ({ handleNextStep, handlePrevStep }) => {
  const [formData, setFormData] = React.useState({
    memorandum_of_association: null,
    certificate_of_incorporation: null,
    cac: null,
  });

  const handleChange = (field, files) => {
    setFormData((prev) => ({
      ...prev,
      [field]: files[0],
    }));
  };

  return (
    <div className="max-w-[450px] ">
      <ComplianceHeader
        title="Business registration documents"
        subtitle="Please upload documents that are government issued, unedited and are JPG, JPEG, PNG or PDF file formats"
      />
      <ComplianceUploader
        label="Memorandum and Articles of Association"
        value={formData.memorandum_of_association}
        onChange={(e) => handleChange("memorandum_of_association", e.target.files)}
      />
      <ComplianceUploader
        label="Certificate of Incorporation"
        value={formData.certificate_of_incorporation}
        onChange={(e) => handleChange("certificate_of_incorporation", e.target.files)}
      />
      <ComplianceUploader
        label="CAC Status Report"
        value={formData.cac}
        onChange={(e) => handleChange("cac", e.target.files)}
      />

      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          onClick={handlePrevStep}
          className="bg-gray-200 w-full p-4 text-black text-[13px] rounded-md"
        >
          Go back
        </button>
        <button
          onClick={() => handleNextStep(formData)}
          className={`${(!formData.memorandum_of_association || !formData.certificate_of_incorporation || !formData.cac) ? 'bg-priColor/35' : 'bg-priColor'} w-full p-4 text-white text-[13px] rounded-md`}
          disabled={!formData.memorandum_of_association || !formData.certificate_of_incorporation || !formData.cac}
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormThree;
