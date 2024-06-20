import { keys } from 'lodash';
import { useTranslation } from 'react-i18next';
import {
    DEFINE_COLOR_GAP_HOLE_PALLET,
    DISPLAY_ODER,
    MANAGEMENT_INFORMATION,
    REPAIR_CLASSIFICATION,
    REPAIR_DETAIL,
    STATISTIC_FLG,
    UNEVENNESS_INFO_MEASUREMENT_PART,
    UNEVENNESS_INFO_MEASUREMENT_TIMING,
    USE_FLG
} from '@/enums/commonFlg.enum';
import { useLocalization } from './localizationHook';
import { IGapImage, InspectionIcon } from '@/constants/InspectionIcon';
import { useMemo } from 'react';

export interface IOption {
    value: null | string | number;
    label: string;
}

export type OptionIcon = { value: number; icon: IGapImage };

export function useDropdownOptions() {
    const { t } = useTranslation();

    const { allOption } = useLocalization();

    const optionsUseFlagInput: IOption[] | undefined = (
        keys(USE_FLG) as Array<keyof typeof USE_FLG>
    ).map((value) => {
        return {
            value: USE_FLG[value],
            label: t(`enumFlag.USE_FLG.${value}`)
        };
    });

    const optionsUseFlag: IOption[] | undefined =
        allOption.concat(optionsUseFlagInput);

    const optionStatisticFlagInput: IOption[] | undefined = (
        keys(STATISTIC_FLG) as Array<keyof typeof STATISTIC_FLG>
    ).map((value) => {
        return {
            value: STATISTIC_FLG[value],
            label: t(`enumFlag.STATISTIC_FLG.${value}`)
        };
    });

    const optionStatisticFlag: IOption[] | undefined = allOption.concat(
        optionStatisticFlagInput
    );
    const optionManagementInformation: IOption[] | undefined = (
        keys(MANAGEMENT_INFORMATION) as Array<
            keyof typeof MANAGEMENT_INFORMATION
        >
    ).map((value) => {
        return {
            value: MANAGEMENT_INFORMATION[value],
            label: t(`enumFlag.MANAGEMENT_INFORMATION.${value}`)
        };
    });

    const optionRepairClassificationInput: IOption[] | undefined = (
        keys(REPAIR_CLASSIFICATION) as Array<keyof typeof REPAIR_CLASSIFICATION>
    ).map((value) => {
        return {
            value: REPAIR_CLASSIFICATION[value],
            label: t(`enumFlag.REPAIR_CLASSIFICATION.${value}`)
        };
    });

    const optionRepairClassification: IOption[] | undefined = allOption.concat(
        optionRepairClassificationInput
    );

    const optionRepairDetailInput: IOption[] | undefined = (
        keys(REPAIR_DETAIL) as Array<keyof typeof REPAIR_DETAIL>
    ).map((value) => {
        return {
            value: REPAIR_DETAIL[value],
            label: t(`enumFlag.REPAIR_DETAIL.${value}`)
        };
    });

    const optionRepairDetail: IOption[] | undefined = allOption.concat(
        optionRepairDetailInput
    );

    const convertValueMonth = Array.from({ length: 12 })
        .map((_, index: number) => {
            return {
                value: index + 1,
                label: `${index + 1} ${t('operationPage.index.month')}`
            };
        })
        .reverse();

    const optionSortOther: IOption[] | undefined = (
        keys(DISPLAY_ODER) as Array<keyof typeof DISPLAY_ODER>
    ).map((value) => {
        return {
            value: DISPLAY_ODER[value],
            label: t(`enumFlag.DISPLAY_ODER.${value}`)
        };
    });
    const optionMeasurementTiming: IOption[] | undefined = (
        keys(UNEVENNESS_INFO_MEASUREMENT_TIMING) as Array<
            keyof typeof UNEVENNESS_INFO_MEASUREMENT_TIMING
        >
    ).map((value) => {
        return {
            value: UNEVENNESS_INFO_MEASUREMENT_TIMING[value],
            label: t(`enumFlag.UNEVENNESS_INFO_MEASUREMENT_TIMING.${value}`)
        };
    });

    const optionMeasurementPart: IOption[] | undefined = (
        keys(UNEVENNESS_INFO_MEASUREMENT_PART) as Array<
            keyof typeof UNEVENNESS_INFO_MEASUREMENT_PART
        >
    ).map((value) => {
        return {
            value: UNEVENNESS_INFO_MEASUREMENT_PART[value],
            label: t(`enumFlag.UNEVENNESS_INFO_MEASUREMENT_PART.${value}`)
        };
    });

    const optionGapHoleColor: IOption[] | undefined = (
        keys(DEFINE_COLOR_GAP_HOLE_PALLET) as Array<
            keyof typeof DEFINE_COLOR_GAP_HOLE_PALLET
        >
    ).map((value) => {
        return {
            value: DEFINE_COLOR_GAP_HOLE_PALLET[value],
            label: t(`enumFlag.DEFINE_COLOR_GAP_HOLE_PALLET.${value}`)
        };
    });

    const optionGapHoleIcon: OptionIcon[] = useMemo(
        () =>
            (
                keys(DEFINE_COLOR_GAP_HOLE_PALLET) as Array<
                    keyof typeof DEFINE_COLOR_GAP_HOLE_PALLET
                >
            )
                .filter((x) => x !== 'UNKNOWN')
                .map((value) => {
                    return {
                        value: DEFINE_COLOR_GAP_HOLE_PALLET[value],
                        icon: InspectionIcon[value]
                    };
                }),
        []
    );

    return {
        allOption,
        optionsUseFlagInput,
        optionsUseFlag,
        optionStatisticFlagInput,
        optionStatisticFlag,
        optionManagementInformation,
        optionRepairClassification,
        optionRepairClassificationInput,
        optionRepairDetailInput,
        optionRepairDetail,
        optionSortOther,
        optionMeasurementTiming,
        optionMeasurementPart,
        optionGapHoleColor,
        convertValueMonth,
        optionGapHoleIcon
    };
}
