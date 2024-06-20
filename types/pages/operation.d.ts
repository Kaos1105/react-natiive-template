export interface IOperationData {
    totalExcelRecords: number;
    totalDBExistedRecords: number;
    totalImportedRecords: number;
    totalErrorRecords: number;
    importedRecords: TypeImportedRecord[];
    errorRecords: TypeErrorRecord[];
    errCsvPath: string;
}

export type TypeImportedRecord = {
    id: number;
    dlno: string;
    factoryId: number;
    yearMonthDate: string;
    operationHour: number;
    operationMinute: number;
    stopTimes: number;
    stopTime1: number;
    startTime1: number;
    stopTime2: number;
    startTime2: number;
    stopTime3: number;
    startTime3: number;
    stopTime4: number;
    startTime4: number;
    stopTime5: number;
    startTime5: number;
    dspOrderNum: number;
    useClassification: number;
    statisticClassification: number;
    importedDate?: string | null;
};

export type TypeErrorRecord = {
    dlno: string;
    errorContent: string;
    errorField: string;
    errorRow: string;
    errorValue: string;
    yearMonthDate: string;
};

export interface IOperationInfo {
    collection: TypeImportedRecord[];
    yearDropdown?: number[];
}
