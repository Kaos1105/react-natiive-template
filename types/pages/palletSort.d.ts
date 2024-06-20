import { LatestCombinationInfo } from '@/types/pages/factory';

export interface PalletSortList {
    offlinePallets: PalletSortDetail[];
    onlinePallets: PalletSortDetail[];
    sortSetting: SortSetting | null;
}

export type FactoryPalletSort = {
    factoryId: number;
    onlinePallets: PalletSortDetail[];
};

export type PalletSortDetail = {
    soundnessFlg: number[];
    id: number;
    code: string;
    factoryId: number;
    useClassification: number;
    latestCombination?: LatestCombinationInfo;
    latestInspectionInfo?: LatestInspectionInfo;
};

export type DataPalletAutoSort = {
    onlinePalletIds: number[] | undefined;
    offlinePalletIds: number[] | undefined;
    sortingPalletIds?: number[];
};

export type LatestInspectionInfo = {
    checkDateTime?: string;
    oreDisSouthSWGapPerfType?: number;
    oreDisNorthSWGapPerfType?: number;
    oreSuppSouthSWGapPerfType?: number;
    oreSuppNorthSWGapPerfType?: number;
    id: number;
    factoryId?: number;
    combinationInfoId?: number;
    sortOrder?: number;
};

export type RegisInspectionInfo = LatestInspectionInfo & {
    versionCode: number;
};

export type OperatingInspectionList = {
    operatingInspections: RegisInspectionInfo[];
};

export type OperatingInspection = {
    operatingInspection: LatestInspectionInfo;
};

export type SortSetting = {
    gapSwBlock: string;
    gapUseHole: number;
    gapUseAvg: number;
    gapUseMax: number;
    gapOrOperator: number;
    gapHoleNormal: number[];
    gapHoleCaution: number[];
    gapHoleAbnormal: number[];
    gapHoleUnknown: number[];
    gapAvgNormal: number;
    gapAvgCaution: number;
    gapAvgAbnormal: number;
    gapMaxNormal: number;
    gapMaxCaution: number;
    gapMaxAbnormal: number;
    holeUseAvg: number;
    holeUseMax: number;
    holeOrOperator: number;
    holeAvgNormal: number;
    holeAvgCaution: number;
    holeAvgAbnormal: number;
    holeMaxNormal: number;
    holeMaxCaution: number;
    holeMaxAbnormal: number;
};
