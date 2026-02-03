import { useEffect, useMemo, useState } from 'react'
import useAuth from '@/services/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import useSettingsTitle from '@/services/hooks/useSettingsTitle';
import Spinner from '@/components/Spinner';
import ErrorLayout from '@/components/ErrorLayout';
import useAxiosPrivate from '@/services/hooks/useFormAxios';
import PageCustomizationService from "@/services/api/pageCustomizationApi";
import { toast } from 'react-toastify';
import SettingsService from '../../../services/api/settingsApi';
import { setToken } from '../../../redux/slices/envSlice';

const Branding = () => {
    const { setSettingsTitle } = useSettingsTitle();
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const dispatch = useDispatch();

    const service = new PageCustomizationService(axiosPrivate, auth);
    const {pageCustomization, pageCustomizationLoading, pageCustomizationError} = useSelector((state) => state.pageCustomization)

    const settingsService = useMemo(() => new SettingsService(axiosPrivate), [axiosPrivate]);
    const storedStatus = localStorage.getItem("tokenizationStatus");
    const tokenizationStatus = storedStatus === "true" || storedStatus === true; 
    // const { env }= useSelector((state) => state.env);
    const env = 'Live';

    const[file, setFile] = useState(null)
    const [preview, setPreview] = useState("../assets/logo.jpg");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setSettingsTitle('Branding');
    }, []);

    const [updateBrand, setUpdateBrand] = useState(false);

    const handleBrandingToggle = async () => {
    if (updateBrand) return;

    setUpdateBrand(true);

    const newTokenStatus = !tokenizationStatus;

    try {
        await settingsService.updateEnv(env, newTokenStatus, dispatch);

        dispatch(setToken(newTokenStatus));
        localStorage.setItem("tokenizationStatus", newTokenStatus);

        toast.success("Brand Logo will now be activated.");
    } catch {
        toast.error("Failed to update branding");
    } finally {
        setUpdateBrand(false);
    }
    }; 

    const handleFileChange = (e) => {
        const selected = e.target.files[0];

        if (!selected) return;

        const maximumFileSize = 5 * 1024 * 1024;
        const allowedFiles = ['image/jpeg', 'image/png', 'image/jpg',];

        if(allowedFiles.size > maximumFileSize){
            toast.error(`${selected.name} is too large. The maximum file size allowed is 5MB.`)
        }
        
        if (!allowedFiles.includes(selected.type)) {
        toast.error(`${selected.name} is not a valid file type. Please upload a JPG, JPEG, or PNG file.`);
        return;
        }
        setFile(selected);
        
        setPreview(URL.createObjectURL(selected));

    }

    const handleLogoUpload = async () => {
         if (!file) return toast("Please select a logo first.");

        const formData = new FormData();
        formData.append("merchantLogo", file);

        setUploading(true);
        await service.pageCustompizationUpload(formData, dispatch);
        setUploading(false);
        toast.success("Logo uploaded successfully!");

    }

    useEffect(() => {
        if (pageCustomization?.merchantLogoCloudinaryUrl) {
            setPreview(pageCustomization.merchantLogoCloudinaryUrl);
        }
    }, [pageCustomization]);

     useEffect(() => {
        const service = new PageCustomizationService(axiosPrivate, auth);
        service.fetchPageCustomization(dispatch);
    }, []);

     if (pageCustomizationLoading && !preview) {
        return <Spinner />;
    }

    if (pageCustomizationError) {
        return <ErrorLayout message={pageCustomizationError} />;
    }

    return (
        <div>
            <div className='bg-white p-6 space-y-6'>
                <div className='flex justify-between'>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Branding</h2>
                        <h3 className="text-gray-600 text-sm">Customize your brand logo. This is what your theme will see across dashboard.</h3>

                    </div>
                    <div className="flex items-center gap-2">
                    <label className="flex items-center cursor-pointer select-none">
                        <div className="relative">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={tokenizationStatus} 
                            onChange={handleBrandingToggle}
                        />

                        <div className="dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                        <div className="w-10 h-5 bg-gray-200 rounded-full shadow-inner peer-checked:bg-green-600 transition-colors duration-200"></div>
                        </div>
                    </label>
                    </div>
                </div>

                <div className="">
                    <div className="flex items-center gap-5">
                        {preview && (
                        <div className="h-24 w-24 border rounded-md">
                            <img
                                src={preview}
                                alt="Preview"
                                className="object-contain w-full h-full"
                            />
                            </div>
                        )}
                        <div>
                            <div className="mt-4">
                                <label
                                    htmlFor="logo"
                                    className="cursor-pointer text-green-600 text-sm "
                                >
                                    Upload Logo
                                </label>
                                <input
                                    type="file"
                                    id="logo"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>

                            <h6 className='text-sm'>PNG, JPG, JPEG, max 5MB</h6>
                        </div>
                    </div>
                </div>

                 
                <button
                    onClick={handleLogoUpload}
                    disabled={uploading}
                    className={`mt-6 w-50 py-2 text-white rounded-md ${
                        uploading ? "bg-gray-400" : "bg-green-700"
                    } transition`}
                >
                    {uploading ? "Uploading..." : "Post Logo"}
                </button>
            </div>
        
        </div>
    )
}

export default Branding
