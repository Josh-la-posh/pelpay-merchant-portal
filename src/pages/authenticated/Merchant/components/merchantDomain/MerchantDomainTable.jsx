import { useState } from 'react';
import ExportPopup from '@/utils/exportPopup';
import DataTable from '@/components/Table';
import { dateFormatter } from '@/utils/dateFormatter';
// import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import PropTypes from 'prop-types';

const MerchantDomainTable = ({ filteredData, handleOpenModal: _handleOpenModal, isExportPopupOpen, setIsExportPopupOpen }) => {
    // axiosPrivate not used here yet
    const [selectedIndex, setSelectedIndex] = useState(null);
    // keep prop reference for future use (prevents unused variable lint)
    void _handleOpenModal;
    
    const columns = [
        {
            header: 'Date',
            accessor: 'createdDate',
            render: (value) => (
                <span>
                    {dateFormatter(value)}
                </span>
            ),
        },
        {
            header: 'Domain',
            accessor: 'domainName',
        },
        {
            header: 'Approaved',
            accessor: 'approaved',
            render: (value) => (
                <span 
                    className={value === true ? 'text-priColor' : 'text-red-600'}
                >
                    {value === true ? 'True' : 'False'}
                </span>
            )
        },
        {
            header: 'Status',
            accessor: 'isActive',
            render: (value) => (
                <span 
                    className={value === true ? 'text-priColor' : 'text-red-600'}
                >
                    {value === true ? 'True' : 'False'}
                </span>
            )
        },
    ];

    // getDataToParent removed - keep handleOpenModal signature for future use
    
    const handleSelectedRow = (index) => {
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    return (
        <div className="">

            <DataTable
                columns={columns}
                data={filteredData}
                rowsPerPageOptions={[5, 10, 20, 50]}
                onIndexChange={handleSelectedRow}
                selectedIndex={selectedIndex}
                displayActionButton={false}
                elementId='MerchantDomainTable'
            />
            <ExportPopup
                isOpen={isExportPopupOpen}
                onClose={() => setIsExportPopupOpen(false)}
                data={filteredData}
                elementId='MerchantDomainTable'
            />
        </div>
    );
};

export default MerchantDomainTable;

MerchantDomainTable.propTypes = {
    filteredData: PropTypes.array,
    handleOpenModal: PropTypes.func,
    isExportPopupOpen: PropTypes.bool,
    setIsExportPopupOpen: PropTypes.func,
};