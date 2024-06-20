import { FactoryItemResource } from '@/types/pages/factory';
import axios from '@/plugins/axios';
import BaseModel from '@/model/BaseModel';

class Factory extends BaseModel {
    static baseUrl = 'factory';

    // static index = async<T>(query?: RequestPayload, config?: AxiosRequestConfig<any> ) => {
    //     return axios.get<T>(`/${this.baseUrl}`, {...config, params:query});
    // }
    static async getMainDropdown() {
        return axios.instance.get<FactoryItemResource[]>(
            `/${this.baseUrl}/mainDropdown`
        );
    }
}

export default Factory;
