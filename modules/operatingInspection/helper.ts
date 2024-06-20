import {
    FactoryPalletSort,
    PalletSortDetail,
    SortSetting
} from '@/types/pages/palletSort';
import {
    DEFINE_COLOR_GAP_HOLE_PALLET,
    PALLET_SORTING_SOUNDNESS,
    UNEVENNESS_INFO_MEASUREMENT_PART
} from '@/enums/commonFlg.enum';
import {
    ITEM_PER_PAGE,
    PALLET_PER_SECOND,
    SECOND_TO_MILLI
} from '@/enums/operationInspection.enum';
import { SetStateAction } from 'react';

function updateGapType(
    updatingDetail: PalletSortDetail,
    gapType: number,
    soundnessIndex: number
) {
    switch (soundnessIndex) {
        case UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_SOUTH:
            updatingDetail.latestInspectionInfo!.oreDisSouthSWGapPerfType =
                gapType;
            break;
        case UNEVENNESS_INFO_MEASUREMENT_PART.ORE_SUPPLY_SOUTH:
            updatingDetail.latestInspectionInfo!.oreSuppSouthSWGapPerfType =
                gapType;
            break;
        case UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_NORTH:
            updatingDetail.latestInspectionInfo!.oreDisNorthSWGapPerfType =
                gapType;
            break;
        case UNEVENNESS_INFO_MEASUREMENT_PART.ORE_SUPPLY_NORTH:
            updatingDetail.latestInspectionInfo!.oreSuppNorthSWGapPerfType =
                gapType;
            break;
        default:
            break;
    }
    return updatingDetail;
}

function updateSoundness(
    sortDetail: PalletSortDetail,
    sortSetting: SortSetting | null
): PalletSortDetail {
    if (!sortDetail || !sortSetting) {
        return sortDetail;
    }

    const result: number[] = Array(4).fill(PALLET_SORTING_SOUNDNESS.UNKNOWN);

    result[0] = checkInspectionCondition(
        sortDetail.latestInspectionInfo?.oreDisSouthSWGapPerfType ??
            DEFINE_COLOR_GAP_HOLE_PALLET.UNKNOWN,
        sortSetting
    );
    result[1] = checkInspectionCondition(
        sortDetail.latestInspectionInfo?.oreDisNorthSWGapPerfType ??
            DEFINE_COLOR_GAP_HOLE_PALLET.UNKNOWN,
        sortSetting
    );
    result[2] = checkInspectionCondition(
        sortDetail.latestInspectionInfo?.oreSuppSouthSWGapPerfType ??
            DEFINE_COLOR_GAP_HOLE_PALLET.UNKNOWN,
        sortSetting
    );
    result[3] = checkInspectionCondition(
        sortDetail.latestInspectionInfo?.oreSuppNorthSWGapPerfType ??
            DEFINE_COLOR_GAP_HOLE_PALLET.UNKNOWN,
        sortSetting
    );

    sortDetail.soundnessFlg = result;
    return sortDetail;
}

function checkInspectionCondition(
    gapType: number,
    sortSettingDto: SortSetting
) {
    const conditionDictionary = getInspectionComparator(
        gapType,
        sortSettingDto
    );
    let result = DEFINE_COLOR_GAP_HOLE_PALLET.UNKNOWN;
    for (const [key, value] of Object.entries(conditionDictionary)) {
        if (value) {
            result = parseInt(key);
            break;
        }
    }
    return result;
}

function getInspectionComparator(
    gapType: number,
    sortSettingDto: SortSetting
): { [key: number]: boolean } {
    // return {
    //     [PALLET_SORTING_SOUNDNESS.NORMAL]: isGapHoleNormal(
    //         gapType,
    //         sortSettingDto
    //     ),
    //     [PALLET_SORTING_SOUNDNESS.CAUTION]: isGapHoleCaution(
    //         gapType,
    //         sortSettingDto
    //     ),
    //     [PALLET_SORTING_SOUNDNESS.ABNORMAL]: isGapHoleAbnormal(
    //         gapType,
    //         sortSettingDto
    //     ),
    //     [PALLET_SORTING_SOUNDNESS.UNKNOWN]: isGapHoleDamaged(
    //         gapType,
    //         sortSettingDto
    //     )
    // };
    return {
        [DEFINE_COLOR_GAP_HOLE_PALLET.NONE]:
            DEFINE_COLOR_GAP_HOLE_PALLET.NONE === gapType,
        [DEFINE_COLOR_GAP_HOLE_PALLET.SMALL]:
            DEFINE_COLOR_GAP_HOLE_PALLET.SMALL === gapType,
        [DEFINE_COLOR_GAP_HOLE_PALLET.MEDIUM]:
            DEFINE_COLOR_GAP_HOLE_PALLET.MEDIUM === gapType,
        [DEFINE_COLOR_GAP_HOLE_PALLET.LARGE]:
            DEFINE_COLOR_GAP_HOLE_PALLET.LARGE === gapType,
        [DEFINE_COLOR_GAP_HOLE_PALLET.EXTRA_LARGE]:
            DEFINE_COLOR_GAP_HOLE_PALLET.EXTRA_LARGE === gapType
    };
}

function isGapHoleNormal(
    gapType: number,
    sortSettingDto: SortSetting
): boolean {
    return (
        sortSettingDto.gapHoleNormal.includes(gapType) &&
        sortSettingDto.gapUseHole === 1
    );
}

