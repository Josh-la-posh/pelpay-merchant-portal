import React from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceUploader from "../../../../components/ComplianceUploader";

const FormThree = ({ handleNextStep, handlePrevStep }) => {
  return (
    <div className="max-w-[450px] ">
      <ComplianceHeader
        title="Business registration documents"
        subtitle="Please upload documents that are government issued, unedited and are JPG, JPEG, PNG or PDF file formats"
      />
      <ComplianceUploader label="Memorandum and Articles of Association" />
      <ComplianceUploader label="Certificate of Incorporation" />
      <ComplianceUploader label="CAC Status Report" />

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

export default FormThree;
