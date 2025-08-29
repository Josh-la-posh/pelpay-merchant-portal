import { useState, useEffect } from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";
import ComplianceInputSelect from "../../../../components/ComplianceInputSelect";
import ComplianceUploader from "../../../../components/ComplianceUploader";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const FormFour = ({
  handlePrevStep,
  handleNextStep,
  businessRepresentativeData,
  editRepresentativeData,
}) => {
  const { complianceData, complianceLoading, complianceSuccess } = useSelector(
    (state) => state.compliance
  );

  const [err, setErr] = useState(["", "", "", "", "", "", "", ""]);
  const initialData = complianceData?.owners;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "Nigerian",
    role: "",
    address: "",
    occupation: "",
    mobile: "",
    percentOfBusiness: "",
    bvn: "",
    verificationType: "",
    verificationNumber: "",
    progress: complianceData?.progress || 3
  });

  useEffect(() => {
    
    if (editRepresentativeData) {
      setFormData(editRepresentativeData);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        dob: "",
        nationality: "Nigerian",
        role: "",
        address: "",
        occupation: "",
        mobile: "",
        percentOfBusiness: "",
        bvn: "",
        verificationType: "",
        verificationNumber: "",
        progress: complianceData.progress || 3,
      });
    }
  }, [editRepresentativeData]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (field, files) => {
    setFormData({ ...formData, [field]: files });
    
  };

  const handleSubmit = async () => {
    const newErrors = ["", "", "", "", "", "", "", ""];

    if (formData.firstName.length < 1)
      newErrors[0] = "First name should be more than 1 characters";
    if (formData.lastName.length < 1)
      newErrors[1] = "Last name should be more than 1 characters";
    if (!formData.dob) newErrors[2] = "Date of birth should not be empty";
    if (!formData.role) newErrors[3] = "Select role";
    if (!formData.percentOfBusiness) newErrors[4] = "Enter business percentage";
    if (formData.bvn.length < 2) newErrors[5] = "Enter a valid BVN";
    if (!formData.verificationType) newErrors[6] = "Select ID";
    if (
      formData.verificationNumber.length < 2 ||
      formData.verificationNumber.length > 7
    )
      newErrors[7] = `${formData.verificationType} should be more than 10 characters`;
    setErr(newErrors);
    const newFormData = new FormData();
    if (formData.progress === 3) newFormData.append("progress", 4);

    if (!newErrors.every((e) => e === "")) return;

    try {
      const existingOwners = Array.isArray(complianceData?.owners)
        ? complianceData.owners
        : [];

      let updatedOwners;

      const ownerPayload = {
        ...formData,
        role: formData.role,
        id: formData.id || uuidv4(),
      };

      if (formData.id) {
        updatedOwners = existingOwners.map((owner) =>
          owner.id === formData.id ? { ...owner, ...formData } : owner
        );
      } else {
        updatedOwners = [...existingOwners, ownerPayload];
      }

      const payload = { ...complianceData, owners: updatedOwners };

      handleNextStep(payload);
      businessRepresentativeData(formData);
      
    } catch (error) {
      console.error("Error saving owner:", error);
    }
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
          { value: "Nigerian", label: "Nigerian" },
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
        label="Occupation"
        type="text"
        errMsg={err[2]}
        value={formData.occupation}
        onChange={(e) => handleChange("occupation", e.target.value)}
      />
      <ComplianceInput
        label="Mobile"
        type="text"
        errMsg={err[2]}
        value={formData.mobile}
        onChange={(e) => handleChange("mobile", e.target.value)}
      />
      <ComplianceInput
        label="Address"
        type="text"
        errMsg={err[2]}
        value={formData.address}
        onChange={(e) => handleChange("address", e.target.value)}
      />

      <ComplianceInput
        label="What percentage of the business does this representative own?"
        type="text"
        errMsg={err[4]}
        value={formData.percentOfBusiness}
        onChange={(e) => handleChange("percentOfBusiness", e.target.value)}
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
          { value: "nin", label: "National Identification Number (NIN)" },
          { value: "PASSPORT", label: "International Passport" },
          { value: "DRIVERS_LICENSE", label: "Driver's License" },
        ]}
        value={formData.verificationType}
        onChange={(e) => handleChange("verificationType", e.target.value)}
      />

      {formData.verificationType && (
        <ComplianceInput
          label={
            formData.verificationType === "nin"
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
        label="Upload image"
        value={formData.memorandum}
        onChange={(e) => handleImageChange("memorandum", e.target.files)}
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
            !formData.firstName ||
            !formData.lastName ||
            !formData.dob ||
            !formData.role ||
            !formData.percentOfBusiness ||
            !formData.bvn ||
            !formData.verificationType ||
            !formData.verificationNumber ||
            complianceLoading? "bg-priColor/35"
              : "bg-priColor"
          } w-full p-4 text-white text-[13px] rounded-md`}
          disabled={
            !formData.firstName ||
            !formData.lastName ||
            !formData.dob ||
            !formData.role ||
            !formData.percentOfBusiness ||
            !formData.bvn ||
            !formData.verificationType ||
            !formData.verificationNumber
          }
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormFour;
