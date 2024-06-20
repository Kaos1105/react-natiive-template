import { Dayjs } from "dayjs";
import { PaginationResource } from "../common/tablePage";
import { PalletDropdown } from "./repairHistory";

export interface IUnevennessInfoCollection {
    id: number;
    pallet: PalletDropdown;
    palletId: number;
    unevennessInfoDetail: LatestInfoDetail[];
    measurementTiming: number[];
    measuringDate: number;
}

export type LatestInfoDetail = {
    detailAvgVal: number;
    detailMaxVal: number;
    id: number;
    measurementPart: number;
    measurementTiming: number;
    measuringDate: number;
    unevennessInfoId: number;
};
export interface IUnevennessInfoList {
    pagedList: PaginationResource<IUnevennessInfoCollection>;
}

export interface IDropdownUnevenness {
    palletDropdown: PalletDropdown[];
    yearDropdown: number[];
}
export type UnevennessInfo = {
    id: number;
    palletId: number;
    managementCode: string;
};
export type Factory = {
    id: number;
    name: string;
    code: string;
    useClassification: number;
};
export type Pallet = PalletDropdown & {
    factory: Factory;
};
export interface IUnevennessInfoDetail extends ValUnevenness {
    unevennessInfo: UnevennessInfo;
    pallet: Pallet;
    detailAvgVal: number;
    detailMaxVal: number;
    useClassification: number;
    comment?: string | null;
    measurementPart?: number;
    measuringDate?: string | Dayjs;
    measurementTiming?: number;
    id?: number;
    unevennessInfoId: number;
    palletImgPath: string;
    colorMapImgPath: string;
    blkRange?: string;
}
export type ValUnevenness = {
    avgValUnevennessBlkA?: number;
    avgValUnevennessBlkB?: number;
    avgValUnevennessBlkC?: number;
    avgValUnevennessBlkD?: number;
    avgValUnevennessBlkE?: number;
    avgValUnevennessBlkF?: number;
    avgValUnevennessBlkG?: number;
    avgValUnevennessBlkH?: number;
    maxValUnevennessBlkA?: number;
    maxValUnevennessBlkB?: number;
    maxValUnevennessBlkC?: number;
    maxValUnevennessBlkD?: number;
    maxValUnevennessBlkE?: number;
    maxValUnevennessBlkF?: number;
    maxValUnevennessBlkG?: number;
    maxValUnevennessBlkH?: number;
};
export type UnevennessInfoDetailSubmit = ValUnevenness & {
    id: number;
    measuringDate: null | Dayjs | string;
    measurementTiming: number;
    measurementPart: number;
    comment: string | null;
};
export type TypeErrorRecord = {
    errorContent: string;
    errorField: string;
    errorRow: number;
    errorValue: string;
    palletCode: string;
    managementCode: string;
};

export interface IUnevennessImport {
    totalExcelRecords: number;
    totalDBExistedRecords: number;
    totalImportedRecords: number;
    totalErrorRecords: number;
    importedRecords: ValUnevenness[];
    errorRecords: TypeErrorRecord[];
    errCsvPath: string;
    errCsvPaths: string[];
}
