export default class AxiosUtils {
    static axiosConfigConstructor: (method: string, endpoint: string, data: any, headers?: any, params?: any) => {
        method: string;
        url: string;
        headers: any;
        data: any;
        params: any;
    };
}
