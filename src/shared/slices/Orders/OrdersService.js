import { BaseUrl } from "../..";
import { Executor } from "../../Executor";


export const getAllOrdersByStroreId = (storeSelected, page) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/manager/order/allorders/' + storeSelected + "/" + page,
        isSilent: true,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const getAcceptedOrdersByStroreId = (storeSelected) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/manager/order/acceptedorders/' + storeSelected,
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
        url: BaseUrl + '/manager/order/readydorders/' + storeSelected,
        isSilent: false,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const updateOrderStatus = (data, notificationId) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/sse/order/updatestatus/' + notificationId,
        isSilent: false,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
}
