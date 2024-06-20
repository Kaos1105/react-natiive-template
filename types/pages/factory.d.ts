import type { PaginationResource } from '@/types/common/tablePage';

export type FactoryItemResource = {
    id: number;
    name: string;
    code: string;
    operationStartDate: string;
    operationEndDate: string;
    analysisImportPath: string;
    analysisSavePath: string;
    useClassification: number;
    statisticClassification: number;
    latestCombinationInfo: LatestCombinationInfo;
};

export type FactoryCollection = {
    pagedList: PaginationResource<FactoryItemResource>;
};

export type LatestCombinationInfo = {
    id?: number;
    palletId?: number;
    combChangeDateTime?: string;
    repairHistoryId?: number;
    useClassification?: number;
    versionCode?: number;
    lineClassification?: number;
    sortOrder?: number;
    factoryId: number;
};

export type OperatingStatus = {
    id: number;
    factoryId: number;
    palletId: number;
    lineClassification: number;
    importLastDateTime: string;
    exportLastDateTime: null;
    cumOprTimeInitDateTime: string;
    lastOprInfoRegisDateTime: string;
    dspOrderNum: number;
    useClassification: number;
    statisticClassification: number;
    createdBy: number;
    updatedBy: number;
    createdDate: string;
    updatedDate: string;
};

export type PalletHistory = {
    operatingStatus: OperatingStatus[];
    onlineHistories: OperatingStatus[];
};

export type DataExportExcel = {
    filePath: string;
};
