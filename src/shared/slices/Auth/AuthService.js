import { BaseUrl, store } from "../..";
import { Executor } from "../../Executor";

import { setLoggedInUser, setToken } from "./AuthSlice";

export const login = (data) => {
    return Executor({
        method: 'post',
        url: BaseUrl + '/owner/login-',
        data,
        isSilent: false,
        successFun: (data) => {
            // console.log(data)
            saveUserData(data);
            saveToken(data);
        },
        withErrorToast: true,
        withSuccessToast: false,
    });
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
        url: BaseUrl + '/owner/getstoresnameandidbyuserid/' + userId,
        isSilent: false,
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
        url: BaseUrl + '/owner/store/changestatus',
        isSilent: false,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: true,
    });
};


