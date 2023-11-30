import { BaseUrl, store } from "../..";
import { Executor } from "../../Executor";

export const getAllOrdersByStroreId = (storeSelected) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/client/orders/'+storeSelected,
        isSilent: true,
        successFun: () => {
            // saveUserData(data);
            // saveToken(data);
        },
        withErrorToast: false,
        withSuccessToast: false,
    });
};

