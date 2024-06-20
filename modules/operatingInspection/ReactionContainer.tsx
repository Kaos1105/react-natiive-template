import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EmojiItemProp } from '@/components/reactionPicker/components/ReactionView/types';
import { ReactionRefType } from '@/components/reactionPicker/components/ReactionView/RootReaction';
import { Reaction } from '@/components/reactionPicker';
import { Button } from '@/components/button/Button';
import { StyleSheet, View } from 'react-native';
import { ReactionItem } from '@/types/global';
import { DEFINE_COLOR_GAP_HOLE_PALLET } from '@/enums/commonFlg.enum';
import { useDropdownOptions } from '@/hooks/dropdownOptionsHook';
import { useStore } from '@/stores/stores';
import { PalletSortDetail } from '@/types/pages/palletSort';
import { observer } from 'mobx-react';

type IProps = {
    gapOptions: ReactionItem[];
    gapVal: number;
    gapType: number;
    // handleChangeGap: (soundnessVal: number) => void;
    sortDetail: PalletSortDetail;
    enabled?: boolean;
};
const ReactionContainer = observer(
    ({ gapOptions, gapVal, gapType, sortDetail, enabled = true }: IProps) => {
        const [selectedGap, setSelectedGap] = useState<
            EmojiItemProp | undefined
        >();

        const { optionGapHoleIcon } = useDropdownOptions();

        const { operationInspectionStore } = useStore();

        const svgIcon = useMemo(() => {
            const option = optionGapHoleIcon.find(
                (x) => x.value == selectedGap?.id
            );
            return option ? option.icon.displayIcon : null;
        }, [selectedGap, optionGapHoleIcon]);

        useEffect(() => {
            const defaultColor = gapOptions.find((x) => x.id === gapVal);
            if (defaultColor) {
                setSelectedGap({
                    ...defaultColor
                });
            }
        }, [gapVal]);

        const handleSelectGap = useCallback((item?: EmojiItemProp) => {
            operationInspectionStore.handleChangePalletInspection(
                gapType,
                item?.id ?? DEFINE_COLOR_GAP_HOLE_PALLET.UNKNOWN,
                sortDetail
            );
        }, []);

        const rootRef = useRef<ReactionRefType>(null);

        // const color = useCallback((item?: EmojiItemProp) => {
        //     if (!item) {
        //         return PALLET_SORTING_SOUNDNESS_COLOR.DEFAULT_COLOR;
        //     }
        //     let result: string;
        //     switch (item.id) {
        //         case PALLET_SORTING_SOUNDNESS.NORMAL:
        //             result = PALLET_SORTING_SOUNDNESS_COLOR.NORMAL_COLOR;
        //             break;
        //         case PALLET_SORTING_SOUNDNESS.CAUTION:
        //             result = PALLET_SORTING_SOUNDNESS_COLOR.CAUTION_COLOR;
        //             break;
        //         case PALLET_SORTING_SOUNDNESS.ABNORMAL:
        //             result = PALLET_SORTING_SOUNDNESS_COLOR.ABNORMALITY_COLOR;
        //             break;
        //         case PALLET_SORTING_SOUNDNESS.UNKNOWN:
        //             result = PALLET_SORTING_SOUNDNESS_COLOR.DEFAULT_COLOR;
        //             break;
        //         default:
        //             result = PALLET_SORTING_SOUNDNESS_COLOR.ABNORMALITY_COLOR;
        //             break;
        //     }
        //     return result;
        // }, []);

        return (
            <Reaction
                ref={rootRef}
                iconSize={30}
                type={'modal'}
                showPopupType={'onPress'}
                items={gapOptions}
                onTap={handleSelectGap}
                cardDuration={100}
                emojiDuration={100}
                scaleDuration={100}
                isShowCardInCenter={true}
                disabled={!enabled}
            >
                <Button
                    title={''}
                    style={styles.buttonContainer}
                    onPress={(e) => {
                        rootRef.current?.pressHandler();
                    }}
                    onLongPress={() => {
                        rootRef.current?.longPressHandler();
                    }}
                    disabled={!enabled}
                >
                    <View
                        style={{
                            minHeight: 60,
                            justifyContent: 'center'
                        }}
                    >
                        <View
                            style={{
                                ...styles.square
                            }}
                        >
                            {svgIcon &&
                                svgIcon({
                                    style: {
                                        ...styles.svgIcon
                                    }
                                })}
                        </View>
                    </View>
                </Button>
            </Reaction>
        );
    }
);

export default ReactionContainer;

const styles = StyleSheet.create({
    buttonContainer: {
        paddingHorizontal: 5,
        paddingVertical: 5,
        backgroundColor: 'white',
        borderRadius: 15
    },

    cardStyle: {
        minHeight: 30
    },

    svgIcon: {
        minHeight: 50,
        minWidth: 50
    },

    square: {
        width: 55,
        borderRadius: 10,
        height: 55,
        borderWidth: 1,
        borderColor: 'black'
    }
});
