import axios from '@/plugins/axios';
import BaseModel from '@/model/BaseModel';
import {
    OperatingInspectionList,
    PalletSortList
} from '@/types/pages/palletSort';

class OperatingInspection extends BaseModel {
    static baseUrl = 'operatingInspection';

    static async getListOperatingInspection(factoryId: string) {
        return axios.instance.get<PalletSortList>(
            `/${this.baseUrl}/list/${factoryId}`
        );
    }

    static async regisOperatingInspection(
        factoryId: string,
        data: OperatingInspectionList
    ) {
        return axios.instance.post<PalletSortList>(
            `/${this.baseUrl}/storeInspection/${factoryId}`,
            data
        );
    }

    static async regisCachedOperatingInspection<T>(
        factoryId: string,
        data: OperatingInspectionList
    ) {
        return axios.instance.post<T & PalletSortList>(
            `/${this.baseUrl}/storeCachedInspection/${factoryId}`,
            data
        );
    }
}

export default OperatingInspection;
