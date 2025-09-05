import { toast } from "react-toastify";
import { rolesFailure, rolesStart, rolesSuccess, updateRolesFailure, updateRolesStart, updateRolesSuccess, userRolesFailure, userRolesStart, userRolesSuccess } from "@/redux/slices/roleSlice";

class RoleService {
    constructor(axiosPrivate, auth) {
      this.axiosPrivate = axiosPrivate;
      this.auth = auth;
    }

    // roles
  
    async fetchRolesByAggregatorCode(aggregatorCode) {
      try {
        const response = await this.axiosPrivate.get(
          `api/Roles/user/${aggregatorCode}`
        );
        
        return response.data;
      } catch (err) {
        if (!err.response) {
            // dispatch(invoiceFailure('No response from server'));
        } else {
            // dispatch(invoiceFailure('Failed to load Customer permission. Try again.'));
        }
        console.error('fetchRolesByAggregatorCode error:', err);
      }
    }
  
    async fetchRolesByUserId(userId, merchantCode, aggregatorCode, dispatch) {
      dispatch(userRolesStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Roles/user/${userId}/${merchantCode}?aggregatorCode=${aggregatorCode}`
        );
        const data = response.data.responseData;
        dispatch(userRolesSuccess(data));
      } catch (err) {
        if (!err.response) {
            toast('No response from server');
            dispatch(userRolesFailure('No response from server'));
        } else {
          toast('Failed to fetch user roles');
            dispatch(userRolesFailure('Failed to fetch user roles'));
        }
        console.error('fetchRolesByUserId error:', err);
      }
    }
  
    async fetchRoles(aggregatorCode, merchantCode, dispatch) {
      dispatch(rolesStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Roles/${merchantCode}?aggregatorCode=${aggregatorCode}`
        );
        
        const data = response.data.responseData;
        dispatch(rolesSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(rolesFailure('No response from server'));
        } else {
            dispatch(rolesFailure('Failed to load Customer permission. Try again.'));
        }
        console.error('fetchRoles error:', err);
      }
    }
  
    async createRole(aggregatorCode, formData, merchantCode, dispatch) {
      try {
        await this.axiosPrivate.post(
          `api/Roles/${aggregatorCode}`,
          JSON.stringify(formData)
        );
        toast('Role created successfully');
        await this.fetchRoles(aggregatorCode, merchantCode, dispatch);
      } catch (err) {
        if (!err.response) {
          dispatch(updateRolesFailure('No response from server'));
        } else {
          dispatch(updateRolesFailure('Failed to update role details. Try again.'));
        }
        console.error('createRole error:', err);
      }
    }
  
    async updateRolesById(id, merchantCode, aggregatorCode, formData, dispatch) {
      dispatch(updateRolesStart());
      try {
        await this.axiosPrivate.put(
          `api/Roles/${id}/${merchantCode}?aggregatorCode=${aggregatorCode}`,
          JSON.stringify(formData)
        );
        toast('Role updated successfully');
        dispatch(updateRolesSuccess());
        await this.fetchRoles(aggregatorCode, merchantCode, dispatch);
      } catch (err) {
        if (!err.response) {
          dispatch(updateRolesFailure('No response from server'));
        } else {
          dispatch(updateRolesFailure('Failed to update role details. Try again.'));
        }
        console.error('updateRolesById error:', err);
      }
    }
  
    async activateRole(id, aggregatorCode, merchantCode, dispatch) {
      try {
        await this.axiosPrivate.put(
          `api/Roles/${id}/activate/${aggregatorCode}`
        );
        toast('Role activated successfully');
        await this.fetchRoles(aggregatorCode, merchantCode, dispatch);
      } catch (err) {
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to activate role. Try again.');
        }
        console.error('activateRole error:', err);
      }
    }
  
    async deactivateRole(id, aggregatorCode, merchantCode, dispatch) {
      try {
        await this.axiosPrivate.put(
          `api/Roles/${id}/deactivate/${aggregatorCode}`
        );
        toast('Role deactivated successfully');
        await this.fetchRoles(aggregatorCode, merchantCode, dispatch);
      } catch (err) {
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to deactivate role. Try again.');
        }
        console.error('deactivateRole error:', err);
      }
    }
  
    async removeRole(roleId, userId) {
      try {
        await this.axiosPrivate.put(
          `api/Roles/${roleId}/user/${userId}/remove`
        );
        toast('User role removed successfully');
      } catch (err) {
        if (!err.response) {
            // dispatch(invoiceFailure('No response from server'));
        } else {
          
            // dispatch(invoiceFailure('Failed to load Customer permission. Try again.'));
        }
        console.error('removeRole error:', err);
      }
    }


    // user roles
  
    async fetchAllUserRoles(merchantCode, pageSize, pageNumber) {
        try {
          const response = await this.axiosPrivate.get(
            `api/UserRoles/all/${merchantCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`
          );
          
          return response.data;
        } catch (err) {
          if (!err.response) {
              // dispatch(invoiceFailure('No response from server'));
          } else {
              // dispatch(invoiceFailure('Failed to load Customer permission. Try again.'));
          }
          console.error('fetchAllUserRoles error:', err);
        }
      }
  
    async addUserRole(merchantCode, formData) {

        try {
          await this.axiosPrivate.post(
            `api/UserRoles/addrole/${merchantCode}`,
            JSON.stringify(formData)
          );
          toast.success('User role assigned successfully');
        } catch (err) {
          if (!err.response) {
              toast('No response from server');
          } else {            
            toast.error(err.response.data.message)
          }
          console.error('addUserRole error:', err);
        }
      }
  
      async removeUserRole(userRoleId, merchantCode) {
        try {
          await this.axiosPrivate.post(
            `api/UserRoles/removerole/${userRoleId}/merchant/${merchantCode}`,
          );
          toast('User role removed successfully');
        } catch (err) {
          if (!err.response) {
              // dispatch(invoiceFailure('No response from server'));
          } else {
              // dispatch(invoiceFailure('Failed to load Customer permission. Try again.'));
          }
          console.error('removeUserRole error:', err);
        }
      }
  
      async fetchUserRolesBytMerchantCode(merchantCode) {
          try {
            const response = await this.axiosPrivate.get(
              `api/UserRoles/${merchantCode}`
            );
            
            return response.data;
          } catch (err) {
            if (!err.response) {
                // dispatch(invoiceFailure('No response from server'));
            } else {
                // dispatch(invoiceFailure('Failed to load Customer permission. Try again.'));
            }
            console.error('fetchUserRolesBytMerchantCode error:', err);
          }
        }

  }
  
  export default RoleService;