import DataTable from '@/components/Table';
import { dateFormatter } from '@/utils/dateFormatter';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import MerchantService from '@/services/api/merchantApi';
import { useDispatch } from 'react-redux';
import { Cloud } from 'lucide-react';
import PropTypes from 'prop-types';

const MerchantDocumentTable = ({filteredData, merchantCode}) => {
    const axiosPrivate = useAxiosPrivate();
    // selectedIndex removed as action menu is not used currently
    const merchantService = new MerchantService(axiosPrivate);
    const dispatch = useDispatch();
    
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
            header: 'Document Name',
            accessor: 'document',
            render: (value) => (
                <span >
                    {value.documentName}
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
        {
            header: 'Download',
            accessor: 'id',
            render: (id) => (
                <button
                    onClick={() => handleDownload(id)}
                    className='text-priColor flex items-center gap-2 text-xs px-2 py-1 rounded-[4px]'
                >
                    <Cloud size={'18px'} />
                    Download
                </button>
            ),
        },
        {
            header: '',
            accessor: 'documentId',
            render: (id) => (
                <button
                    onClick={() => handleDelete(id)}
                    className='text-red-700 text-xs px-2 py-1 rounded-[4px]'
                >
                    {/* <Trash size={'14px'} /> */}
                    Request Deletion
                </button>
            ),
        },
    ];

    const handleDownload = async (id) => {
        await merchantService.downloadMerchantDocument(id);
    }

    const handleDelete = async (id) => {
        await merchantService.deleteMerchantDocument(id, merchantCode, dispatch);
    }
    
    // action handlers currently unused; implement when needed

    return (
        <div className="">

            <DataTable
                columns={columns}
                data={filteredData}
                drpp=''
            />
        </div>
    );
};

export default MerchantDocumentTable;

MerchantDocumentTable.propTypes = {
    filteredData: PropTypes.array,
    merchantCode: PropTypes.string,
};