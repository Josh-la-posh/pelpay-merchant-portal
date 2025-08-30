import { useState, useEffect } from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";
import ComplianceInputSelect from "../../../../components/ComplianceInputSelect";
import ComplianceUploader from "../../../../components/ComplianceUploader";
import { useDispatch, useSelector } from "react-redux";
import { addBusinessRepresentative, updateBusinessRepresentative } from "../../../../redux/slices/complianceSlice";

const FormFour = ({
  handlePrevStep,
  handleNextStep,
  editRepresentativeData,
}) => {
   const dispatch = useDispatch();
  const { complianceLoading } = useSelector((state) => state.compliance);
  const [err, setErr] = useState(["", "", "", "", "", "", "", "", "", "", ""]);

  const [formData, setFormData] = useState({
    id: editRepresentativeData?.id || "",
    firstName: editRepresentativeData?.firstName || "",
    lastName: editRepresentativeData?.lastName || "",
    dob: editRepresentativeData?.dob || "",
    nationality: editRepresentativeData?.nationality || "Nigerian",
    role: editRepresentativeData?.role || "",
    address: editRepresentativeData?.address || "",
    occupation: editRepresentativeData?.occupation || "",
    mobile: editRepresentativeData?.mobile || "",
    percentOfBusiness: editRepresentativeData?.percentOfBusiness || "",
    bvn: editRepresentativeData?.bvn || "",
    verificationType: editRepresentativeData?.verificationType || "",
    verificationNumber: editRepresentativeData?.verificationNumber || "",
    verificationDocument: editRepresentativeData?.verificationDocument || "",
  });

  useEffect(() => {    
    if (editRepresentativeData) {
      setFormData(editRepresentativeData);
    }
  }, [editRepresentativeData]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageChange = (field, files) => {
    setFormData({ ...formData, [field]: files[0] });    
  };

  const handleSubmit = async () => {
    const newErrors = Array(11).fill("");

    if (formData.firstName.length < 1) newErrors[0] = "First name should at least 1 characters";
    if (formData.lastName.length < 1) newErrors[1] = "Last name should at least 1 characters";
    if (!formData.dob) newErrors[2] = "Date of birth should not be empty";
    if (!formData.role) newErrors[3] = "Select role";
    if (!formData.occupation) newErrors[4] = "Enter occupation";
    if (formData.mobile.length !== 11) newErrors[5] = "Enter mobile number";
    if (!formData.address) newErrors[6] = "Enter address";
    if (!formData.percentOfBusiness) newErrors[7] = "Enter business percentage";
    if (formData.bvn.length !== 11) newErrors[8] = "Enter a valid 11-digit BVN";
    if (!formData.verificationType) newErrors[9] = "Select ID";
    if (formData.verificationNumber.length < 10) newErrors[10] = "Enter a valid verification number";

    setErr(newErrors)
    if (!newErrors.every((e) => e === "")) return;

    const isEditing = !!formData.id;

    if (isEditing) {
      dispatch(updateBusinessRepresentative(formData));
    } else {
      dispatch(addBusinessRepresentative(formData));
    }

    const newForm = new FormData()

    newForm.append("progress", 4)

    handleNextStep(newForm, false);
  };

  const isInvalid = [
    "firstName", "lastName", "dob", "nationality", "role",
    "address", "occupation", "mobile", "percentOfBusiness",
    "bvn", "verificationType", "verificationNumber"
  ].some((field) => !formData[field]);

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
        errMsg={err[4]}
        value={formData.occupation}
        onChange={(e) => handleChange("occupation", e.target.value)}
      />
      <ComplianceInput
        label="Mobile"
        type="text"
        errMsg={err[5]}
        value={formData.mobile}
        onChange={(e) => handleChange("mobile", e.target.value)}
      />
      <ComplianceInput
        label="Address"
        type="text"
        errMsg={err[6]}
        value={formData.address}
        onChange={(e) => handleChange("address", e.target.value)}
      />

      <ComplianceInput
        label="What percentage of the business does this representative own?"
        type="text"
        errMsg={err[7]}
        value={formData.percentOfBusiness}
        onChange={(e) => handleChange("percentOfBusiness", e.target.value)}
      />

      <ComplianceInput
        label="Bank Verification Number (BVN)"
        type="text"
        errMsg={err[8]}
        value={formData.bvn}
        onChange={(e) => handleChange("bvn", e.target.value)}
        minLength={11}
        maxLength={11}
      />

      <ComplianceInputSelect
        label="Identification Document"
        errMsg={err[9]}
        options={[
          { value: "", label: "Select a document" },
          { value: "nin", label: "National Identification Number (NIN)" },
          { value: "bvn", label: "Bank Verification Number (BVN)" },
          { value: "voters_card", label: "Voter's Card" },
          { value: "driver_license", label: "Driver's License" },
          { value: "national_passport", label: "International Passport" },
        ]}
        value={formData.verificationType}
        onChange={(e) => handleChange("verificationType", e.target.value)}
      />

      {formData.verificationType && (
        <ComplianceInput
          label="Enter Document Number"
          type="text"
          errMsg={err[10]}
          value={formData.verificationNumber}
          onChange={(e) => handleChange("verificationNumber", e.target.value)}
        />
      )}

      <ComplianceUploader
        label="Upload image"
        value={formData?.verificationDocument?.name || ''}
        onChange={(e) => handleImageChange("verificationDocument", e.target.files)}
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
          className={`${isInvalid || complianceLoading ||
            // !formData.verificationDocument ||
            complianceLoading? "bg-priColor/35"
              : "bg-priColor"
          } w-full p-4 text-white text-[13px] rounded-md`}
          disabled={ isInvalid || complianceLoading
            // !formData.verificationDocument
          }
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormFour;
