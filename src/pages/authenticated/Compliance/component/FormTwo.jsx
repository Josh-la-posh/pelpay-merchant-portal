import React, { useState, useEffect } from "react";
import useAuth from "@/services/hooks/useAuth";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";
import { useDispatch, useSelector } from "react-redux";
import ComplianceService from "@/services/api/complianceApi";
import useAxiosPrivate from "@/services/hooks/useFormAxios";

const FormTwo = ({ handleNextStep, handlePrevStep }) => {
  const { auth } = useAuth();
  const user = auth?.data;

  const complianceState = useSelector((state) => state.compliance);
  const { complianceData } = complianceState;

  console.log("Compliance Data 2: ", complianceData);

  const formDataAxiosPrivate = useAxiosPrivate();
  const complianceService = new ComplianceService(formDataAxiosPrivate);
  const dispatch = useDispatch();

  const initialData = complianceData;

  // console.log("Initial Data 2: ", initialData?.businessInfo);
  // console.log("Initial Data 2: ", initialData?.financialInfo);

  const [err, setErr] = useState(["", ""]);
  

  const [formData, setFormData] = useState({
    rcNumber: initialData?.businessInfo?.rcNumber || "",
    tin: initialData?.financialInfo?.tin || "",
  });

  // console.log("Form Data2: ", formData);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const existingRecord = Array.isArray(initialData)
    ? initialData[0]
    : initialData || {};

  console.log("Existing Record2: ", existingRecord);

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

    try {
      
      if (existingRecord) {
        await complianceService.updateComplianceData(
          newFormData,
          dispatch,
          user?.merchants[0]?.merchantCode
        );
        console.log("Updated compliance record 2:");
      } else {
        await complianceService.complianceUpload(
          user?.merchants[0]?.merchantCode,
          newFormData,
          dispatch
        );
        console.log("Uploaded compliance record 2:");
      }

      handleNextStep(formData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (initialData) {
      const record = Array.isArray(initialData) ? initialData[0] : initialData;
      if (record) {
        setFormData({
          rcNumber: record.businessInfo?.rcNumber || "",
          tin: record.financialInfo?.tin || "",
        });
      }
    }
  }, []);



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
