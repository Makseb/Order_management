import { BaseUrl, store } from "../..";
import { Executor } from "../../Executor";

import { setLoggedInUser,setToken } from "./AuthSlice";

export const login = (data) => {
    return Executor({
        method: 'post',
        url: BaseUrl + '/client/login-',
        data,
        isSilent: false,
        successFun: (data) => {
            console.log(data)
            saveUserData(data);
            // saveToken(data);
        },
        // errorFun: (data) => {
        //     //console.log(data)
        //     // saveUserData(data);
        //     // saveToken(data);
        // },
        withErrorToast: true,
        withSuccessToast: false,
    });
};


const saveUserData = (data) => {
    store.dispatch(setLoggedInUser(data));
}


/*const saveToken = (data) => {
    store.dispatch(setToken(data.data.signinToken));
    AsyncStorage.setItem('token', data.data.signinToken);
};*/