function isGapHoleCaution(
    gapType: number,
    sortSettingDto: SortSetting
): boolean {
    return (
        sortSettingDto.gapHoleCaution.includes(gapType) &&
        sortSettingDto.gapUseHole === 1
    );
}

function isGapHoleAbnormal(
    gapType: number,
    sortSettingDto: SortSetting
): boolean {
    return (
        sortSettingDto.gapHoleAbnormal.includes(gapType) &&
        sortSettingDto.gapUseHole === 1
    );
}

function isGapHoleDamaged(
    gapType: number,
    sortSettingDto: SortSetting
): boolean {
    return (
        sortSettingDto.gapHoleAbnormal.includes(gapType) &&
        sortSettingDto.gapUseHole === 1
    );
}

export function updatePalletInspection(
    onlinePallets: PalletSortDetail[],
    gapType: number,
    gapTypeVal: number,
    sortDetail: PalletSortDetail,
    sortSetting: SortSetting | null
): PalletSortDetail[] {
    const updatingIdx = onlinePallets.findIndex((x) => x.id === sortDetail.id);

    const adjacentIdx = findAdjacentPallet(onlinePallets, gapType, updatingIdx);
    const adjacentFlg = findAdjacentGapFlg(gapType);

    // updating gap

    updateGapType(sortDetail, gapTypeVal, gapType);
    updateGapType(onlinePallets[adjacentIdx], gapTypeVal, adjacentFlg);
    // updating soundness flg
    // result[updatingIdx] = updateSoundness(result[updatingIdx], sortSetting);
    // result[adjacentIdx] = updateSoundness(result[adjacentIdx], sortSetting);

    return onlinePallets;
}

export function findAdjacentPallet(
    onlinePallets: PalletSortDetail[],
    soundnessFlgType: number,
    updatingPalletIdx: number
) {
    const isPrev =
        soundnessFlgType ===
            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_SOUTH ||
        soundnessFlgType ===
            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_NORTH;
    if (isPrev) {
        return updatingPalletIdx === 0
            ? onlinePallets.length - 1
            : updatingPalletIdx - 1;
    } else {
        return updatingPalletIdx === onlinePallets.length - 1
            ? 0
            : updatingPalletIdx + 1;
    }
}

function findAdjacentGapFlg(soundnessIdx: number) {
    let adjacentFlg = UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_SOUTH;
    switch (soundnessIdx) {
        case UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_SOUTH:
            adjacentFlg = UNEVENNESS_INFO_MEASUREMENT_PART.ORE_SUPPLY_SOUTH;
            break;
        case UNEVENNESS_INFO_MEASUREMENT_PART.ORE_SUPPLY_SOUTH:
            adjacentFlg = UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_SOUTH;
            break;
        case UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_NORTH:
            adjacentFlg = UNEVENNESS_INFO_MEASUREMENT_PART.ORE_SUPPLY_NORTH;
            break;
        case UNEVENNESS_INFO_MEASUREMENT_PART.ORE_SUPPLY_NORTH:
            adjacentFlg = UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_NORTH;
            break;
        default:
            break;
    }
    return adjacentFlg;
}

export function getRenderFactoryPallet(
    onlineFactoryPallets: FactoryPalletSort[],
    factoryId: number
): PalletSortDetail[] {
    const result = onlineFactoryPallets.find((x) => x.factoryId == factoryId);
    if (result?.onlinePallets.length) {
        const tempPallets = result.onlinePallets.filter((x) => x.id);
        return tempPallets.concat(tempPallets.slice(0, ITEM_PER_PAGE));
    }
    return [];
}

export function findTrackedScroll(
    renderFactoryPallet: PalletSortDetail[],
    currentCode: string,
    storedCurrentCode?: string
) {
    if (storedCurrentCode && currentCode !== storedCurrentCode) {
        let updatingPalletIdx = renderFactoryPallet.findLastIndex(
            (x) => x.code == storedCurrentCode
        );
        if (updatingPalletIdx) {
            updatingPalletIdx = updatingPalletIdx - ITEM_PER_PAGE + 1;
        }
        let updatingTrackedScroll = 0;
        if (updatingPalletIdx > 0) {
            updatingTrackedScroll = updatingPalletIdx / PALLET_PER_SECOND;
        } else if (updatingPalletIdx == 0) {
            updatingTrackedScroll =
                (updatingPalletIdx + renderFactoryPallet.length) /
                PALLET_PER_SECOND;
        }
        return updatingTrackedScroll;
    }
    return null;
}

export function getScrollInterval(
    renderFactoryPallet: PalletSortDetail[],
    trackedScrolled: number,
    palletHeight: number,
    setTrackedScrolled: (value: SetStateAction<number>) => void,
    scrollToOffset: (value: number, duration?: number) => void
) {
    if (!renderFactoryPallet) {
        return null;
    }
    const maxScroll =
        (renderFactoryPallet.length - ITEM_PER_PAGE + PALLET_PER_SECOND) /
        PALLET_PER_SECOND;
    const duration = SECOND_TO_MILLI;

    let scrolled = trackedScrolled;
    return setInterval(() => {
        scrolled++;
        if (scrolled < maxScroll) {
            const scrollValue = scrolled * (palletHeight * PALLET_PER_SECOND);
            scrollToOffset(scrollValue, duration);
        } else {
            scrolled = 0;
            scrollToOffset(0);
        }
        setTrackedScrolled(scrolled);
    }, duration);
}
