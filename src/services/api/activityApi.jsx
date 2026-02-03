import { activityStart, activitySuccess, activityFailure } from "../../redux/slices/activitySlice";

class ActivityService {
    constructor(axiosPrivate, auth) {
        this.axiosPrivate = axiosPrivate;
        this.auth = auth;
    }

    buildQuery(merchantCode, pageNumber, pageSize, filters = {}) {
        const params = new URLSearchParams();

        if (filters.action) params.append("action", filters.action);
        if (pageNumber) params.append("pageNumber", pageNumber);
        if (pageSize) params.append("pageSize", pageSize);
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);

        const mapping = ['action', 'startDate', 'endDate'];

        mapping.forEach((key) => {
            const value = filters[key];
            if (value) params.set(key, value);
        });

        return `api/Activities/${merchantCode}?${params.toString()}`;
    }

    async fetchActivities(merchantCode, filters, pageNumber, pageSize, dispatch){
        dispatch(activityStart());
        try{
            const url = this.buildQuery(merchantCode, pageNumber, pageSize, filters);
            const response = await this.axiosPrivate.get(url);
            const data = response.data.responseData;
            dispatch(activitySuccess(data));
        }
        catch(err){
            if (!err.response) {
                dispatch(activityFailure('No response from server'));
            } else {
                dispatch(activityFailure('Failed to load Activities. Try again.'));
            }
            console.error('fetchActivities error:', err);
        }
    }    
}

export default ActivityService;