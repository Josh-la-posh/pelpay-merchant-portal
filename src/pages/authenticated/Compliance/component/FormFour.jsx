import React, { useState, useEffect } from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";
import ComplianceInputSelect from "../../../../components/ComplianceInputSelect";
import ComplianceUploader from "../../../../components/ComplianceUploader";

const FormFour = ({ handlePrevStep, handleSave, editRepresentativeData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "NGA",
    role: "",
    ownership: "",
    bvn: "",
    idType: "",
    idNumber: "",
  });

  useEffect(() => {
    if (editRepresentativeData) {
      setFormData(editRepresentativeData);
    }
  }, [editRepresentativeData]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="max-w-[450px] ">
      <ComplianceHeader
        title="Tell us about the business representative"
        subtitle="A business representative is either an owner, director or shareholder of your business."
      />

      <ComplianceInput
        label="Legal first name"
        type="text"
        value={formData.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
      />

      <ComplianceInput
        label="Legal last name"
        type="text"
        value={formData.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
      />

      <ComplianceInput
        label="Date of birth"
        type="date"
        value={formData.dob}
        onChange={(e) => handleChange("dob", e.target.value)}
      />

      <ComplianceInputSelect
        label="Nationality"
        options={[
          { value: "NGA", label: "Nigeria" },
          { value: "GHA", label: "Ghana" },
        ]}
        value={formData.nationality}
        onChange={(e) => handleChange("nationality", e.target.value)}
      />

      <ComplianceInputSelect
        label="Role at the business"
        options={[
          { value: "", label: "Select a role" },
          { value: "Owner", label: "Owner" },
          { value: "Director", label: "Director" },
          { value: "Shareholder", label: "Shareholder" },
        ]}
        value={formData.role}
        onChange={(e) => handleChange("role", e.target.value)}
      />

      <ComplianceInput
        label="What percentage of the business does this representative own?"
        type="text"
        value={formData.ownership}
        onChange={(e) => handleChange("ownership", e.target.value)}
      />

      <ComplianceInput
        label="Bank Verification Number (BVN)"
        type="text"
        value={formData.bvn}
        onChange={(e) => handleChange("bvn", e.target.value)}
        minLength={10}
        maxLength={12}
      />

      <ComplianceInputSelect
        label="Identification Document"
        options={[
          { value: "", label: "Select a document" },
          { value: "NIN", label: "National Identification Number (NIN)" },
          { value: "PASSPORT", label: "International Passport" },
          { value: "DRIVERS_LICENSE", label: "Driver's License" },
        ]}
        value={formData.idType}
        onChange={(e) => handleChange("idType", e.target.value)}
      />

      {formData.idType && (
        <ComplianceInput
          label={
            formData.idType === "NIN"
              ? "Enter NIN Number"
              : formData.idType === "PASSPORT"
              ? "Enter Passport Number"
              : formData.idType === "DRIVERS_LICENSE"
              ? "Driver's License Number"
              : "Document Number"
          }
          type="text"
          value={formData.idNumber}
          onChange={(e) => handleChange("idNumber", e.target.value)}
        />
      )}

      <ComplianceUploader label="" />

      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          onClick={handlePrevStep}
          className="bg-gray-200 w-full p-4 text-black text-[13px] rounded-md"
        >
          Go back
        </button>
        <button
          onClick={() => handleSave(formData)}
          className="bg-priColor w-full p-4 text-white text-[13px] rounded-md "
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormFour;
