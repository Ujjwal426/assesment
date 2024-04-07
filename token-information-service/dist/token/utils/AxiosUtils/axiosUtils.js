"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AxiosUtils {
}
AxiosUtils.axiosConfigConstructor = (method, endpoint, data, headers, params) => {
    return {
        method: method,
        url: endpoint,
        headers: {
            ...headers,
        },
        data: data,
        params: params,
    };
};
exports.default = AxiosUtils;
//# sourceMappingURL=axiosUtils.js.map