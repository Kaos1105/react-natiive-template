import { ValUnevenness } from '@/types/pages/unevenness';
export type PalletInfoDetail = {
    id?: number;
    code: string;
    cumulativeOperatingMinutes: number | string;
    sortOrder?: number | boolean;
    lineClassification?: number | string | null;
};

export type PalletSetting = {
    gapSwBlock: string;
};

export type Pallet = {
    palletDetail: PalletDetail;
    palletSetting: PalletSetting;
};

export type LatestCombination = {
    lineClassification: number;
    sortOrder: number;
};

export type RepairDetail = {
    id: number;
    repairHistoryId: number;
    detailClassification: number;
    repairDate: string;
    infoClassification: number;
};
export type RepairDetailRender = {
    detailClassification: string | null;
    repairDate: string;
};

export type LatestRepairHistory = {
    repairDetails: RepairDetail[];
};

export type LatestInspectionInfo = {
    checkDateTime: string;
    oreDisSouthSWGapPerfType: number;
    oreDisNorthSWGapPerfType: number;
    oreSuppSouthSWGapPerfType: number;
    oreSuppNorthSWGapPerfType: number;
};

export type UpdateDataInspection = {
    id: number;
    oreDisSouthSWGapPerfType: number;
    oreDisNorthSWGapPerfType: number;
};

export type LatestInspectionInfoDetail = {
    checkDateTime: string;
    oreDischargeSouthSWGap: string;
    oreDischargeNorthSWGap: string;
    oreSupplySouthSWGap: string;
    oreSupplyNorthSWGap: string;
};

export type LatestDetail = {
    measuringDate: string;
    measurementTiming: string | number | null;
};

export type UnevennessInfoDetail = ValUnevenness & {
    measurementPart: number;
    measuringDate: string;
    measurementTiming: number;
    maxUnevennessSoundnessFlg: number;
    avgUnevennessSoundnessFlg: number;
};

export type LatestUnevennessInfo = {
    latestDetail: LatestDetail;
    unevennessInfoDetail: UnevennessInfoDetail[];
};

export interface PalletDetail extends PalletInfoDetail {
    latestCombination: LatestCombination;
    soundnessFlg: number[];
    latestRepairHistory?: LatestRepairHistory;
    latestInspectionInfo: LatestInspectionInfo;
    latestUnevennessInfo: LatestUnevennessInfo;
}

export type UnevennessInfoDetailTable = {
    id: number;
    block: string;
    averageValue_0?: number | string;
    maximumValue_0?: number | string;
    maximumValue_1?: number | string;
    averageValue_1?: number | string;
    maximumValue_2?: number | string;
    averageValue_2?: number | string;
    maximumValue_3?: number | string;
    averageValue_3?: number | string;
};

export type DataSoundness = {
    oreDischargeSouthGap: string;
    oreDischargeNorthGap: string;
    oreSupplySouthGap: string;
    oreSupplyNorthGap: string;
};
