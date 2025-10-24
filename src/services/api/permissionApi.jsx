import { toast } from "react-toastify";
import { aggregatorPermissionsFailure, aggregatorPermissionsStart, aggregatorPermissionsSuccess, permissionsFailure, permissionsStart, permissionsSuccess, updatePermissionsFailure, updatePermissionsStart, updatePermissionsSuccess } from "@/redux/slices/permissionSlice";

class PermissionService {
    constructor(axiosPrivate, auth) {
      this.axiosPrivate = axiosPrivate;
      this.auth = auth;
    }

    // permissions
  
    async fetchPermission() {
      try {
  const res = await this.axiosPrivate.get('api/Permissions');
  return res.data;
      } catch (err) {
        if (!err.response) {
            // dispatch(invoiceFailure('No response from server'));
        } else {
            // dispatch(invoiceFailure('Failed to load Customer permission. Try again.'));
        }
  }
    }

    // role permission
  
    async fetchRolePermission(roleId, aggregatorCode, dispatch) {
      dispatch(permissionsStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/RolePermission/${roleId}/permissions/${aggregatorCode}`
        );
        const data = response.data.responseData;
        dispatch(permissionsSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(permissionsFailure('No response from server'));
        } else {
            dispatch(permissionsFailure('Failed to load permissions. Try again.'));
        }
  }
    }
  
    async fetchAggregatorRolePermission(roleId, aggregatorCode, pageSize, pageNumber, dispatch) {
      dispatch(aggregatorPermissionsStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/RolePermission/${roleId}/aggregator/${aggregatorCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`
        );
        const data = response.data?.responseData;
        console.log('Fetched aggregator role permission data:', data);
        dispatch(aggregatorPermissionsSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorPermissionsFailure('No response from server'));
        } else {
            dispatch(aggregatorPermissionsFailure('Failed to load Customer permission. Try again.'));
        }
  }
    }
  
    async createRolePermission(merchantCode, formData) {
      try {
        await this.axiosPrivate.post(
          `api/RolePermission/${merchantCode}`,
          JSON.stringify(formData),
          {
    headers: {
      "Content-Type": "application/json"
    }
  }
          // formData
        );
        toast('Permission created successfully');
      } catch (err) {
        if (!err.response) {
          toast('No response from server');
      } else {
          toast('Failed to create role permission. Try again.');
        }
  }
    }
  
    async updateAggregatorRolePermission(roleId, aggregatorCode, formData, dispatch) {
      try {
        dispatch(updatePermissionsStart());
        await this.axiosPrivate.put(
          `api/RolePermission/${roleId}/aggregator/${aggregatorCode}`,
          // JSON.stringify(formData)
          formData
        );
        toast('Permission updated successfully');
        dispatch(updatePermissionsSuccess());
      } catch (err) {
        if (!err.response) {
          toast('No response from server');
          dispatch(updatePermissionsFailure());
      } else {
          toast('Failed to update role permission. Try again.');
          dispatch(updatePermissionsFailure());
        }
  }
    }
  
    async activateAggregatorRolePermission(roleId, aggregatorCode) {
      try {
  await this.axiosPrivate.put(`api/RolePermission/activate/${roleId}/aggregator/${aggregatorCode}`);
        toast('Permission activated successfully');
      } catch (err) {
        if (!err.response) {
          toast('No response from server');
      } else {
          toast('Failed to load Customer permission. Try again.');
        }
  }
    }
  
    async deactivateAggregatorRolePermission(roleId, aggregatorCode) {
      try {
  await this.axiosPrivate.put(`api/RolePermission/deactivate/${roleId}/aggregator/${aggregatorCode}`);
        toast('Permission deactivated successfully');
      } catch (err) {
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to load Customer permission. Try again.');
        }
  }
    }
  
    async fetchUserRolePermission(aggregatorCode) {
      try {
  const res = await this.axiosPrivate.get(`api/RolePermission/user/${aggregatorCode}`);
  return res.data;
      } catch (err) {
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to load Customer permission. Try again.');
        }
      }
    }

    // roles
    
      // async fetchUserRolePermission(aggregatorCode) {
      //   try {
      //     const response = await this.axiosPrivate.get(
      //       `api/RolePermission/user/${aggregatorCode}`
      //     );
      //     return response.data;
      //   } catch (err) {
      //     if (!err.response) {
      //         // dispatch(invoiceFailure('No response from server'));
      //     } else {
      //         // dispatch(invoiceFailure('Failed to load Customer permission. Try again.'));
      //     }
  //   }
      // }

  }
  
  export default PermissionService;