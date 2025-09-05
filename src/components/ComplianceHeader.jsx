// React import removed: using automatic JSX runtime

import PropTypes from 'prop-types';

const ComplianceHeader = ({title = '', subtitle = ''}) => {
  return (
    <div className='text-center mb-4'>
      <h3 className='text-[19px] font-semibold m-[20px]'>{title}</h3>
      <p className='text-[13px] text-gray-500'>{subtitle}</p>
    </div>
  )
}


ComplianceHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

export default ComplianceHeader