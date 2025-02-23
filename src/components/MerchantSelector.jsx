import React, { useState, useEffect } from 'react';
import useAuth from '../services/hooks/useAuth';

function MerchantSelector({ merchants, onMerchantChange }) {
  const {auth, setAuth} = useAuth();
  const [selectedMerchant, setSelectedMerchant] = useState(merchants[0] || {});

  useEffect(() => {
    onMerchantChange(selectedMerchant);
  }, [selectedMerchant, onMerchantChange]);

  const handleMerchantChange = (e) => {
    const selectedMerchantId = e.target.value;
    const selected = merchants.find((m) => m.id.toString() === selectedMerchantId);
    setSelectedMerchant(selected);
    onMerchantChange(selected);
  };

  useEffect(() => {
    setAuth(prev => {
      return { ...prev, merchant: selectedMerchant }
  });
  }, [selectedMerchant]);

  return (
    <div className="">
      <select
        id="merchant"
        value={selectedMerchant.id || ''}
        onChange={handleMerchantChange}
        className="p-2 border border-gray-300 focus:outline-gray-300 rounded-md"
      >
        {merchants.map((merchant) => (
          <option value={merchant.id} key={merchant.id}>
            {merchant.merchantName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default MerchantSelector;
