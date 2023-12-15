import { BaseUrl } from "../..";
import { Executor } from "../../Executor";

export const getAllCategoriesByStoreId = (storeSelected) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/owner/store/getallcategoriesbystoreid/' + storeSelected,
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: false,
    });
};