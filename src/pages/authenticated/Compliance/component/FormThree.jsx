import React, { useState, useEffect } from "react";
import useAuth from "@/services/hooks/useAuth";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceUploader from "../../../../components/ComplianceUploader";
import { useDispatch, useSelector } from "react-redux";
import ComplianceService from "@/services/api/complianceApi";
import useAxiosPrivate from "@/services/hooks/useFormAxios";

const FormThree = ({
  handleNextStep,
  handlePrevStep,
  handleSaveStep,
  merchantCode,
}) => {
  const { auth } = useAuth();
  const user = auth?.data;

  const { complianceData, step } = useSelector((state) => state.compliance);
  // console.log("Compliance Data in form 3: ", complianceData);

  const initialData = complianceData?.documents;
  // console.log("Initial Data in form 3: ", initialData);

  const formDataAxiosPrivate = useAxiosPrivate();
  const complianceService = new ComplianceService(formDataAxiosPrivate);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    memorandum_of_association:
      initialData?.find(
        (doc) => doc?.documentType === "memorandum_of_association"
      )?.originalName || null,
    certificate_of_incorporation:
      initialData?.find(
        (doc) => doc?.documentType === "certificate_of_incorporation"
      )?.originalName || null,
    status_report:
      initialData?.find((doc) => doc?.documentType === "status_report")
        ?.originalName || null,
  });

  // console.log("Form Data 3: ", formData);

  const handleChange = (field, files) => {
    setFormData((prev) => ({
      ...prev,
      [field]: files[0],
    }));
    console.log("Files: ", files[0]);
    console.log("Formdata", formData);
  };

   const handleFileChange = (field, files) => {
    setFormData({ ...formData, [field]: files[0] });
  };

  // const existingRecord = Array.isArray(initialData)
  //   ? initialData[0]
  //   : initialData || {};

  // console.log("Existing Record 3: ", existingRecord);

  const handleSubmit = async () => {
    const newFormData = new FormData();
    if (formData.memorandum_of_association)
      newFormData.append(
        "memorandum_of_association",
        formData.memorandum_of_association
      );
    if (formData.certificate_of_incorporation)
      newFormData.append(
        "certificate_of_incorporation",
        formData.certificate_of_incorporation
      );
    if (formData.status_report)
      newFormData.append("status_report", formData.status_report);

    try {
      const newFormData = new FormData();
      
    
      Object.keys(formData).forEach(key => {
        if (formData[key] && key !== 'documents') {
          newFormData.append(key, formData[key]);
        }
      });

    
      if (formData.documents) {
        newFormData.append('ownerDocument', formData.documents);
      }

      await handleSaveStep(newFormData);
    } catch (error) {
      console.error("Error saving form three:", error);
    }
    // try {
    //   // if (Object.keys(initialData || {}).length > 0)
    //   if (existingRecord)
    //      {
    //     await complianceService.updateComplianceData(
    //       newFormData,
    //       dispatch,
    //       user?.merchants[0]?.merchantCode
    //     );
    //     console.log("Updated compliance record 3:");
    //   } else {
    //     await complianceService.complianceUpload(
    //       user?.merchants[0]?.merchantCode,
    //       newFormData,
    //       dispatch
    //     );
    //     console.log("Uploaded compliance record 3:");
    //   }

    //   handleNextStep(formData);
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <div className="max-w-[450px] ">
      <ComplianceHeader
        title="Business registration documents"
        subtitle="Please upload documents that are government issued, unedited and are JPG, JPEG, PNG or PDF file formats"
      />
      <ComplianceUploader
        label="Memorandum and Articles of Association"
        value={formData?.memorandum_of_association}
        onChange={(e) =>
          handleChange("memorandum_of_association", e.target.files)
        }
      />
      <ComplianceUploader
        label="Certificate of Incorporation"
        value={formData?.certificate_of_incorporation}
        onChange={(e) =>
          handleChange("certificate_of_incorporation", e.target.files)
        }
      />
      <ComplianceUploader
        label="CAC Status Report"
        value={formData?.status_report}
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
            !formData.memorandum_of_association ||
            !formData.certificate_of_incorporation ||
            !formData.status_report
              ? "bg-priColor/35"
              : "bg-priColor"
          } w-full p-4 text-white text-[13px] rounded-md`}
          disabled={
            !formData.memorandum_of_association ||
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
