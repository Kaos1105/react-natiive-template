import BaseModel from '@/model/BaseModel';
import { RequestPayload } from '@/types/global';
import { AxiosRequestConfig } from 'axios';
import axios from '@/plugins/axios';

class User extends BaseModel {
    static baseUrl = 'user';

    static async login<T>(
        data?: RequestPayload,
        config?: AxiosRequestConfig<any>
    ) {
        return axios.instance.post<T>(`/${this.baseUrl}/login`, data, config);
    }
}

export default User;
