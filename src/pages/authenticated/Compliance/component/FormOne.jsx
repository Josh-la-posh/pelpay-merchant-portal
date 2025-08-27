import { useState, useEffect } from "react";
import useAuth from "@/services/hooks/useAuth";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";
import ComplianceTextArea from "../../../../components/ComplianceTextArea";
import ComplianceInputSelect from "../../../../components/ComplianceInputSelect";
import { useSelector } from "react-redux";

const FormOne = ({ handleNextStep }) => {
  const { auth } = useAuth();
  const user = auth?.data;

  const { complianceData, complianceLoading } = useSelector((state) => state.compliance);

  const initialData = complianceData?.businessInfo;

  const [err, setErr] = useState(["", "", "", ""]);
  const [formData, setFormData] = useState({
    legalBusinessName: initialData?.legalBusinessName || "",
    tradingName: initialData?.tradingName || "",
    businessDescription: initialData?.businessDescription || "",
    ownershipType: initialData?.ownershipType || "limited_liability_companyl",
    projectedSalesVolume: initialData?.projectedSalesVolume || "",
    website: initialData?.website || "",
    progress: complianceData?.progress || 0
  });
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (complianceData) {
      const initialData = complianceData?.businessInfo;
      
      if (initialData != null) {
        setFormData({
          legalBusinessName: initialData.legalBusinessName || "",
          tradingName: initialData.tradingName || "",
          businessDescription: initialData.businessDescription || "",
          ownershipType: initialData.ownershipType || "individual",
          projectedSalesVolume: initialData.projectedSalesVolume || "",
          website: initialData.website || "",
          progress: complianceData?.progress || 0
        });
      }
    }
  }, [complianceData]);

  const handleSubmit = async () => {
    const newErrors = ["", "", "", ""];
    if (formData.legalBusinessName.length < 3)
      newErrors[0] = "Business name must be greater than 2 characters";
    if (formData.tradingName.length < 3)
      newErrors[1] = "Trading name must be greater than 2 characters";
    if (formData.businessDescription.length < 10)
      newErrors[2] = "Business description must be greater than 100 characters";
    if (formData.website.length < 3)
      newErrors[3] = "Website must be a valid website";

    setErr(newErrors);

    if (!newErrors.every((e) => e === "")) return;

    
    const newFormData = new FormData();
    if (formData.legalBusinessName)
      newFormData.append("legalBusinessName", formData.legalBusinessName);
    if (formData.tradingName)
      newFormData.append("tradingName", formData.tradingName);
    if (formData.businessDescription)
      newFormData.append("businessDescription", formData.businessDescription);
    if (formData.projectedSalesVolume)
      newFormData.append("projectedSalesVolume", formData.projectedSalesVolume);
    if (formData.ownershipType)
      newFormData.append("ownershipType", formData.ownershipType);
    if (formData.website) newFormData.append("website", formData.website);
    newFormData.append("progress", 1);
    if (formData.progress === 0) newFormData.append("progress", 1)

    handleNextStep(formData);
  };

  return (
    <div className="max-w-[450px]">
      <ComplianceHeader
        title={`Hi ${user?.firstName}, let's setup your account real quick`}
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
        value={formData.businessDescription}
        onChange={(e) => handleChange("businessDescription", e.target.value)}
        minLength={100}
      />

      <ComplianceInputSelect
        label="Business category"
        options={[
          {
            value: "limited_liability_company",
            label: "Limited Liability Company",
          },
        ]}
        id="business-category"
        value={formData.ownershipType}
        onChange={(e) => handleChange("ownershipType", e.target.value)}
      />

      <ComplianceInput
        label="Projected sales volume"
        type="number"
        value={formData.projectedSalesVolume}
        onChange={(e) => handleChange("projectedSalesVolume", e.target.value)}
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
        className={`${
          !formData.legalBusinessName ||
          !formData.ownershipType ||
          !formData.businessDescription ||
          !formData.projectedSalesVolume ||
          !formData.tradingName ||
          complianceLoading
            ? "bg-priColor/35"
            : "bg-priColor"
        } w-full p-2 text-white text-[13px] rounded-md mt-3`}
        disabled={
          !formData.legalBusinessName ||
          !formData.ownershipType ||
          !formData.businessDescription ||
          !formData.projectedSalesVolume ||
          !formData.tradingName ||
          complianceLoading
        }
      >
        {complianceLoading ? "Saving" : "Save and continue"}
      </button>
    </div>
  );
};

export default FormOne;
