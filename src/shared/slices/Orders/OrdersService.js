import { BaseUrl } from "../..";
import { Executor } from "../../Executor";

export const getAllOrdersByStroreId = (storeSelected) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/client/order/allorders/' + storeSelected,
        isSilent: false,
        successFun: () => {
            // saveUserData(data);
            // saveToken(data);
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const updateOrderStatus = (data) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/client/order/updatestatus',
        isSilent: false,
        successFun: () => {
            // saveUserData(data);
            // saveToken(data);
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
}

export const getAcceptedOrdersByStroreId = (storeSelected) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/client/order/acceptedorders/' + storeSelected,
        isSilent: false,
        successFun: () => {
            // saveUserData(data);
            // saveToken(data);
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};
