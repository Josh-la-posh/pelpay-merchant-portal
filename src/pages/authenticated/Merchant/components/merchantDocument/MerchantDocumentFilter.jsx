import { Plus, X } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import useNoHeaderAxiosPrivate from '@/services/hooks/useAuthPrivare2';
import MerchantService from '@/services/api/merchantApi';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '@/services/hooks/useAuth';

function MerchantDocumentFilter() {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const noHeaderxiosPrivate = useNoHeaderAxiosPrivate();
    const merchantService = useMemo(() => new MerchantService(axiosPrivate), [axiosPrivate]);
    const noHeaderMerchantService = useMemo(() => new MerchantService(noHeaderxiosPrivate), [noHeaderxiosPrivate]);
    const { merchantDocumentType, merchantDocumentLoading } = useSelector((state) => state.merchant || {});
    const [isUploading, setIsUploading] = useState(merchantDocumentLoading);
    const dispatch = useDispatch();
    const [documents, setDocuments] = useState(() => merchantDocumentType || []);
    const [canUpload, setCanUpload] = useState(false);
    const [file, setFile] = useState(null);
    const [documentId, setDocumentId] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const handleFileCharge = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    }

    const handleChange = (e) => {
        const { value } = e.target;
        setDocumentId(value);
    }

    useEffect(() => {
        setIsUploading(merchantDocumentLoading);
    }, [merchantDocumentLoading])

    useEffect(() => {
        setDocuments(merchantDocumentType);
    }, [merchantDocumentType])

    const loadDocument = useCallback(async () => {
        await merchantService.fetchMerchantDocumentTypes(dispatch);
    }, [merchantService, dispatch]);

    useEffect(() => {
        loadDocument();
    }, [loadDocument])

    const uploadDocument = async () => {
        if (!file) {
            setErrMsg('Please, select a file first');
            setTimeout(() => {
                setErrMsg('');
            }, 2000);
            return;
        }
        const merchantCode = auth?.merchant?.merchantCode;
        const formData = new FormData();
        formData.append("file", file);
        await noHeaderMerchantService.createMerchantDocument(merchantCode, documentId, formData, dispatch);
    }
    
  return (
    <div className="bg-white flex justify-end items-center pb-5 pt-3 px-3">
        <div className="">
            <div className="flex items-center gap-4">
                { canUpload &&
                    <div className="space-y-2">
                        <div className="flex items-center gap-1 sm:gap-3">
                            <div className ="flex items-center justify-center gap-1 sm:gap-2">
                                <div className="flex items-start md:items-center gap-2">
                                    <select name="" id="documents" value={documentId} onChange={handleChange} className='pl-1 sm:pl-2 py-2 outline-none text-[7px] sm:text-xs border border-gray-300 rounded-sm'>
                                        <option value="">Select Document</option>
                                        {Array.isArray(documents) && documents.map(document => (
                                            <option key={document.id} value={document.id} className='text-[6px] sm:text-xs'>
                                                {document.documentName}
                                            </option>
                                        ))}
                                    </select>
                                    <input 
                                        type="file"
                                        accept='image/*, .pdf'
                                        onChange={handleFileCharge}
                                        className='pl-1 sm:px-2 py-2 text-[7px] sm:text-xs border border-gray-300 rounded-sm'
                                    />
                                </div>
                                <button
                                    className={`text-white border border-gray-300 bg-priColor text-xs font-[600] py-2 px-2 rounded-sm flex justify-between items-center gap-2`}
                                    onClick={uploadDocument}
                                    disabled={isUploading}
                                    >
                                        {isUploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                            {
                                canUpload === true && (
                                <button
                                    onClick={() => setCanUpload(false)}
                                    className={`w-4 h-4 text-white flex justify-center items-center bg-priColor text-xs font-[600] rounded-full shadow-xl`}
                                    >
                                        <X size='12px' />
                                </button>
                                )
                            }
                        </div>
                        {errMsg && <p className='text-red-400 text-[11px] text-center'>{errMsg}</p>}
                        <p className='text-gray-400 text-[8px] sm:text-xs text-center'>**Supported files jpeg, png, pdf</p>
                    </div>
                }
                {
                    canUpload === false &&
                    (<button
                        onClick={() => setCanUpload(true)}
                        className={`w-9 h-9 text-white flex justify-center items-center bg-priColor text-xs font-[600] rounded-full shadow-xl`}
                        >
                            <Plus size='22px' />
                    </button>)
                }
            </div>
        </div>
    </div>
  )
}

export default MerchantDocumentFilter;