import ComplianceHeader from "../../../../components/ComplianceHeader";
import { useSelector } from "react-redux";
import PropTypes from 'prop-types';

const FormFive = ({ handlePrevStep, handleNextStep, handleEditRepresentative }) => {
  const { businessRepresentatives } = useSelector((state) => state.compliance);

  const handleSubmit = async () => {
    try {
      const finalFormData = new FormData();
      finalFormData.append("owners", JSON.stringify(businessRepresentatives));
      finalFormData.append("progress", 5)
      
      handleNextStep(finalFormData, false);     
    } catch (error) {
      console.error("Error saving compliance reps:", error);
    }
  };

  return (
    <div className="max-w-[450px] ">
      <ComplianceHeader
        title="Tell us about the business representative"
        subtitle="A business representative is either an owner, director or shareholder of your business."
      />

      {businessRepresentatives?.map((rep, index) => (
        <div
          key={index}
          className="grid grid-cols-7  border-b py-3 items-center "
        >
          <div className="col-span-2">
            <p className="text-[10px] md:text-[13px] text-gray-800">
              {rep.firstName} {rep.lastName}
            </p>
          </div>

          {rep.role ? (
            <div className="col-span-2 ">
              <p className="text-[11px] text-gray-600">{rep.role}</p>
            </div>
          ) : (
            <div className="col-span-2">
              <p className="text-[11px] text-gray-600">No role information</p>
            </div>
          )}

          {rep.percentOfBusiness ? (
            <div className="col-span-2  ">
              <p className=" text-[9px] md:text-[11px] text-gray-600">
                {rep.percentOfBusiness}% of ownership
              </p>
            </div>
          ) : (
            <div className="col-span-2"></div>
          )}

          <div className="col-span-1">
            <button
              className="text-blue-800 text-[11px]"
              onClick={() => handleEditRepresentative(index)}
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => handleEditRepresentative(null)}
        className="text-blue-600 mt-3 text-[11px]"
      >
        Add additional owners, directors or shareholders
      </button>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <button
          onClick={handlePrevStep}
          className="bg-gray-200 w-full p-4 text-black text-[13px] rounded-md"
        >
          Go back
        </button>
        <button
          onClick={handleSubmit}
          className="bg-priColor w-full p-4 text-white text-[13px] rounded-md "
        >
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormFive;

FormFive.propTypes = {
  handlePrevStep: PropTypes.func,
  handleNextStep: PropTypes.func,
  handleEditRepresentative: PropTypes.func,
};
