import React, { useState, useEffect } from "react";
import useAuth from "@/services/hooks/useAuth";
import ComplianceHeader from "../../../../components/ComplianceHeader";
import ComplianceInput from "../../../../components/ComplianceInput";
import ComplianceInputSelect from "../../../../components/ComplianceInputSelect";
import ComplianceUploader from "../../../../components/ComplianceUploader";
import { useDispatch, useSelector } from "react-redux";
import ComplianceService from "@/services/api/complianceApi";
import useAxiosPrivate from "@/services/hooks/useFormAxios";


const FormFour = ({
  handlePrevStep,
  handleNextStep,
  handleSave,
  editRepresentativeData,
}) => {
  const { auth } = useAuth();
  const user = auth?.data;

  const complianceState = useSelector((state) => state.compliance);
  const { complianceData, complianceLoading, complianceSuccess } =
    complianceState;
  const formDataAxiosPrivate = useAxiosPrivate();
  const complianceService = new ComplianceService(formDataAxiosPrivate);

  const dispatch = useDispatch();
  const [err, setErr] = useState(["", "", "", "", "", "", "", ""]);
  const initialData = complianceData?.owners;
  console.log("Initial Data 4: ", initialData);

  // const [formData, setFormData] = useState({
  //   firstName: initialData?.firstName || "",
  //   lastName: initialData?.lastName || "",
  //   dob: initialData?.dob || "",
  //   nationality: initialData?.nationality || "NGA",
  //   roleInBusiness: initialData?.roleInBusiness || "",
  //   percentOfBusiness: initialData?.percentOfBusiness || "",
  //   bvn: initialData?.bvn || "",
  //   verificationType: initialData?.verificationType || "",
  //   verificationNumber: initialData?.verificationNumber || "",
  // });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "NGA",
    roleInBusiness: "",
    percentOfBusiness: "",
    bvn: "",
    verificationType: "",
    verificationNumber: "",
  });

  console.log("Form Data 4: ", formData);



  useEffect(() => {
    if (editRepresentativeData) {
      setFormData(editRepresentativeData);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        dob: "",
        nationality: "NGA",
        roleInBusiness: "",
        percentOfBusiness: "",
        bvn: "",
        verificationType: "",
        verificationNumber: "",
      });
    }
  }, [editRepresentativeData]);

  

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const existingRecord = Array.isArray(initialData)
    ? initialData[0]
    : initialData || {};
  console.log("Existing Record 4: ", existingRecord);


  const handleSubmit = async () => {
    const newErrors = ["", "", "", "", "", "", "", ""];

    if (formData.firstName.length < 1)
      newErrors[0] = "First name should be more than 1 characters";
    if (formData.lastName.length < 1)
      newErrors[1] = "Last name should be more than 1 characters";
    if (!formData.dob) newErrors[2] = "Date of birth should not be empty";
    if (!formData.roleInBusiness) newErrors[3] = "Select role";
    if (!formData.percentOfBusiness) newErrors[4] = "Enter business percentage";
    if (formData.bvn.length <2) newErrors[5] = "Enter a valid BVN";
    if (!formData.verificationType) newErrors[6] = "Select ID";
    if (
      formData.verificationNumber.length < 2 ||
      formData.verificationNumber.length > 7
    )
      newErrors[7] = `${formData.verificationType} should be more than 10 characters`;
    setErr(newErrors);

    if (!newErrors.every((e) => e === "")) return;

    try {
      const existingOwners = Array.isArray(complianceData?.owners)
        ? complianceData.owners
        : [];

      let updatedOwners;

      if (formData.id) {
        
        updatedOwners = existingOwners.map((owner) =>
          owner.id === formData.id ? { ...owner, ...formData } : owner
        );
      } else {
        
        updatedOwners = [...existingOwners, { ...formData, id: Date.now() }];
      }

      const payload = { ...complianceData, owners: updatedOwners };

      await complianceService.updateComplianceData(
        payload,
        dispatch,
        user?.merchants[0]?.merchantCode
      );

      console.log("Updated owners array:", updatedOwners);
handleSave(formData);
      // handleNextStep();
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
        value={formData.roleInBusiness}
        onChange={(e) => handleChange("roleInBusiness", e.target.value)}
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
          className={`${
            !formData.firstName ||
            !formData.lastName ||
            !formData.dob ||
            !formData.roleInBusiness ||
            !formData.percentOfBusiness ||
            !formData.bvn ||
            !formData.verificationType ||
            !formData.verificationNumber
              ? "bg-priColor/35"
              : "bg-priColor"
          } w-full p-4 text-white text-[13px] rounded-md`}
          disabled={
            !formData.firstName ||
            !formData.lastName ||
            !formData.dob ||
            !formData.roleInBusiness ||
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
