import { RequestPayload } from '@/types/global';
import axios from '@/plugins/axios';
import baseAxios, { AxiosRequestConfig } from 'axios';
import { TIME_OUT } from '@/constants/AxiosConst';

class BaseModel {
    static baseUrl = '';

    static async checkAIP<T>(url: string, config?: AxiosRequestConfig<any>) {
        const baseInstance = baseAxios.create();
        baseInstance.defaults.timeout = TIME_OUT;
        baseInstance.defaults.baseURL = `http://${url}:5025`;
        baseInstance.defaults.headers.common['Accept'] = 'text/html';
        return baseInstance.get<T>('/swagger/index.html', {
            ...config
        });
    }

    static async index<T>(
        query?: RequestPayload,
        config?: AxiosRequestConfig<any>
    ) {
        return axios.instance.get<T>(`/${this.baseUrl}`, {
            ...config,
            params: query
        });
    }

    static async show<T>(
        id: string,
        query?: RequestPayload,
        config?: AxiosRequestConfig<any>
    ) {
        return axios.instance.get<T>(`/${this.baseUrl}/${id}`, {
            ...config,
            params: query
        });
    }

    static async update<T>(
        id: string,
        data?: RequestPayload,
        config?: AxiosRequestConfig<any>
    ) {
        return axios.instance.put<T>(`/${this.baseUrl}/${id}`, data, config);
    }

    static async destroy<T>(id: string, config?: AxiosRequestConfig<any>) {
        return axios.instance.delete<T>(`/${this.baseUrl}/${id}`, config);
    }

    static async store<T>(
        data?: RequestPayload,
        config?: AxiosRequestConfig<any>
    ) {
        return axios.instance.post<T>(`/${this.baseUrl}`, data, config);
    }
}

export default BaseModel;
