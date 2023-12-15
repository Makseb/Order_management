import { BaseUrl } from "../..";
import { Executor } from "../../Executor";

export const getAllOrdersByStroreId = (storeSelected) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/owner/order/allorders/' + storeSelected,
        isSilent: false,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const getAcceptedOrdersByStroreId = (storeSelected) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/owner/order/acceptedorders/' + storeSelected,
        isSilent: false,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const getReadyOrdersByStroreId = (storeSelected) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/owner/order/readydorders/' + storeSelected,
        isSilent: false,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const updateOrderStatus = (data) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/owner/order/updatestatus',
        isSilent: false,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
}