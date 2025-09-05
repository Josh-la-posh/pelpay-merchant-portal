function StatusBadge({ status }) {
  const isActive = (status === 'Active' || status === 'Successful' || status === 'Deposit');
  const isInactive = (status === 'Inactive' || status === 'Failed' || status === 'Withdrew');

  const classes = isActive
    ? 'bg-green-100 text-green-700'
    : isInactive
    ? 'bg-red-100 text-red-700'
    : 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${classes}`}>
      {status}
    </span>
  );
}

export default StatusBadge;

import PropTypes from 'prop-types';

StatusBadge.propTypes = {
  status: PropTypes.string,
};