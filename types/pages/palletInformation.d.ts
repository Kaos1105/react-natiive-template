import { Dayjs } from "dayjs";
import { PaginationResource } from "../common/tablePage";
import { STATISTIC_FLG, USE_FLG } from "@/enums/commonFlg.enum";
import { IUnevennessImport } from "@/types/pages/unevenness";

export interface IPalletDropdown {
    bringingInYears: number[];
    palletCodes: string[];
}

export interface IPalletListCollection {
    bringInDate: string | Dayjs | null;
    removalDate: string | Dayjs | null;
    createdDate: string;
    size: string;
    id: number;
    code: string;
    factoryId: number;
    useClassification?: number;
    dspOrderNum?: number;
    remark?: string;
    statisticClassification?: number;
}
export type PageList = {
    pagination: PaginationResource;
    collection: IPalletListCollection[];
};
export interface IPalletList {
    pagedList: PageList;
}

export type PalletInfoDisplay = {
    palletNumber: string;
    size: string;
    bringInDate?: string;
    removalDate?: string;
    displayOtherNumber?: number;
    statisticClassification?: string | null;
    useClassification?: string | null;
    remark?: string;
};

export type FormUpdatePalletSubmit = {
    id?: number;
    size: string;
    bringInDate: string | null;
    removalDate: string | null;
    dspOrderNum: number;
    remark: string;
    statisticClassification: typeof STATISTIC_FLG[keyof typeof STATISTIC_FLG];
    useClassification: typeof USE_FLG[keyof typeof USE_FLG];
};

export type FormUpdatePallet = {
    id?: number;
    size: string;
    bringInDate: string | Dayjs | null;
    removalDate: string | Dayjs | null;
    dspOrderNum: number;
    remark: string;
    statisticClassification: (typeof STATISTIC_FLG)[keyof typeof STATISTIC_FLG];
    useClassification: (typeof USE_FLG)[keyof typeof USE_FLG];
};

export type PalletImport = IUnevennessImport;
