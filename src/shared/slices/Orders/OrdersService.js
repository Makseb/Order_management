import { BaseUrl } from "../..";
import { Executor } from "../../Executor";


export const getAllOrdersByStroreId = (storeSelected, page, isSilent) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/manager/order/allorders/' + storeSelected + "/" + page,
        isSilent: isSilent,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const getAcceptedOrdersByStroreId = (storeSelected, page, isSilent) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/manager/order/acceptedorders/' + storeSelected + "/" + page,
        isSilent: isSilent,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const getReadyOrdersByStroreId = (storeSelected, page, isSilent) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/manager/order/readydorders/' + storeSelected + "/" + page,
        isSilent: isSilent,
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
