// React import removed: using automatic JSX runtime

import PropTypes from 'prop-types';

const ComplianceTextArea = ({ label, value = '', onChange = () => {}, type, minLength, errMsg }) => {
  const remaining = minLength ? Math.max(minLength - value.length, 0) : Math.max(100 - value.length, 0);
  return (
    <div className='mb-4'>
      <label className='block text-[13px] py-2'>{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        type={type}
        minLength={minLength}
        className='mb-2 bg-gray-200 block w-full border border-gray-200 text-[11px] rounded-md p-2 h-[100px]'
      />
      <p className='mt-1 text-right text-xs text-gray-500'>
        {remaining > 0
          ? `${remaining} character${remaining !== 1 ? 's' : ''} left`
          : 'Minimum length reached'}
      </p>
      {errMsg && <p className="text-red-500 text-xs lg:text-sm font-normal">{errMsg}</p>}
    </div>
  )
}

export default ComplianceTextArea

ComplianceTextArea.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  type: PropTypes.string,
  minLength: PropTypes.number,
  errMsg: PropTypes.string,
};
