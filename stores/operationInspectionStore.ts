import { makeAutoObservable, reaction, runInAction } from 'mobx';
import {
    FactoryPalletSort,
    PalletSortDetail,
    RegisInspectionInfo,
    SortSetting
} from '@/types/pages/palletSort';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    OPERATING_INSPECTION_STORAGE,
    SORT_SETTINGS
} from '@/enums/storageKey.enum';
import { updatePalletInspection } from '@/modules/operatingInspection/helper';
import RootStores from '@/stores/stores';

export default class OperationInspectionStore {
    rootStore: RootStores;

    onlineFactoryPallets: FactoryPalletSort[] = [];
    sortSetting: SortSetting | null = null;
    bottomPallet: PalletSortDetail | null = null;

    constructor(rootStore: RootStores) {
        this.rootStore = rootStore;
        makeAutoObservable(this);

        reaction(
            () => this.onlineFactoryPallets,
            async (onlineFactoryPallets) => {
                await this.setCachedOperatingInspection(onlineFactoryPallets);
            }
        );

        reaction(
            () => this.sortSetting,
            async (sortSetting) => {
                await this.setCachedSortSetting(sortSetting);
            }
        );
    }

    get currentFactoryPallets(): PalletSortDetail[] {
        const idx = this.onlineFactoryPallets.findIndex(
            (x) => x.factoryId == this.rootStore.factoryStore.factoryId
        );
        if (idx >= 0) {
            return this.onlineFactoryPallets[idx].onlinePallets;
        }
        return [];
    }

    get validOnlinePallet(): PalletSortDetail[] {
        return this.currentFactoryPallets.filter((x) => x.id && x.id !== 0);
    }

    get getSubmitData(): RegisInspectionInfo[] {
        return this.validOnlinePallet.map((item) => ({
            id: item.latestInspectionInfo?.id ?? 0,
            oreDisSouthSWGapPerfType:
                item.latestInspectionInfo?.oreDisSouthSWGapPerfType,
            oreDisNorthSWGapPerfType:
                item.latestInspectionInfo?.oreDisNorthSWGapPerfType,
            versionCode: item.latestCombination?.versionCode ?? 0
        }));
    }

    setSortSetting(sortSetting: SortSetting | null) {
        runInAction(() => {
            this.sortSetting = sortSetting;
        });
    }

    setOnlinePalletInspection(onlineFactoryPallets: FactoryPalletSort) {
        const tempFactoryPallet = [...this.onlineFactoryPallets];
        const replaceIndex = this.onlineFactoryPallets.findIndex(
            (x) => x.factoryId == onlineFactoryPallets.factoryId
        );

        if (replaceIndex >= 0) {
            tempFactoryPallet[replaceIndex].onlinePallets =
                onlineFactoryPallets.onlinePallets;
        } else if (this.onlineFactoryPallets.length == 0) {
            tempFactoryPallet.push({ ...onlineFactoryPallets });
        }

        runInAction(() => {
            this.onlineFactoryPallets = tempFactoryPallet;
        });

        return tempFactoryPallet;
    }

    setBottomPallet(pallet: PalletSortDetail) {
        this.bottomPallet = pallet;
    }

    handleChangePalletInspection(
        gapType: number,
        gapVal: number,
        sortDetail: PalletSortDetail
    ) {
        const tempFactoryPallet = [...this.onlineFactoryPallets];
        const replaceIndex = this.onlineFactoryPallets.findIndex(
            (x) => x.factoryId == this.rootStore.factoryStore.factoryId
        );

        if (replaceIndex >= 0) {
            tempFactoryPallet[replaceIndex].onlinePallets =
                updatePalletInspection(
                    tempFactoryPallet[replaceIndex].onlinePallets ?? [],
                    gapType,
                    gapVal,
                    sortDetail,
                    this.sortSetting
                );

            runInAction(() => {
                this.onlineFactoryPallets = tempFactoryPallet;
            });
        }
    }

    async initGetOnlinePallets() {
        const jsonValue = await AsyncStorage.getItem(
            OPERATING_INSPECTION_STORAGE
        );
        runInAction(() => {
            this.onlineFactoryPallets = JSON.parse(jsonValue ?? '[]');
        });
    }

    async setCachedOperatingInspection(
        onlineFactoryPallets: FactoryPalletSort[]
    ) {
        const jsonValue = JSON.stringify(onlineFactoryPallets);
        await AsyncStorage.setItem(OPERATING_INSPECTION_STORAGE, jsonValue);
    }

    async setCachedSortSetting(sortSetting: SortSetting | null) {
        const jsonValue = JSON.stringify(sortSetting);
        await AsyncStorage.setItem(SORT_SETTINGS, jsonValue);
    }

    async initSortSetting() {
        const jsonValue = await AsyncStorage.getItem(SORT_SETTINGS);
        runInAction(() => {
            this.sortSetting = JSON.parse(jsonValue ?? 'null');
        });
    }
}
