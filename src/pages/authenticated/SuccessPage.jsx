import { useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");  // Navigate to home or any other page
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Success!</h2>
        <p className="text-lg text-gray-700 mb-6">
          Your documents are being processed, we will get back to you within 24 hours.
        </p>
        <button
          onClick={handleGoHome}
          className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;
