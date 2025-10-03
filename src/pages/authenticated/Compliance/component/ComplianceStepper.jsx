import PropTypes from 'prop-types';

const ComplianceStepper = ({ current, total, steps }) => {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
      {steps.map((s, index) => {
        const isActive = index === current;
        const isCompleted = index < current;
        return (
          <div
            key={s.key}
            className={`flex items-center gap-2 text-[10px] md:text-xs ${isActive ? 'font-bold text-priColor' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}
          >
            <div
              className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs border ${
                isActive
                  ? 'bg-priColor text-white border-priColor'
                  : isCompleted
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-gray-200 text-gray-500 border-gray-300'
              }`}
            >
              {isCompleted ? '✓' : index + 1}
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span>{s.title}</span>
            </div>
            {index < total - 1 && (
              <div className="w-6 md:w-10 h-[2px] bg-gray-300 relative top-1 hidden sm:block">
                <div
                  className={`h-full transition-all ${
                    isCompleted ? 'w-full bg-green-500' : 'w-0'
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

ComplianceStepper.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
    })
  ).isRequired,
};

export default ComplianceStepper;
