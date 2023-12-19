import { BaseUrl } from "../..";
import { Executor } from "../../Executor";

export const getAllCategoriesByStoreId = (storeSelected) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/owner/menu/getallcategoriesbystoreid/' + storeSelected,
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const updateCategoryAvailabiltyByMode = (data) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/owner/category/updateavailabiltybymode',
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: true,
    });
};

export const updateCategoryAvailabilty = (data) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/owner/category/updateavailabilty',
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: true,
    });
};

export const getAllProductByCategoryByStoreId = (storeSelected, categoryId) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/owner/menu/getallproductsbycategorybystoreid/' + storeSelected + "/" + categoryId,
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const updateProductAvailabilty = (data) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/owner/product/updateavailabilty',
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: true,
    });
};

export const updateProductAvailabiltyByMode = (data) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/owner/product/updateavailabiltybymode',
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: true,
    });
};





