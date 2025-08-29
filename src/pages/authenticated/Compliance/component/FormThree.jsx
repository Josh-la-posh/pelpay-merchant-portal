import { useState } from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceUploader from "../../../../components/ComplianceUploader";
import { useSelector } from "react-redux";

const FormThree = ({ handleNextStep, handlePrevStep }) => {
  const { complianceData } = useSelector((state) => state.compliance);
  const initialData = complianceData?.documents;

  const [formData, setFormData] = useState({
    director_id:
      initialData?.find(
        (doc) => doc?.documentType === "director_id"
      )?.originalName || null,
    certificate_of_incorporation:
      initialData?.find(
        (doc) => doc?.documentType === "certificate_of_incorporation"
      )?.originalName || null,
    status_report:
      initialData?.find((doc) => doc?.documentType === "status_report")
        ?.originalName || null,
    progress: complianceData?.progress || 2
  });

  const handleChange = (field, files) => {
    setFormData((prev) => ({
      ...prev,
      [field]: files[0],
    }));
  };

  const handleSubmit = async () => {
    const newFormData = new FormData();

    if (formData.director_id)
      newFormData.append(
        "director_id",
        formData.director_id
      );
    if (formData.certificate_of_incorporation)
      newFormData.append(
        "certificate_of_incorporation",
        formData.certificate_of_incorporation
      );
    if (formData.status_report)
      newFormData.append("status_report", formData.status_report);    
    if (formData.progress === 2) newFormData.append("progress", 3)
       
  

    handleNextStep(newFormData);
  };

  return (
    <div className="max-w-[450px] ">
      <ComplianceHeader
        title="Business registration documents"
        subtitle="Please upload documents that are government issued, unedited and are JPG, JPEG, PNG or PDF file formats"
      />
      <ComplianceUploader
        label="Memorandum and Articles of Association"
        value={formData?.director_id ?? formData?.director_id?.name}
        onChange={(e) =>
          handleChange("director_id", e.target.files)
        }
      />
      <ComplianceUploader
        label="Certificate of Incorporation"
        value={formData?.certificate_of_incorporation ?? formData?.certificate_of_incorporation?.name}
        onChange={(e) =>
          handleChange("certificate_of_incorporation", e.target.files)
        }
      />
      <ComplianceUploader
        label="CAC Status Report"
        value={formData?.status_report || formData?.status_report?.name}
        onChange={(e) => handleChange("status_report", e.target.files)}
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
            !formData.director_id ||
            !formData.certificate_of_incorporation ||
            !formData.status_report
              ? "bg-priColor/35"
              : "bg-priColor"
          } w-full p-4 text-white text-[13px] rounded-md`}
          disabled={
            !formData.director_id ||
            !formData.certificate_of_incorporation ||
            !formData.status_report
          }
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormThree;
