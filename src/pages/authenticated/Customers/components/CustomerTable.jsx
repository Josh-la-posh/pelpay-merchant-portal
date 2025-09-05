import { useState } from 'react';
import PropTypes from 'prop-types';
import DataTable from '@/components/Table';
import { Search } from 'lucide-react';

const columns = [
    {
        header: 'Full Name',
        accessor: 'fullName',
    },
    {
        header: 'Email Address',
        accessor: 'customerEmail',
    },
    {
        header: 'Phone Number',
        accessor: 'customerPhoneNumber',
    },
    {
        header: 'Status',
        accessor: 'isActive',
        render: (value) => (
            <span className={`${value === true ? 'text-green-600' :  'text-red-600'}`}>
                {value === true ? 'Active' : 'Inactive'}
            </span>
        ),
    },
];

const CustomerTable = ({ customerData = [] }) => {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState(null);
    // selectedIndex state removed as action menu is not currently used

    const processedData = Array.isArray(customerData) ? customerData.map(row => ({
        ...row,
        fullName: `${row.customerFirstName} ${row.customerLastName}`,
    })) : [];

    // handle row actions via handleOpenModal directly when needed

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const filteredData = processedData.filter((row) => {
        const rowValues = Object.values(row).map(val => (val || '').toString().toLowerCase());
    
        const matchesSearch = search
            ? rowValues.some(val => val.includes(search.toLowerCase()))
            : true;
    
        const matchesStatus = filterStatus
            ? row.isActive === filterStatus
            : true;
    
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto">
            <div className="my-3 py-3 flex flex-row-reverse items-center justify-between border-y border-[#F0F2F5] text-xs lg:text-sm">
                <div className="relative">
                    <input
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        className="p-2 pl-8 border border-gray-300 rounded-lg focus:outline-none"
                        placeholder="Search customers..."
                    />
                    <Search size='15px' className="absolute left-2 top-2/4 transform -translate-y-2/4 text-gray-400" />
                </div>

                <div className="">
                    <select
                        value={filterStatus}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-priColor"
                    >
                        <option value="">All</option>
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                    </select>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                rowsPerPageOptions={[5, 10, 20, 50]}
                // onIndexChange={handleSelectedRow}
                // selectedIndex={selectedIndex}
                // displayActionButton={true}
                // elementId='customerTable'
                // actionButton={
                //     <>
                //         {
                //             <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 shadow-lg z-10 rounded-[8px] text-xs">
                //                 <button onClick={()=>getVal(selectedIndex, 'view')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                //                     View Details
                //                 </button>
                //                 <button onClick={()=>getVal(selectedIndex, 'edit')} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                //                     Edit
                //                 </button>
                //             </div>
                //         }
                //     </>
                // }
            />
        </div>
    );
};

export default CustomerTable;

CustomerTable.propTypes = {
    customerData: PropTypes.array,
};
