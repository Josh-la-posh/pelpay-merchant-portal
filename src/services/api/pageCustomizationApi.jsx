import { pageCustomizationFailure, pageCustomizationStart, pageCustomizationSuccess } from "../../redux/slices/pageCustomizationSlice";


class PageCustomizationService {
    constructor(axiosPrivate, auth){
        this.axiosPrivate = axiosPrivate;
        this.auth = auth;
    }

    async fetchPageCustomization(dispatch) {
        dispatch(pageCustomizationStart());
        try{   
            const response = await this.axiosPrivate.get(`api/pageCustomization`);
            const data = response.data.responseData;
            dispatch(pageCustomizationSuccess(data));
            // console.log("Page Customization data:", data)
        }
        catch(err){
        if (!err.response) {
                dispatch(pageCustomizationFailure('No response from server'));
            } else {
                dispatch(pageCustomizationFailure('Failed to load pageCustomization. Try again.'));
            }
            console.error('fetchActivities error:', err)
        }
    }

    async pageCustompizationUpload (formData, dispatch){
        dispatch(pageCustomizationStart());
        try{
            const response = await this.axiosPrivate.post(`api/pageCustomization`, 
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
            );

            const data = response?.data
            dispatch(pageCustomizationSuccess(data))
        }
        catch(err){
        if (!err.response) {
                dispatch(pageCustomizationFailure('No response from server'));
            } else {
                dispatch(pageCustomizationFailure('Failed to upload pageCustomization. Try again.'));
            }
            console.error('fetchActivities error:', err)
        }
        
    }
}

export default PageCustomizationService;