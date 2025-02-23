import { toast } from "react-toastify";
import { invoiceFailure, invoiceStart } from "@/redux/slices/invoiceSlice";
import { aggregatorPermissionsFailure, aggregatorPermissionsStart, aggregatorPermissionsSuccess, permissionsFailure, permissionsStart, permissionsSuccess, updatePermissionsFailure, updatePermissionsStart, updatePermissionsSuccess } from "@/redux/slices/permissionSlice";

class PermissionService {
    constructor(axiosPrivate, auth) {
      this.axiosPrivate = axiosPrivate;
      this.auth = auth;
    }

    // permissions
  
    async fetchPermission() {
      try {
        const response = await this.axiosPrivate.get(
          'api/Permissions'
        );
        console.log('This is the permission data ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            // dispatch(invoiceFailure('No response from server'));
        } else {
            // dispatch(invoiceFailure('Failed to load Customer permission. Try again.'));
        }
      } finally {
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
      } finally {
      }
    }
  
    async fetchAggregatorRolePermission(roleId, aggregatorCode, pageSize, pageNumber, dispatch) {
      dispatch(aggregatorPermissionsStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/RolePermission/${roleId}/aggregator/${aggregatorCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`
        );
        const data = response.data.data;
        dispatch(aggregatorPermissionsSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(aggregatorPermissionsFailure('No response from server'));
        } else {
            dispatch(aggregatorPermissionsFailure('Failed to load Customer permission. Try again.'));
        }
      } finally {
      }
    }
  
    async createRolePermission(merchantCode, formData, dispatch) {
      try {
        const response = await this.axiosPrivate.post(
          `api/RolePermission/${merchantCode}`,
          JSON.stringify(formData)
        );
        toast('Permission created successfully');
      } catch (err) {
        if (!err.response) {
          toast('No response from server');
      } else {
          toast('Failed to load Customer permission. Try again.');
        }
      } finally {
      }
    }
  
    async updateAggregatorRolePermission(roleId, aggregatorCode, formData, dispatch) {
      try {
        dispatch(updatePermissionsStart());
        const response = await this.axiosPrivate.put(
          `api/RolePermission/${roleId}/aggregator/${aggregatorCode}`,
          JSON.stringify(formData)
        );
        toast('Permission updated successfully');
        dispatch(updatePermissionsSuccess());
      } catch (err) {
        if (!err.response) {
          toast('No response from server');
          dispatch(updatePermissionsFailure());
      } else {
          toast('Failed to load Customer permission. Try again.');
          dispatch(updatePermissionsFailure());
        }
      } finally {
      }
    }
  
    async activateAggregatorRolePermission(roleId, aggregatorCode) {
      try {
        const response = await this.axiosPrivate.put(
          `api/RolePermission/activate/${roleId}/aggregator/${aggregatorCode}`
        );
        toast('Permission activated successfully');
      } catch (err) {
        if (!err.response) {
          toast('No response from server');
      } else {
          toast('Failed to load Customer permission. Try again.');
        }
      } finally {
      }
    }
  
    async deactivateAggregatorRolePermission(roleId, aggregatorCode) {
      try {
        const response = await this.axiosPrivate.put(
          `api/RolePermission/deactivate/${roleId}/aggregator/${aggregatorCode}`
        );
        toast('Permission deactivated successfully');
      } catch (err) {
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to load Customer permission. Try again.');
        }
      } finally {
      }
    }
  
    async fetchUserRolePermission(aggregatorCode) {
      try {
        const response = await this.axiosPrivate.get(
          `api/RolePermission/user/${aggregatorCode}`
        );
        console.log('user role permission fetched ', response.data);
        return response.data;
      } catch (err) {
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to load Customer permission. Try again.');
        }
      } finally {
      }
    }

    // roles
    
      async fetchUserRolePermission(aggregatorCode) {
        try {
          const response = await this.axiosPrivate.get(
            `api/RolePermission/user/${aggregatorCode}`
          );
          console.log('user role permission fetched ', response.data);
          return response.data;
        } catch (err) {
          if (!err.response) {
              // dispatch(invoiceFailure('No response from server'));
          } else {
              // dispatch(invoiceFailure('Failed to load Customer permission. Try again.'));
          }
        } finally {
        }
      }

  }
  
  export default PermissionService;