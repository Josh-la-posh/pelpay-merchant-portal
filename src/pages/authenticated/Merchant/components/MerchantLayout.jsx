import React from 'react';
import MerchantSidebar from '@/components/sidebar/merchantSidebar';
import SettingsLayout from '@/layouts/SettingsLayout';

const MerchantLayout = () => {
  return (
    <SettingsLayout> 
      <MerchantSidebar />
    </SettingsLayout>
  );
};
export default MerchantLayout;