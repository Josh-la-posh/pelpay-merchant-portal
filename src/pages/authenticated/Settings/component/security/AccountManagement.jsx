// React import removed: using automatic JSX runtime
import useAuth from '@/services/hooks/useAuth';
import useAxiosPrivate from '@/services/hooks/useAxiosPrivate';
import UserService from '@/services/api/userApi';
import { useDispatch } from 'react-redux';

function AccountManagement() {
    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();
    const { auth } = useAuth();
    const merchantCode = auth?.merchantCode;
    const userService = new UserService(axiosPrivate, auth);


    // reference variables to keep linter happy
    void dispatch;
    void merchantCode;
    void userService;

    const handleDeactivate = () => {
        // Logic for deactivating account
        alert("Account deactivated!");
    };

    const handleActivate = () => {
        if (window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
            // Logic for deleting account
            alert("Account permanently deleted!");
        }
    };

    // const activateAccount = async () => {
    //     if (merchantCode) {
    //       await userService.activateAccount(
    //         merchantCode,
    //         pageNumber,
    //         pageSize,
    //         env,
    //         dispatch
    //       );
    //     }
    //   };

    //   const deactivateAccount = async () => {
    //       if (merchantCode) {
    //         await userService.fetchDisputes(
    //           merchantCode,
    //           pageNumber,
    //           pageSize,
    //           env,
    //           dispatch
    //         );
    //       }
    //     };

    return (
        <div className="mb-8 bg-white px-5 py-4">
            <h2 className="text-xl font-medium mb-4">Account Management</h2>
            <div className="flex flex-col md:flex-row gap-3">
                <button 
                    onClick={handleActivate}
                    className="py-3 px-8 bg-priColor text-xs font-[500] rounded-md text-white"
                >
                    Activate Account
                </button>
                <button 
                    onClick={handleDeactivate}
                    className="py-3 px-8 bg-yellow-600 text-xs font-[500] rounded-md text-white"
                >
                    Deactivate Account
                </button>
            </div>
        </div>
    );
}

export default AccountManagement;
