import { FactoryItemResource } from '@/types/pages/factory';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import RootStores from '@/stores/stores';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FACTORIES } from '@/enums/storageKey.enum';

export default class FactoryStore {
    rootStore: RootStores;

    factoryId: number | null = null;
    factories: FactoryItemResource[] = [];

    constructor(rootStore: RootStores) {
        this.rootStore = rootStore;
        makeAutoObservable(this);

        reaction(
            () => this.factories,
            async (factories) => {
                await this.setCachedFactories(factories);
            }
        );
    }

    setFactorySelect(selectedId: number | null) {
        this.factoryId = selectedId;
    }

    get factoryDetail(): FactoryItemResource | undefined {
        return this.factories.find((x) => x.id === this.factoryId);
    }

    setFactoryDropdownList(factories: FactoryItemResource[]) {
        runInAction(() => {
            this.factories = factories;
        });
    }

    async initGetFactories() {
        const jsonValue = await AsyncStorage.getItem(FACTORIES);
        runInAction(() => {
            this.factories = JSON.parse(jsonValue ?? '[]');
        });
    }

    async setCachedFactories(factories: FactoryItemResource[] = []) {
        const jsonValue = JSON.stringify(factories);
        await AsyncStorage.setItem(FACTORIES, jsonValue);
    }
}
