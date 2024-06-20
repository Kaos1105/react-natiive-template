import { useTranslation } from "react-i18next";
import {
    STATISTIC_FLG,
    USE_FLG,
    REPAIR_CLASSIFICATION,
    MANAGEMENT_INFORMATION,
    REPAIR_DETAIL,
    LINE_CLASSIFICATION,
    UNEVENNESS_INFO_MEASUREMENT_TIMING,
    UNEVENNESS_INFO_MEASUREMENT_PART,
    PALLET_SORTING_SOUNDNESS,
    GAP_HOLE_CLASSIFICATION,
    HISTORY_TYPE
} from "@/enums/commonFlg.enum";

export function useConvertFlgData() {
    const { t } = useTranslation();
    const convertUseFlg = (value: number) => {
        const flg =
            (Object.keys(USE_FLG) as Array<keyof typeof USE_FLG>).find(
                (flgKey) => USE_FLG[flgKey] === value
            ) || "";
        return flg ? t(`enumFlag.USE_FLG.${flg}`) : null;
    };

    const convertStatisticFlg = (value: number) => {
        const flg =
            (Object.keys(STATISTIC_FLG) as Array<
                keyof typeof STATISTIC_FLG
            >).find((flgKey) => STATISTIC_FLG[flgKey] === value) || "";
        return flg ? t(`enumFlag.STATISTIC_FLG.${flg}`) : null;
    };

    const convertRepairClassification = (value: number) => {
        const flg =
            (Object.keys(REPAIR_CLASSIFICATION) as Array<
                keyof typeof REPAIR_CLASSIFICATION
            >).find((flgKey) => REPAIR_CLASSIFICATION[flgKey] === value) || "";
        return flg ? t(`enumFlag.REPAIR_CLASSIFICATION.${flg}`) : null;
    };

    const convertManagementInformation = (value?: number): string | null => {
        const flg =
            (Object.keys(MANAGEMENT_INFORMATION) as Array<
                keyof typeof MANAGEMENT_INFORMATION
            >).find((flgKey) => MANAGEMENT_INFORMATION[flgKey] === value) || "";
        return flg ? t(`enumFlag.MANAGEMENT_INFORMATION.${flg}`) : null;
    };
    const convertRepairDetail = (value?: number): string | null => {
        const flg =
            (Object.keys(REPAIR_DETAIL) as Array<
                keyof typeof REPAIR_DETAIL
            >).find((flgKey) => REPAIR_DETAIL[flgKey] === value) || "";
        return flg ? t(`enumFlag.REPAIR_DETAIL.${flg}`) : null;
    };
    const convertLineClassification = (value?: number): string | null => {
        const flg =
            (Object.keys(LINE_CLASSIFICATION) as Array<
                keyof typeof LINE_CLASSIFICATION
            >).find((flgKey) => LINE_CLASSIFICATION[flgKey] === value) || "";
        return flg ? t(`enumFlag.LINE_CLASSIFICATION.${flg}`) : null;
    };
    const convertMeasurementTiming = (value?: number): string | null => {
        const flg =
            (Object.keys(UNEVENNESS_INFO_MEASUREMENT_TIMING) as Array<
                keyof typeof UNEVENNESS_INFO_MEASUREMENT_TIMING
            >).find(
                (flgKey) => UNEVENNESS_INFO_MEASUREMENT_TIMING[flgKey] === value
            ) || "";
        return flg
            ? t(`enumFlag.UNEVENNESS_INFO_MEASUREMENT_TIMING.${flg}`)
            : null;
    };
    const convertMeasurementPart = (value?: number): string | null => {
        const flg =
            (Object.keys(UNEVENNESS_INFO_MEASUREMENT_PART) as Array<
                keyof typeof UNEVENNESS_INFO_MEASUREMENT_PART
            >).find(
                (flgKey) => UNEVENNESS_INFO_MEASUREMENT_PART[flgKey] === value
            ) || "";
        return flg
            ? t(`enumFlag.UNEVENNESS_INFO_MEASUREMENT_PART.${flg}`)
            : null;
    };
    const convertSoundnessColor = (value?: number): string => {
        const flg =
            (Object.keys(PALLET_SORTING_SOUNDNESS) as Array<
                keyof typeof PALLET_SORTING_SOUNDNESS
            >).find((flgKey) => PALLET_SORTING_SOUNDNESS[flgKey] === value) ||
            "";
        return flg ? t(`enumFlag.PALLET_SORTING_SOUNDNESS.${flg}`) : "";
    };
    const convertGapHoleClassification = (value?: number): string => {
        const flg =
            (Object.keys(GAP_HOLE_CLASSIFICATION) as Array<
                keyof typeof GAP_HOLE_CLASSIFICATION
            >).find((flgKey) => GAP_HOLE_CLASSIFICATION[flgKey] === value) ||
            "";
        return flg ? t(`enumFlag.GAP_HOLE_CLASSIFICATION.${flg}`) : "";
    };
    const convertHistoryType = (value?: number): string => {
        const flg =
            (Object.keys(HISTORY_TYPE) as Array<
                keyof typeof HISTORY_TYPE
            >).find((flgKey) => HISTORY_TYPE[flgKey] === value) || "";
        return flg ? t(`enumFlag.HISTORY_TYPE.${flg}`) : "";
    };

    return {
        convertUseFlg,
        convertStatisticFlg,
        convertRepairClassification,
        convertManagementInformation,
        convertRepairDetail,
        convertLineClassification,
        convertMeasurementTiming,
        convertMeasurementPart,
        convertSoundnessColor,
        convertGapHoleClassification,
        convertHistoryType
    };
}
