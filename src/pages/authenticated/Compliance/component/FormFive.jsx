import React from "react";
import ComplianceHeader from "../../../../components/ComplianceHeader";

const FormFive = ({ handlePrevStep, representativeDatas = [], handleEditRepresentative }) => {
  return (
    <div className="max-w-[450px] ">
      <ComplianceHeader
        title="Tell us about the business representative"
        subtitle="A business representative is either an owner, director or shareholder of your business."
      />

      {representativeDatas?.map((rep, index) => (
        <div
          key={index}
          className="grid grid-cols-12 md:grid-cols-10  border-b py-3 items-center "
        >
          <div className="col-span-4">
            <p className="text-[10px] md:text-[13px] text-gray-800">
              {rep.firstName} {rep.lastName}
            </p>
          </div>

          {rep.role ? (
            <div className="col-span-3 md:col-span-2 ">
              <p className="text-[11px] text-gray-600">{rep.role}</p>
            </div>
          ) : (
            <div className="col-span-4 md:col-span-3">
              <p className="text-[11px] text-gray-600">No role information</p>
            </div>
          )}

          {rep.ownership ? (
            <div className="col-span-4 md:col-span-3 ">
              <p className=" text-[9px] md:text-[11px] text-gray-600">
                {rep.ownership}% of ownership
              </p>
            </div>
          ) : (
            <div className="col-span-2"></div>
          )}

          <div className="col-span-1">
            <button
              className="text-blue-800 text-[11px]"
              onClick={() => handleEditRepresentative(index, rep)}
            >
              Edit
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handlePrevStep}
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
        <button className="bg-priColor w-full p-4 text-white text-[13px] rounded-md ">
          Save and continue
        </button>
      </div>
    </div>
  );
};

export default FormFive;
