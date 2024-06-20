import {
    Dimensions,
    StyleSheet,
    ViewStyle,
    StatusBar,
    SafeAreaView,
    FlatListProps
} from 'react-native';
import { observer } from 'mobx-react';
import { useHeaderHeight } from '@react-navigation/elements';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { PalletSortDetail } from '@/types/pages/palletSort';
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { useStore } from '@/stores/stores';
import {
    ITEM_PER_PAGE,
    PALLET_HEIGHT,
    PALLET_PER_SECOND
} from '@/enums/operationInspection.enum';
import { floor } from 'lodash';
import RenderPallet from '@/modules/operatingInspection/RenderPallet';
import {
    findTrackedScroll,
    getRenderFactoryPallet,
    getScrollInterval
} from '@/modules/operatingInspection/helper';

const InspectionIndex = observer(() => {
    const headerHeight = useHeaderHeight();

    const statusBarHeight = StatusBar.currentHeight || 0;

    const { height } = Dimensions.get('window');

    const { factoryStore, operationInspectionStore } = useStore();

    const [trackedScrolled, setTrackedScrolled] = useState(0);

    const slideStyle: ViewStyle = useMemo(() => {
        return {
            ...styles.slide,
            maxHeight: (height - headerHeight + statusBarHeight) / ITEM_PER_PAGE
        };
    }, [height, headerHeight, statusBarHeight]);

    // auto scroll
    const offsetY = useSharedValue<number>(0);

    const animatedProps = useAnimatedProps<
        FlatListProps<PalletSortDetail>
    >(() => {
        return {
            contentOffset: {
                x: 0,
                y: offsetY.value
            }
        };
    }, []);

    const scrollToOffset = useCallback(
        (value: number, duration: number = 0) => {
            offsetY.value = withTiming(value, {
                duration,
                easing: Easing.inOut(Easing.linear)
            });
        },
        [slideStyle.maxHeight]
    );

    const palletHeight = useMemo(() => {
        return Number(slideStyle.maxHeight) ?? PALLET_HEIGHT;
    }, [slideStyle.maxHeight]);

    const renderFactoryPallet = useMemo(() => {
        return getRenderFactoryPallet(
            operationInspectionStore.onlineFactoryPallets,
            factoryStore?.factoryId ?? 0
        );
    }, [operationInspectionStore.onlineFactoryPallets, factoryStore.factoryId]);

    const currentBottomPallet = useMemo(() => {
        return renderFactoryPallet[
            floor(trackedScrolled * PALLET_PER_SECOND) + ITEM_PER_PAGE - 1
        ];
    }, [trackedScrolled, renderFactoryPallet]);

    useEffect(() => {
        if (currentBottomPallet) {
            operationInspectionStore.setBottomPallet(currentBottomPallet);
        }
    }, [currentBottomPallet]);

    useEffect(() => {
        const foundTrackedScroll = findTrackedScroll(
            renderFactoryPallet,
            currentBottomPallet.code,
            operationInspectionStore.bottomPallet?.code
        );
        if (foundTrackedScroll) {
            setTrackedScrolled(foundTrackedScroll);
        }
    }, [currentBottomPallet, operationInspectionStore.bottomPallet]);

    useEffect(() => {
        const interval = getScrollInterval(
            renderFactoryPallet,
            trackedScrolled,
            palletHeight,
            setTrackedScrolled,
            scrollToOffset
        );

        if (!interval) {
            return;
        }

        return () => clearInterval(interval);
    }, [palletHeight, scrollToOffset, currentBottomPallet]);

    return (
        <SafeAreaView style={styles.container}>
            <Animated.FlatList
                scrollEnabled={false}
                style={[styles.wrapper]}
                animatedProps={animatedProps}
                getItemLayout={(data, index) => ({
                    length: palletHeight,
                    offset: palletHeight * index,
                    index
                })}
                data={renderFactoryPallet ?? []}
                removeClippedSubviews
                maxToRenderPerBatch={ITEM_PER_PAGE * 2}
                keyExtractor={(pallet, idx) => idx.toString()}
                renderItem={({ item, index }) => (
                    <RenderPallet item={item} slideStyle={slideStyle} />
                )}
            ></Animated.FlatList>
        </SafeAreaView>
    );
});

export default InspectionIndex;

const styles = StyleSheet.create({
    container: {
        // flex: 1
    },

    wrapper: {
        // flex: 1
    },

    slide: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
        borderColor: '#fff',
        borderWidth: 1,
        flexDirection: 'row',
        borderRadius: 5
    },

    palletCode: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },

    reactionContainer: {
        flexDirection: 'column',
        height: '100%',
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 5
    },

    palletContainer: {
        flexDirection: 'column',
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonContainer: {
        paddingHorizontal: 0,
        paddingVertical: 10
    }
});
