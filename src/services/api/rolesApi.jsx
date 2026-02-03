import { toast } from "react-toastify";
import { rolesFailure, rolesStart, rolesSuccess, updateRolesFailure, updateRolesStart, updateRolesSuccess, userRolesFailure, userRolesStart, userRolesSuccess } from "@/redux/slices/roleSlice";

class RoleService {
    constructor(axiosPrivate, auth) {
      this.axiosPrivate = axiosPrivate;
      this.auth = auth;
    }

    // roles
  
    async fetchRolesByAggregatorCode(aggregatorCode, dispatch) {
      dispatch(rolesStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Roles/user/${aggregatorCode}`
        );
        const data = response.data;
        dispatch(rolesSuccess(data));
        localStorage.setItem('roles', JSON.stringify(data));
        return data;
      } catch (err) {
        if (!err.response) {
            dispatch(rolesFailure('No response from server'));
        } else {
            dispatch(rolesFailure('Failed to load user role. Try again.'));
        }
      }
    }
  
    async fetchRolesByUserId(userId, aggregatorCode, dispatch) {
      dispatch(userRolesStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Roles/user/aggregator/${userId}?aggregatorCode=${aggregatorCode}`
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
        
      }
    }
  
    async fetchRoles(aggregatorCode, dispatch) {
      dispatch(rolesStart());
      try {
        const response = await this.axiosPrivate.get(
          `api/Roles?aggregatorCode=${aggregatorCode}`
        );
        
        const data = response.data.responseData;
        // 
        dispatch(rolesSuccess(data));
      } catch (err) {
        if (!err.response) {
            dispatch(rolesFailure('No response from server'));
        } else {
            dispatch(rolesFailure('Failed to load Customer permission. Try again.'));
        }
        
      }
    }
  
    async createRole(aggregatorCode, formData,  dispatch) {
      
      try {
        await this.axiosPrivate.post(
          `api/Roles/${aggregatorCode}`,
          JSON.stringify(formData),
          {
            headers: {
              "Content-Type": "application/json"
            }
         }
        );
        toast('Role created successfully');
        await this.fetchRoles(aggregatorCode, dispatch);
        
      } catch (err) {
        if (!err.response) {
          dispatch(updateRolesFailure('No response from server'));
        } else {
          dispatch(updateRolesFailure('Failed to update role details. Try again.'));
        }
        
      }
    }
  
    async updateRolesById(Id,  aggregatorCode, formData, dispatch) {
      dispatch(updateRolesStart());
      try {
        await this.axiosPrivate.put(
          `api/Roles/${Id}/${aggregatorCode}`,
          formData
        );
        toast('Role updated successfully');
        dispatch(updateRolesSuccess());
        await this.fetchRoles(aggregatorCode,  dispatch);
      } catch (err) {
        if (!err.response) {
          dispatch(updateRolesFailure('No response from server'));
        } else {
          dispatch(updateRolesFailure('Failed to update role details. Try again.'));
        }
        
      }
    }
  
    async activateRole(Id, aggregatorCode,  dispatch) {
      try {
        await this.axiosPrivate.put(
          `api/Roles/${Id}/activate/${aggregatorCode}`
        );
        toast('Role activated successfully');
        await this.fetchRoles(aggregatorCode,  dispatch);
      } catch (err) {
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to activate role. Try again.');
        }
        
      }
    }
  
    async deactivateRole(Id, aggregatorCode, dispatch) {
      try {
        await this.axiosPrivate.put(
          `api/Roles/${Id}/deactivate/${aggregatorCode}`
        );
        toast('Role deactivated successfully');
        await this.fetchRoles(aggregatorCode, dispatch);
      } catch (err) {
        if (!err.response) {
            toast('No response from server');
        } else {
            toast('Failed to deactivate role. Try again.');
        }
        
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
        
      }
    }


    // user roles
  
    async fetchAllUserRoles(merchantCode, pageSize, pageNumber) {
        try {
          const response = await this.axiosPrivate.get(
            `api/UserRole/all/${merchantCode}?pageSize=${pageSize}&pageNumber=${pageNumber}`
          );
          return response.data;
        } catch (err) {
          if (!err.response) {
              // dispatch(invoiceFailure('No response from server'));
          } else {
              // dispatch(invoiceFailure('Failed to load Customer permission. Try again.'));
          }
          
        }
      }
  
    async addUserRole(merchantCode, formData) {
        try {
          await this.axiosPrivate.post(
            `api/UserRole/addrole/${merchantCode}`,
            JSON.stringify(formData),
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          toast.success('User role assigned successfully');
        } catch (err) {
          if (!err.response) {
              toast('No response from server');
          } else {            
            toast.error(err.response.data.message)
          }
          
        }
    }
  
      async removeUserRole(userId, merchantCode) {
        try {
          await this.axiosPrivate.post(
            `api/UserRole/removerole/${userId}/merchant/${merchantCode}`,
          );
          toast('User role removed successfully');
        } catch (err) {
          if (!err.response) {
              // dispatch(invoiceFailure('No response from server'));
          } else {
              // dispatch(invoiceFailure('Failed to load Customer permission. Try again.'));
          }
          
        }
      }
  
      async fetchUserRoleByMerchantCode(merchantCode, dispatch) {
         dispatch(rolesStart());
          try {
            const response = await this.axiosPrivate.get(
              `api/UserRole/${merchantCode}`
            ); 
            const data = response.data?.responseData;
            dispatch(rolesSuccess(data));
            // localStorage.setItem('roles', JSON.stringify(data));
            return data;
          } catch (err) { 
            if (!err.response) {
              dispatch(rolesFailure('No response from server'));
            } else {
              dispatch(rolesFailure('Failed to load user role. Try again.'));
            }
            
          }
        }

  }
  
  export default RoleService; 