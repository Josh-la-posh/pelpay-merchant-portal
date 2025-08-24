import React, { useState, useEffect } from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";
import ComplianceInputSelect from "../../../../components/ComplianceInputSelect";
import ComplianceUploader from "../../../../components/ComplianceUploader";

const FormFour = ({ handlePrevStep, handleSave, editRepresentativeData }) => {
  const [err, setErr] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "NGA",
    role: "",
    ownership: "",
    bvn: "",
    verificationType: "",
    verificationNumber: "",
  });

  useEffect(() => {
    if (editRepresentativeData) {
      setFormData(editRepresentativeData);
    }
  }, [editRepresentativeData]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    const newErrors = ["", "", "", "", "", "", "", "", ];
    if (formData.firstName.length < 1) newErrors[0] = 'First name should be more than 1 characters';
    if (formData.lastName.length < 1) newErrors[1] = 'Last name should be more than 1 characters';
    if (!formData.dob) newErrors[2] = 'Date of birth should not be empty';
    if (!formData.role) newErrors[3] = 'Select role';
    if (!formData.ownership) newErrors[4] = 'Enter business percentage';
    if (formData.bvn.length !== 11) newErrors[5] = 'Enter a valid BVN';
    if (!formData.verificationType) newErrors[6] = 'Select ID';
    if (formData.verificationNumber.length < 11 || formData.verificationNumber.length > 12) newErrors[7] = `${formData.verificationType} should be more than 10 characters`;
    setErr(newErrors)
 

    if (newErrors.every((e) => e === '')) {
      handleSave(formData)
    }
  }

  return (
    <div className="max-w-[450px] ">
      <ComplianceHeader
        title="Tell us about the business representative"
        subtitle="A business representative is either an owner, director or shareholder of your business."
      />

      <ComplianceInput
        label="Legal first name"
        type="text"
        errMsg={err[0]}
        value={formData.firstName}
        onChange={(e) => handleChange("firstName", e.target.value)}
      />

      <ComplianceInput
        label="Legal last name"
        type="text"
        errMsg={err[1]}
        value={formData.lastName}
        onChange={(e) => handleChange("lastName", e.target.value)}
      />

      <ComplianceInput
        label="Date of birth"
        type="date"
        errMsg={err[2]}
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
        errMsg={err[3]}
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
        errMsg={err[4]}
        value={formData.ownership}
        onChange={(e) => handleChange("ownership", e.target.value)}
      />

      <ComplianceInput
        label="Bank Verification Number (BVN)"
        type="text"
        errMsg={err[5]}
        value={formData.bvn}
        onChange={(e) => handleChange("bvn", e.target.value)}
        minLength={10}
        maxLength={12}
      />

      <ComplianceInputSelect
        label="Identification Document"
        errMsg={err[6]}
        options={[
          { value: "", label: "Select a document" },
          { value: "NIN", label: "National Identification Number (NIN)" },
          { value: "PASSPORT", label: "International Passport" },
          { value: "DRIVERS_LICENSE", label: "Driver's License" },
        ]}
        value={formData.verificationType}
        onChange={(e) => handleChange("verificationType", e.target.value)}
      />

      {formData.verificationType && (
        <ComplianceInput
          label={
            formData.verificationType === "NIN"
              ? "Enter NIN Number"
              : formData.verificationType === "PASSPORT"
              ? "Enter Passport Number"
              : formData.verificationType === "DRIVERS_LICENSE"
              ? "Driver's License Number"
              : "Document Number"
          }
          type="text"
        errMsg={err[7]}
          value={formData.verificationNumber}
          onChange={(e) => handleChange("verificationNumber", e.target.value)}
        />
      )}

      <ComplianceUploader
        label=""
        value={formData.memorandum}
        onChange={(e) => handleChange("memorandum", e.target.files)}
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
          className={`${(!formData.firstName || !formData.lastName || !formData.dob || !formData.role || !formData.ownership || !formData.bvn || !formData.verificationType || !formData.verificationNumber) ? 'bg-priColor/35' : 'bg-priColor'} w-full p-4 text-white text-[13px] rounded-md`}
          disabled={!formData.firstName || !formData.lastName || !formData.dob || !formData.role || !formData.ownership || !formData.bvn || !formData.verificationType || !formData.verificationNumber}
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormFour;
