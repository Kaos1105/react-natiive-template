import { createContext, useContext } from 'react';
import CommonStore from './commonStore';
import FactoryStore from './factoryStore';
import OperationInspectionStore from '@/stores/operationInspectionStore';

export default class RootStores {
    commonStore: CommonStore;
    factoryStore: FactoryStore;
    operationInspectionStore: OperationInspectionStore;
    constructor() {
        this.commonStore = new CommonStore(this);
        this.factoryStore = new FactoryStore(this);
        this.operationInspectionStore = new OperationInspectionStore(this);
    }
}

export const stores: RootStores = new RootStores();

export const StoreContext = createContext(stores);

export function useStore() {
    return useContext(StoreContext);
}
