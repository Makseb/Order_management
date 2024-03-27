import { BaseUrl, store } from "../..";
import { Executor } from "../../Executor";

import { setLoggedInUser, setToken } from "./AuthSlice";

export const login = (data, translation) => {
    return Executor({
        method: 'post',
        url: BaseUrl + '/manager/login-',
        data,
        isSilent: true,
        successFun: (data) => {
            // console.log(data)
            saveUserData(data);
            saveToken(data);
        },
        withErrorToast: true,
        withSuccessToast: false,
    }, translation);
};

const saveUserData = (data) => {
    store.dispatch(setLoggedInUser(data));
}


const saveToken = (data) => {
    store.dispatch(setToken(data));
}

export const getStoresNameAndIdByUserId = (userId) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/manager/getstoresnameandidbyuserid/' + userId,
        isSilent: true,
        successFun: (data) => {

        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

// change store status
export const changeStoreStatus = (data) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/manager/store/changestatus',
        isSilent: true,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};


// change store status
export const forgotpassword = (data, translation) => {
    return Executor({
        method: 'post',
        data,
        url: BaseUrl + '/manager/forgotpassword',
        isSilent: true,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: true,
    }, translation);
};
// change store status
export const resetpassword = (data, token) => {
    // console.log(token);
    return Executor({
        method: 'put',
        head: {
            Authorization: `Bearer ${token}`
        },
        data,
        url: BaseUrl + '/manager/resetpassword',
        isSilent: true,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

