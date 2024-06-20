import { Dayjs } from "dayjs";
import type { PaginationResource } from "@/types/common/tablePage";

export type PalletOptions = {
    code: string;
    factoryId: number;
    id: number;
    operatingHour: number;
    operatingMinute: number;
    useClassification: number;
};
export type RepairInfoOptions = {
    startDate?: string;
    endDate?: string;
    factoryId?: number;
    id?: number;
    remark?: string;
    repairClassification?: number | string;
    useClassification?: number;
};
export interface RepairDetails {
    title?: string;
    id?: number | null;
    detailClassification?: number | null;
    repairRemark?: string | null;
    repairDate?: Dayjs | string | null;
    infoClassification?: number | null;
}
export type RepairHistorySubmit = {
    repairInfoId: number | null;
    palletId: number | null;
    repairDetails: RepairDetails[];
};
export interface OptionCreateRepairHistory {
    palletOptions: PalletOptions[];
    repairInfoOptions: RepairInfoOptions[];
}

export interface RepairHistoryDetail {
    palletId?: number;
    id?: number;
    repairInfo?: RepairInfoOptions;
    generalManagement?: RepairDetails;
    overhaulRepair?: RepairDetails;
    sidewallRepair?: RepairDetails;
    overlayRepair?: RepairDetails;
    undercarriageRepair?: RepairDetails;
    combinationInfo?: combinationInfo;
    operatingStatusInfo?: OperatingStatusInfo;
    pallet?: PalletDetail;
}
export interface TypeShowRepairHistory {
    repairDetails: RepairDetails[];
    palletId?: number;
    id?: number;
    repairInfo?: RepairInfoOptions;
}
export type RenderDetail = {
    title?: string;
    repairDetails?: RepairDetails[];
};

export type PalletDropdown = {
    code: string;
    factoryId: number;
    id: number;
    useClassification: number;
};

export interface ListDropdown {
    palletDropdown: PalletDropdown[];
    yearDropdown: number[];
}
export type PalletDetail = {
    code: string;
    factoryId: number;
    id: number;
    useClassification: number;
    cumulativeOperatingMinutes: number;
};
export type CombinationInfo = {
    lineClassification: number;
    sortOrder: number;
};
export interface RepairHistoryCollection {
    id: number;
    pallet: PalletDetail;
    repairDetails: RepairDetails[];
    repairInfo: RepairInfoOptions;
    combinationInfo: CombinationInfo;
    operatingStatusInfo: OperatingStatusInfo;
}
type OperatingStatusInfo = {
    factoryId: number;
    importLastDateTime: string;
};
export interface RepairHistoryList {
    pagedList: PaginationResource<RepairHistoryCollection>;
}

export type ResultReset = {
    updatedRows: number;
};
export type DetailRepairInfo = {
    combinationInfo: CombinationInfo;
    operatingStatusInfo: OperatingStatusInfo;
    pallet: PalletDetail;
};

export type DropdownDetail = {
    detail: RepairHistoryDetail;
};
