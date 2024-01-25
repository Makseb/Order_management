import { BaseUrl } from "../..";
import { Executor } from "../../Executor";

export const getAllCategoriesByStoreId = (storeSelected) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/manager/menu/getallcategoriesbystoreid/' + storeSelected,
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const updateCategoryAvailabiltyByMode = (data) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/manager/category/updateavailabiltybymode',
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const updateCategoryAvailabilty = (data) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/manager/category/updateavailabilty',
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const getAllProductByCategoryByStoreId = (storeSelected, categoryId) => {
    return Executor({
        method: 'get',
        url: BaseUrl + '/manager/menu/getallproductsbycategorybystoreid/' + storeSelected + "/" + categoryId,
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const updateProductAvailabilty = (data) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/manager/product/updateavailabilty',
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: false,
    });
};

export const updateProductAvailabiltyByMode = (data) => {
    return Executor({
        method: 'put',
        data,
        url: BaseUrl + '/manager/product/updateavailabiltybymode',
        isSilent: false,
        withErrorToast: false,
        withSuccessToast: false,
    });
};





