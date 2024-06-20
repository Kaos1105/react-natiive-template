import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { PalletSortDetail } from '@/types/pages/palletSort';
import ReactionContainer from '@/modules/operatingInspection/ReactionContainer';
import { useDropdownOptions } from '@/hooks/dropdownOptionsHook';
import { useCallback, useMemo } from 'react';
import {
    DEFINE_COLOR_GAP_HOLE_PALLET,
    UNEVENNESS_INFO_MEASUREMENT_PART
} from '@/enums/commonFlg.enum';
import { useStore } from '@/stores/stores';
import { observer } from 'mobx-react';
import { findAdjacentPallet } from '@/modules/operatingInspection/helper';

type PalletItemProps = {
    slideStyle: ViewStyle;
    onPressIn?: () => void;
    onPressOut?: () => void;
    sortDetail: PalletSortDetail;
};

const pickerStyles = StyleSheet.create({
    container: {
        maxHeight: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    svgIcon: {
        minHeight: 50,
        minWidth: 50
    }
});

const PalletItem = observer(
    ({
        slideStyle,
        sortDetail // handleChangeInspectionItem
    }: PalletItemProps) => {
        const { optionGapHoleIcon } = useDropdownOptions();

        const { operationInspectionStore } = useStore();

        const gapOptions = useMemo(() => {
            return optionGapHoleIcon.map((item) => {
                return {
                    id: (item.value as number) ?? 0,
                    emoji: (
                        <View style={pickerStyles.container}>
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'black',
                                    borderRadius: 10
                                }}
                            >
                                {item.icon.selectIcon &&
                                    item.icon.selectIcon({
                                        style: {
                                            ...pickerStyles.svgIcon
                                        }
                                    })}
                            </View>
                        </View>
                    ),
                    title: item.value.toString()
                };
            });
        }, [optionGapHoleIcon]);

        // const handleChangeGap = useCallback(
        //     (soundnessVal: number, soundnessIdx: number) => {
        //         operationInspectionStore.handleChangePalletInspection(
        //             soundnessIdx,
        //             soundnessVal,
        //             sortDetail
        //         );
        //     },
        //     [sortDetail]
        // );

        const enableInspection = useCallback(
            (soundnessFlgType: number) => {
                const checkingPalletId =
                    operationInspectionStore.currentFactoryPallets.findIndex(
                        (x) => x.id === sortDetail.id
                    );
                const adjacentIdx = findAdjacentPallet(
                    operationInspectionStore.currentFactoryPallets,
                    soundnessFlgType,
                    checkingPalletId
                );
                return (
                    operationInspectionStore.currentFactoryPallets[adjacentIdx]
                        .id > 0
                );
            },
            [operationInspectionStore.currentFactoryPallets, sortDetail]
        );

        return (
            <View style={slideStyle}>
                <View style={styles.reactionContainer}>
                    <ReactionContainer
                        gapOptions={gapOptions}
                        gapVal={
                            sortDetail.latestInspectionInfo
                                ?.oreDisSouthSWGapPerfType ??
                            DEFINE_COLOR_GAP_HOLE_PALLET.UNKNOWN
                        }
                        gapType={
                            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_SOUTH
                        }
                        sortDetail={sortDetail}
                        enabled={enableInspection(
                            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_SOUTH
                        )}
                    ></ReactionContainer>
                    <ReactionContainer
                        gapOptions={gapOptions}
                        gapVal={
                            sortDetail.latestInspectionInfo
                                ?.oreSuppSouthSWGapPerfType ??
                            DEFINE_COLOR_GAP_HOLE_PALLET.UNKNOWN
                        }
                        gapType={
                            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_SUPPLY_SOUTH
                        }
                        sortDetail={sortDetail}
                        enabled={enableInspection(
                            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_SUPPLY_SOUTH
                        )}
                    ></ReactionContainer>
                </View>
                <View style={styles.palletContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.palletCode, { fontSize: 14 }]}>
                            {sortDetail.latestInspectionInfo?.sortOrder?.toString()}
                        </Text>
                    </View>

                    <View style={{ flex: 3 }}>
                        <Text style={styles.palletCode}>
                            {sortDetail.code.toString()}
                        </Text>
                    </View>
                </View>
                <View style={styles.reactionContainer}>
                    <ReactionContainer
                        gapOptions={gapOptions}
                        gapVal={
                            sortDetail.latestInspectionInfo
                                ?.oreDisNorthSWGapPerfType ??
                            DEFINE_COLOR_GAP_HOLE_PALLET.UNKNOWN
                        }
                        gapType={
                            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_NORTH
                        }
                        sortDetail={sortDetail}
                        enabled={enableInspection(
                            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_NORTH
                        )}
                    ></ReactionContainer>
                    <ReactionContainer
                        gapOptions={gapOptions}
                        gapVal={
                            sortDetail.latestInspectionInfo
                                ?.oreSuppNorthSWGapPerfType ??
                            DEFINE_COLOR_GAP_HOLE_PALLET.UNKNOWN
                        }
                        gapType={
                            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_SUPPLY_NORTH
                        }
                        sortDetail={sortDetail}
                        enabled={enableInspection(
                            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_SUPPLY_NORTH
                        )}
                    ></ReactionContainer>
                </View>
            </View>
        );
    }
);

export default PalletItem;

const styles = StyleSheet.create({
    palletCode: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },

    reactionContainer: {
        flexDirection: 'column',
        height: '100%',
        flex: 2,
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 5
    },

    palletContainer: {
        flexDirection: 'column',
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
