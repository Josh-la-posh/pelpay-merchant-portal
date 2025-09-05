import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

function MerchantSelector({ merchants = [], onMerchantChange = () => {} }) {
  const [selectedMerchant, setSelectedMerchant] = useState(() => merchants[0] || {});

  useEffect(() => {
    onMerchantChange(selectedMerchant);
  }, [selectedMerchant, onMerchantChange]);

  const handleMerchantChange = (e) => {
    const selectedMerchantId = e.target.value;
    const selected = merchants.find((m) => m.id.toString() === selectedMerchantId) || {};
    setSelectedMerchant(selected);
  };

  return (
    <div className="">
      <select
        id="merchant"
        value={selectedMerchant.id || ''}
        onChange={handleMerchantChange}
        className="p-2 border border-gray-300 focus:outline-gray-300 rounded-md"
      >
      {Array.isArray(merchants) && merchants.map((merchant) => (
        <option value={merchant.id} key={merchant.id}>
          {merchant.merchantCode}
        </option>
      ))}
      </select>
    </div>
  );
}

export default MerchantSelector;

MerchantSelector.propTypes = {
  merchants: PropTypes.array,
  onMerchantChange: PropTypes.func,
};
