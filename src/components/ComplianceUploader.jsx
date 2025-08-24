import React from "react";

const ComplianceUploader = ({ label, onChange }) => {
  return (
    <div className="mb-4">
      <label className="block text-[12px] text-gray-700 py-2" htmlFor="file-upload">
        {label}
        <div className="p-10 block w-full border-2 border-dashed border-gray-400 rounded-md text-center mt-3">
          <p className="text-[11px] text-gray-500">
            Drag files here or click to upload
          </p>
        </div>
      </label>

      <input
        id="file-upload"
        type="file"
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
};

export default ComplianceUploader;
