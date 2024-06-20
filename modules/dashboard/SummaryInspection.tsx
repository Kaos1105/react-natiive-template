import { StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { ViewProps } from '@/components/Themed';
import { OptionIcon, useDropdownOptions } from '@/hooks/dropdownOptionsHook';
import { useStore } from '@/stores/stores';
import { UNEVENNESS_INFO_MEASUREMENT_PART } from '@/enums/commonFlg.enum';

type IProps = ViewProps & {
    label: string;
    gapSide: number;
};

type ISummaryItemProps = { item: OptionIcon; countValue: number };

const SummaryItem = ({ item, countValue }: ISummaryItemProps) => {
    return (
        <View style={styles.contentWrapper}>
            <View
                style={{
                    flex: 5
                }}
            >
                {item.icon.selectIcon &&
                    item.icon.selectIcon({
                        style: {
                            ...styles.svgIcon
                        }
                    })}
            </View>
            <View
                style={{
                    flex: 2
                }}
            >
                <Text style={styles.contentLabel}>{countValue}</Text>
            </View>
        </View>
    );
};

const SummaryInspection = observer((props: IProps) => {
    const { optionGapHoleIcon } = useDropdownOptions();

    const { operationInspectionStore } = useStore();

    const countGapType = useCallback(
        (gapType: number) => {
            if (
                props.gapSide ===
                UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_NORTH
            ) {
                return operationInspectionStore.currentFactoryPallets.filter(
                    (x) =>
                        x.latestInspectionInfo?.oreDisNorthSWGapPerfType ==
                        gapType
                ).length;
            } else if (
                props.gapSide ===
                UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_SOUTH
            ) {
                return operationInspectionStore.currentFactoryPallets.filter(
                    (x) =>
                        x.latestInspectionInfo?.oreDisSouthSWGapPerfType ==
                        gapType
                ).length;
            }
            return 0;
        },
        [operationInspectionStore.currentFactoryPallets]
    );

    return (
        <View style={styles.wrapper}>
            <View style={styles.labelWrapper}>
                <Text style={{ color: 'white' }}>{props.label}</Text>
            </View>
            <View style={styles.content}>
                {optionGapHoleIcon.map((item, index) => (
                    <SummaryItem
                        item={item}
                        key={index}
                        countValue={countGapType(item.value)}
                    />
                ))}
            </View>
        </View>
    );
});

export default SummaryInspection;

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        marginVertical: 5,
        display: 'flex',
        flexDirection: 'row'
    },
    content: {
        flex: 13,
        padding: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    labelWrapper: {
        backgroundColor: '#19477c',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        paddingHorizontal: 10,
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    contentLabel: {
        textAlign: 'center',
        verticalAlign: 'middle'
    },
    contentWrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 60
    },
    svgIcon: {}
});
