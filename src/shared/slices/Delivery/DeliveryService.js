import { BaseUrl } from "../..";
import { Executor } from "../../Executor";

export const getUberToken = () => {
    return Executor({
        method: 'post',
        url: BaseUrl + '/manager/getUberToken',
        isSilent: true,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const createuberdevis = (data, authorization) => {
    return Executor({
        method: 'post',
        head: {
            authuber: authorization,
        },
        url: BaseUrl + '/manager/createquote/' + data._id,
        isSilent: true,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });

};
export const createdelivery = (data, authorization, orderId) => {
    return Executor({
        method: 'post',
        data,
        head: {
            authuber: authorization,
        },
        url: BaseUrl + '/manager/createdelivery/' + orderId,
        isSilent: true,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};
export const getdeliverybyid = (uberId, authorization) => {
    return Executor({
        method: 'post',
        head: {
            authuber: authorization,
        },
        url: BaseUrl + '/manager/getdeliverybid/' + uberId,
        isSilent: false,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const deletedeliverybyid = (uberId, authorization, orderId) => {
    return Executor({
        method: 'post',
        head: {
            authuber: authorization,
        },
        url: BaseUrl + '/manager/cancel/' + uberId + "/" + orderId,
        isSilent: true,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const getproofofdelivery = (uberId, authorization, waypoint) => {
    return Executor({
        method: 'post',
        head: {
            authuber: authorization,
        },
        url: BaseUrl + '/manager/proofofdelivery/' + uberId + "/" + waypoint,
        isSilent: true,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const test = (data) => {
    return Executor({
        method: 'post',
        data,
        // head: {
        //     authuber: authorization,
        // },
        url: BaseUrl + '/delivery/webhook/',
        isSilent: true,
        successFun: () => {
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};