import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    LayoutChangeEvent,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    PointProp,
    ScrollViewProps,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
    ViewStyle
} from 'react-native';
import { StyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

type TimeoutCallback = {
    callback: () => void;
    timeout: number;
};

interface CustomSwiperProps {
    horizontal?: boolean;
    children: React.ReactElement[];
    maxItemPerPage?: number;
    containerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    scrollViewStyle?: StyleProp<ViewStyle>;
    paginationStyle?: StyleProp<ViewStyle>;
    pagingEnabled?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    bounces?: boolean;
    scrollsToTop?: boolean;
    removeClippedSubviews?: boolean;
    automaticallyAdjustContentInsets?: boolean;
    showsPagination?: boolean;
    showsButtons?: boolean;
    disableNextButton?: boolean;
    disablePrevButton?: boolean;
    loadMinimal?: boolean;
    loadMinimalSize?: number;
    loadMinimalLoader?: React.ReactElement;
    loop?: boolean;
    autoplay?: boolean;
    autoplayTimeout?: number;
    autoplayDirection?: boolean;
    autoScroll?: {
        distance: number;
        timeout: number;
        direction?: boolean;
    };
    index?: number;
    renderPagination?: (index: number, total: number) => React.ReactNode;
    dotStyle?: ViewStyle;
    activeDotStyle?: ViewStyle;
    dotColor?: string;
    activeDotColor?: string;
    onIndexChanged?: (index: number) => void;
    onTouchStart?: () => void;
    onTouchEnd?: () => void;
    onScrollBeginDrag?: (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => void;
    onMomentumScrollEnd?: (
        event: NativeSyntheticEvent<NativeScrollEvent>
    ) => void;
    activeDot?: React.ReactNode;
    dot?: React.ReactNode;
    width?: number;
    height?: number;
}

interface CustomSwiperState {
    index: number;
    total: number;
    width: number;
    height: number;
    dir: 'x' | 'y';
    isScrolling: boolean;
    autoplayEnd: boolean;
    loopJump: boolean;
    offset: {
        x: number;
        y: number;
    };
    children: React.ReactElement[];
}

const CustomSwiper: FC<CustomSwiperProps> = (props) => {
    const { width, height } = useWindowDimensions();

    const [state, setState] = useState<CustomSwiperState>(() => {
        const initWidth = props.width || width;
        const initHeight = props.height || height;
        const direction = props.horizontal ? 'x' : 'y';
        const initOffset = {
            x: direction === 'x' ? initWidth * (props.index || 0) : 0,
            y: direction === 'y' ? initHeight * (props.index || 0) : 0
        };

        return {
            index: props.index || 0,
            total: React.Children.count(props.children),
            width: initWidth,
            height: initHeight,
            dir: direction,
            isScrolling: false,
            autoplayEnd: false,
            loopJump: false,
            offset: initOffset,
            children: React.Children.toArray(
                props.children
            ) as React.ReactElement[]
        };
    });

    const [internals, setInternals] = useState(() => {
        return {
            initialRender: true,
            isScrolling: false,
            offset: {
                x: 0,
                y: 0
            }
        };
    });

    const [autoplayTimer, setAutoplayTimer] = useState<NodeJS.Timeout>();
    const [autoScrollTimer, setAutoScrollTimer] = useState<NodeJS.Timeout>();
    const [loopJumpTimer, setLoopJumpTimer] = useState<NodeJS.Timeout>();
    // auto scroll
    const scrollOffset = useSharedValue<number>(0);
    const animatedProps = useAnimatedProps<ScrollViewProps>(() => {
        const direction = props.horizontal ? 'x' : 'y';
        return {
            contentOffset: {
                x: direction === 'x' ? scrollOffset.value : 0,
                y: direction === 'y' ? scrollOffset.value : 0
            }
        };
    }, []);

    const [lastItemStep, setLastItemStep] = useState(() => {
        return props.horizontal ? state.width : state.height;
    });
    const [isLastPageUneven, setIsLastPageUneven] = useState(false);

    const [isIsScrollDrag, setIsScrollDrag] = useState(false);

    const currOffset = useMemo(() => {
        return state.dir === 'x' ? internals.offset.x : internals.offset.y;
    }, [internals.offset]);

    useEffect(() => {
        props.onIndexChanged && props.onIndexChanged(state.index);
    }, [state.index]);

    useEffect(() => {
        if (props.autoplay) {
            autoplay();
        } else {
            autoplayTimer && clearTimeout(autoplayTimer);
        }
    }, [props.autoplay]);

    useEffect(() => {
        //auto play
        if (props.autoplay) {
            autoplayTimer && clearTimeout(autoplayTimer);
            autoplay();
        }
        //auto scroll
        if (props.autoScroll) {
            autoScrollTimer && clearTimeout(autoScrollTimer);
            autoScroll();
        }
    }, [state]);

    useEffect(() => {
        if (props.autoScroll) {
            if (isIsScrollDrag) {
                scrollOffset.value = props.horizontal
                    ? internals.offset.x
                    : internals.offset.y;
                setIsScrollDrag(false);
            }

            autoScroll();
        } else {
            autoScrollTimer && clearTimeout(autoScrollTimer);
            cancelAnimation(scrollOffset);
        }
    }, [props.autoScroll, isIsScrollDrag]);

    useEffect(() => {
        autoplay();
        autoScroll();
        return () => {
            autoplayTimer && clearTimeout(autoplayTimer);
            autoScrollTimer && clearTimeout(autoScrollTimer);
            loopJumpTimer && clearTimeout(loopJumpTimer);
        };
    }, []);

    const refScrollView = useRef<Animated.ScrollView>(null);

    const pageElements = useMemo(() => {
        const { index, total, children } = state;
        const { loop, loadMinimal, loadMinimalSize, loadMinimalLoader } = props;

        const pageStyle = [
            { width: state.width, height: state.height },
            styles.slide
        ];
        const lastPageStyle = [...pageStyle];
        let lastPageIndex: number;

        const pageStyleLoading: ViewStyle = {
            width: state.width,
            height: state.height,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        };

        const loopVal = loop ? 1 : 0;
        let pages = [];
        if (total > 1) {
            // Re-design a loop model for avoid img flickering
            pages = Object.keys(children);
            if (loop) {
                pages.unshift(total - 1 + '');
                pages.push('0');
            }
            pages = pages.map((page, i) => {
                const childrenCount =
                    children[parseInt(page)].props.children.length;
                if (
                    props.maxItemPerPage &&
                    childrenCount < props.maxItemPerPage
                ) {
                    lastPageStyle[0] = {
                        width: props.horizontal
                            ? (state.width / props.maxItemPerPage) *
                              childrenCount
                            : state.width,
                        height: !props.horizontal
                            ? (state.height / props.maxItemPerPage) *
                              childrenCount
                            : state.height
                    };
                    setLastItemStep(
                        props.horizontal
                            ? lastPageStyle[0].width
                            : lastPageStyle[0].height
                    );
                    setIsLastPageUneven(true);
                    lastPageIndex = i;
                }

                if (loadMinimal) {
                    if (
                        (i >= index + loopVal - loadMinimalSize! &&
                            i <= index + loopVal + loadMinimalSize!) ||
                        // The real first swiper should be keep
                        (loop && i === 1) ||
                        // The real last swiper should be keep
                        (loop && i === total - 1)
                    ) {
                        return (
                            <View style={pageStyle} key={i}>
                                {children[parseInt(page)]}
                            </View>
                        );
                    } else {
                        return (
                            <View style={pageStyleLoading} key={i}>
                                {loadMinimalLoader ? (
                                    loadMinimalLoader
                                ) : (
                                    <ActivityIndicator />
                                )}
                            </View>
                        );
                    }
                } else {
                    return (
                        <View
                            style={
                                i === lastPageIndex ? lastPageStyle : pageStyle
                            }
                            key={i}
                        >
                            {children[parseInt(page)]}
                        </View>
                    );
                }
            });
        } else {
            pages = [
                <View style={pageStyle} key={0}>
                    {children}
                </View>
            ];
        }
        return pages;
    }, [props, state.width, state.height]);

    const onLayout = (event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;
        const offset = internals.offset;
        const updateState = { width, height, offset: { x: 0, y: 0 } };

        if (state.total > 1) {
            let setup = state.index;
            if (props.loop) {
                setup++;
            }
            offset[state.dir] =
                state.dir === 'y' ? height * setup : width * setup;
        }

        if (!state.offset) {
            updateState.offset = offset;
        }

        if (internals.initialRender && state.total > 1) {
            refScrollView.current?.scrollTo({ ...offset, animated: false });
            setInternals((prevState) => {
                return {
                    ...prevState,
                    initialRender: false
                };
            });
            scrollOffset.value = offset[state.dir];
        }
        setState((prev) => ({ ...prev, ...updateState }));
    };

    const loopJump = () => {
        if (!state.loopJump && state.isScrolling) return;
        const scrollView = refScrollView.current;
        setLoopJumpTimer(
            setTimeout(() => {
                if (scrollView) {
                    if (state.index === 0) {
                        scrollView.scrollTo(
                            props.horizontal === false
                                ? {
                                      x: 0,
                                      y:
                                          state.height -
                                          (isLastPageUneven ? lastItemStep : 0),
                                      animated: false
                                  }
                                : {
                                      x:
                                          state.width -
                                          (isLastPageUneven ? lastItemStep : 0),
                                      y: 0,
                                      animated: false
                                  }
                        );
                    } else if (state.index === state.total - 1) {
                        props.horizontal === false
                            ? scrollView.scrollTo({
                                  x: 0,
                                  y:
                                      state.height * (state.total - 1) +
                                      (isLastPageUneven
                                          ? lastItemStep
                                          : state.height),
                                  animated: false
                              })
                            : scrollView.scrollTo({
                                  x:
                                      state.width * (state.total - 1) +
                                      (isLastPageUneven
                                          ? lastItemStep
                                          : state.width),
                                  y: 0,
                                  animated: false
                              });
                    }
                }
            }, 50)
        );
    };

    const endAutoPlay = (callback: () => void) => {
        if (
            !props.loop &&
            (props.autoplayDirection
                ? state.index === state.total - 1
                : state.index === 0)
        ) {
            return setState((prev) => {
                return { ...prev, autoplayEnd: true };
            });
        }
        callback();
    };

    const autoplayTimeout = (): TimeoutCallback => {
        return {
            callback: () => {
                endAutoPlay(() => scrollBy(props.autoplayDirection ? 1 : -1));
            },
            timeout:
                (props.autoplayTimeout || defaultProps.autoplayTimeout!) * 1000
        };
    };

    /**
     * Automatic rolling
     */
    const autoplay = () => {
        if (
            !state.children.length ||
            !props.autoplay ||
            props.autoScroll ||
            internals.isScrolling ||
            state.autoplayEnd ||
            internals.initialRender
        ) {
            return;
        }

        autoplayTimer && clearTimeout(autoplayTimer);

        const autoCallback = autoplayTimeout();
        setAutoplayTimer(
            setTimeout(autoCallback.callback, autoCallback.timeout)
        );
    };

    const autoScroll = () => {
        if (
            !state.children.length ||
            !props.autoScroll ||
            props.autoplay ||
            internals.isScrolling ||
            state.autoplayEnd ||
            internals.initialRender
        ) {
            return;
        }
        autoScrollTimer && clearTimeout(autoScrollTimer);

        const autoCallback = autoScrollTimeout();
        setAutoScrollTimer(
            setTimeout(autoCallback.callback, autoCallback.timeout)
        );
    };

    const scrollToOffset = () => {
        if (internals.isScrolling || !props.autoScroll || state.total < 2)
            return;
        // const currOffset =
        //     state.dir === 'x' ? internals.offset.x : internals.offset.y;
        const scrollDirection = props.autoScroll.direction ? -1 : 1;

        const distance =
            scrollDirection * props.autoScroll.distance + currOffset;

        const contentOffset = {
            x: state.dir === 'x' ? distance : 0,
            y: state.dir === 'y' ? distance : 0
        };

        if (!scrollOffset.value) return;

        scrollOffset.value = withTiming(distance, {
            duration: props.autoScroll?.timeout || 1000,
            easing: Easing.inOut(Easing.linear)
        });

        setInternals({
            ...internals,
            isScrolling: true
        });

        setState({
            ...state,
            autoplayEnd: false
        });

        setImmediate(() => {
            onAutoScrollEnd({ contentOffset });
        });
    };

    const autoScrollTimeout = (): TimeoutCallback => {
        return {
            callback: () => {
                endAutoPlay(() => scrollToOffset());
            },
            timeout: props.autoScroll?.timeout || defaultProps.autoplayTimeout!
        };
    };

    const onScrollBegin = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        setInternals((prev) => ({ ...prev, isScrolling: true }));
        setIsScrollDrag(true);
        props.onScrollBeginDrag && props.onScrollBeginDrag(event);
    };

    const calculateOffset = (event: {
        e?: NativeSyntheticEvent<NativeScrollEvent>;
        position?: number;
    }) => {
        let contentOffset;
        if (!event.e?.nativeEvent.contentOffset) {
            if (state.dir === 'x') {
                const x =
                    props.autoScroll?.distance || 0
                        ? event.position
                        : (event.position || 0) * state.width;
                contentOffset = {
                    x: x || 0,
                    y: 0
                };
            } else {
                const y = props.autoScroll?.distance
                    ? event.position
                    : (event.position || 0) * state.height;
                contentOffset = {
                    y: y || 0,
                    x: 0
                };
            }
        } else {
            contentOffset = event.e?.nativeEvent.contentOffset;
        }
        return contentOffset;
    };

    const onScrollEnd = (event: {
        e?: NativeSyntheticEvent<NativeScrollEvent>;
        position?: number;
    }) => {
        setInternals((prev) => ({ ...prev, isScrolling: false }));

        // making our events coming from android compatible to updateIndex logic

        const contentOffset = calculateOffset(event);
        updateIndex(contentOffset, state.dir, () => {
            autoplay();
            loopJump();
        });
        // if `onMomentumScrollEnd` registered will be called here
        event.e &&
            props.onMomentumScrollEnd &&
            props.onMomentumScrollEnd(event.e);
    };

    const onAutoScrollEnd = (event: {
        e?: NativeSyntheticEvent<NativeScrollEvent>;
        contentOffset?: PointProp;
    }) => {
        setInternals((prev) => ({ ...prev, isScrolling: false }));

        updateIndexWhenScroll(
            event.e?.nativeEvent?.contentOffset ||
                event.contentOffset || { x: 0, y: 0 },
            state.dir,
            () => {
                autoScroll();
                loopJump();
            }
        );

        // if `onMomentumScrollEnd` registered will be called here
        event.e &&
            props.onMomentumScrollEnd &&
            props.onMomentumScrollEnd(event.e);
    };

    const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset } = e.nativeEvent;
        const { horizontal } = props;
        const { children, index } = state;
        const { offset } = internals;
        const previousOffset = horizontal ? offset.x : offset.y;
        const newOffset = horizontal ? contentOffset.x : contentOffset.y;

        if (
            previousOffset === newOffset &&
            (index === 0 || index === children.length - 1)
        ) {
            setInternals((prev) => ({ ...prev, isScrolling: false }));
        }
    };

    const setStateWhenJump = (
        index: number,
        offset: PointProp,
        loopJump: boolean,
        dir: 'x' | 'y',
        cb: () => void
    ) => {
        const newState = { index, loopJump, offset: { x: 0, y: 0 } };
        setInternals((prevState) => {
            return {
                ...prevState,
                offset
            };
        });
        // only update offset in state if loopJump is true

        if (loopJump) {
            // when swiping to the beginning of a looping set for the third time,
            // the new offset will be the same as the last one set in state.
            // Setting the offset to the same thing will not do anything,
            // so we increment it by 1 then immediately set it to what it should be,
            // after render.
            if (offset[dir] === internals.offset[dir]) {
                newState.offset = { x: 0, y: 0 };
                newState.offset[dir] = offset[dir] + 1;
                setState((prev) => {
                    cb();
                    return {
                        ...prev,
                        ...newState,
                        offset
                    };
                });
            } else {
                newState.offset = offset;
                setState((prev) => {
                    cb();
                    return {
                        ...prev,
                        ...newState
                    };
                });
            }
        } else {
            setState((prev) => {
                cb();
                return {
                    ...prev,
                    ...newState
                };
            });
        }
    };

    const updateIndexWhenScroll = (
        offset: PointProp,
        dir: 'x' | 'y',
        cb: () => void
    ) => {
        if (!internals.offset)
            // Android not setting this onLayout first? https://github.com/leecade/react-native-swiper/issues/582
            setInternals((prevState) => {
                return {
                    ...prevState,
                    offset: { x: 0, y: 0 }
                };
            });
        const diff = internals.offset[state.dir] || 0;

        const { index, loopJump } = autoScrollJumpCheck(diff, offset);

        setStateWhenJump(index, offset, loopJump, dir, cb);
    };

    const autoJumpCheck = (diff: number, offset: { x: number; y: number }) => {
        let step = state.dir === 'x' ? state.width : state.height;
        if (state.index === state.total - 1) {
            step = lastItemStep;
        }
        let loopJump = false;

        // Do nothing if offset no change.
        let index = state.index + Math.round(diff / step);

        if (props.loop) {
            if (index <= -1 || (!index && !offset[state.dir])) {
                index = state.total - 1;
                offset[state.dir] = step * state.total;
                loopJump = true;
            } else if (index >= state.total) {
                index = 0;
                offset[state.dir] = step;
                loopJump = true;
            }
        }

        return {
            index,
            loopJump,
            diff
        };
    };

    const autoScrollJumpCheck = (
        diff: number,
        offset: { x: number; y: number }
    ) => {
        let loopJump = false;
        if (!isLastPageUneven) {
            const step = state.dir === 'x' ? state.width : state.height;

            // Do nothing if offset no change.
            let index = Math.floor(diff / step);
            if (props.loop) {
                if (index <= -1 || (!index && !offset[state.dir])) {
                    index = state.total - 2;
                    offset[state.dir] = step * (state.total - 1) + step;
                    loopJump = true;
                } else if (index >= state.total) {
                    index = 0;
                    offset[state.dir] = step;
                    loopJump = true;
                }
            }

            return {
                index,
                loopJump,
                diff
            };
        } else {
            let step = state.dir === 'x' ? state.width : state.height;
            if (state.index === state.total - 1) {
                step = step - lastItemStep;
            }
            // Do nothing if offset no change.
            let index = Math.floor(diff / step);
            if (props.loop) {
                if (index <= -1 || (!index && !offset[state.dir])) {
                    index = state.total - 2;
                    offset[state.dir] = step * (state.total - 1) + lastItemStep;
                    loopJump = true;
                } else if (index >= state.total) {
                    index = 0;
                    offset[state.dir] = step;
                    loopJump = true;
                }
            }

            return {
                index,
                loopJump,
                diff
            };
        }
    };

    // const autoJumpCheck = (diff: number, offset: { x: number; y: number }) => {
    //     let step = state.dir === 'x' ? state.width : state.height;
    //     if (state.index === state.total - 1) {
    //         step = lastItemStep;
    //     }
    //     let loopJump = false;
    //
    //     // Do nothing if offset no change.
    //     let index = state.index + Math.round(diff / step);
    //
    //     if (props.loop) {
    //         if (index <= -1 || (!index && !offset[state.dir])) {
    //             index = state.total - 1;
    //             offset[state.dir] = step * state.total;
    //             loopJump = true;
    //         } else if (index >= state.total) {
    //             index = 0;
    //             offset[state.dir] = step;
    //             loopJump = true;
    //         }
    //     }
    //
    //     return {
    //         index,
    //         loopJump,
    //         diff
    //     };
    // };

    const updateIndex = (
        offset: { x: number; y: number },
        dir: 'x' | 'y',
        cb: () => void
    ) => {
        if (!internals.offset)
            // Android not setting this onLayout first? https://github.com/leecade/react-native-swiper/issues/582
            setInternals((prevState) => {
                return {
                    ...prevState,
                    offset: { x: 0, y: 0 }
                };
            });
        const diff = offset[dir] - (internals.offset[dir] || 0);

        if (!diff) return;
        const { index, loopJump } = autoJumpCheck(diff, offset);

        setStateWhenJump(index, offset, loopJump, dir, cb);
    };

    const scrollBy = (index: number, animated = true) => {
        if (internals.isScrolling || state.total < 2) return;
        const diff = (props.loop ? 1 : 0) + index + state.index;
        let x = 0;
        let y = 0;
        if (state.dir === 'x') x = diff * state.width;
        if (state.dir === 'y') y = diff * state.height;

        refScrollView.current?.scrollTo({ x, y, animated });
        setInternals((prevState) => {
            return {
                ...prevState,
                isScrolling: true
            };
        });

        setState((prevState) => {
            return {
                ...prevState,
                autoplayEnd: false
            };
        });
        if (!animated || Platform.OS !== 'ios') {
            setTimeout(() => {
                onScrollEnd({
                    position: diff
                });
            }, 0);
        }
    };

    const scrollTo = (index: number, animated = true) => {
        if (internals.isScrolling || state.total < 2 || index === state.index)
            return;

        const diff = state.index + (index - state.index);
        let x = 0;
        let y = 0;
        if (state.dir === 'x') x = diff * state.width;
        if (state.dir === 'y') y = diff * state.height;

        refScrollView.current?.scrollTo({ x, y, animated });

        setInternals({
            ...internals,
            isScrolling: true
        });

        setState({
            ...state,
            autoplayEnd: false
        });

        if (!animated || Platform.OS !== 'ios') {
            setImmediate(() => {
                onScrollEnd({
                    position: diff
                });
            });
        }
    };

    const renderPagination = () => {
        if (state.total <= 1) return null;

        const dots = [];
        const ActiveDot = (props.activeDot || (
            <View
                style={[
                    {
                        backgroundColor: props.activeDotColor || '#007aff',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 3,
                        marginRight: 3,
                        marginTop: 3,
                        marginBottom: 3
                    },
                    props.activeDotStyle
                ]}
            />
        )) as React.ReactElement;
        const Dot = (props.dot || (
            <View
                style={[
                    {
                        backgroundColor: props.dotColor || 'rgba(0,0,0,.2)',
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginLeft: 3,
                        marginRight: 3,
                        marginTop: 3,
                        marginBottom: 3
                    },
                    props.dotStyle
                ]}
            />
        )) as React.ReactElement;

        for (let i = 0; i < state.total; i++) {
            dots.push(
                i === state.index
                    ? React.cloneElement(ActiveDot, { key: i })
                    : React.cloneElement(Dot, { key: i })
            );
        }

        return (
            <View
                pointerEvents="none"
                style={[
                    state.dir === 'x'
                        ? styles['pagination_x']
                        : styles['pagination_y'],
                    props.paginationStyle
                ]}
            >
                {dots}
            </View>
        );
    };

    const renderTitle = () => {
        const child = Array.isArray(state.children)
            ? state.children[state.index]
            : state.children;
        const title = child && child.props && child.props.title;
        return title ? (
            <View style={styles.title}>
                <Text>{title}</Text>
            </View>
        ) : null;
    };

    const renderPrevButton = () => {
        if (
            !props.showsButtons ||
            (props.disablePrevButton && state.index === 0)
        ) {
            return null;
        }

        return (
            <TouchableOpacity
                onPress={() => scrollTo(state.index - 1)}
                disabled={state.index === 0}
            >
                <View>
                    <Text style={styles.buttonText}>{'<'}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderNextButton = () => {
        if (
            !props.showsButtons ||
            (props.disableNextButton && state.index === state.total - 1)
        ) {
            return null;
        }

        return (
            <TouchableOpacity
                onPress={() => scrollTo(state.index + 1)}
                disabled={state.index === state.total - 1}
            >
                <View>
                    <Text style={styles.buttonText}>{'>'}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderButtons = () => {
        return (
            <View
                pointerEvents="box-none"
                style={[
                    styles.buttonWrapper,
                    {
                        width: state.width,
                        height: state.height
                    }
                ]}
            >
                {renderPrevButton()}
                {renderNextButton()}
            </View>
        );
    };

    // const onPageScrollStateChanged = (
    //     scrollState: 'dragging' | 'idle' | 'settling'
    // ) => {
    //     switch (scrollState) {
    //         case 'dragging':
    //             return onScrollBegin();
    //
    //         case 'idle':
    //         case 'settling':
    //             if (props.onTouchEnd) props.onTouchEnd();
    //     }
    // };

    const renderScrollView = (pages: React.ReactElement[]) => {
        return (
            <Animated.ScrollView
                ref={refScrollView}
                {...props}
                animatedProps={animatedProps}
                contentContainerStyle={[styles.wrapperIOS, props.style]}
                // contentOffset={state.offset}
                onScrollBeginDrag={onScrollBegin}
                onMomentumScrollEnd={(event) => {
                    props.autoplay
                        ? onScrollEnd({ e: event })
                        : onAutoScrollEnd({ e: event });
                }}
                onTouchStart={() => {
                    props.onTouchStart && props.onTouchStart();
                }}
                onTouchEnd={() => {
                    props.onTouchEnd && props.onTouchEnd();
                }}
                onScrollEndDrag={(e) => {
                    onScrollEndDrag(e);
                    props.onTouchEnd && props.onTouchEnd();
                }}
                style={props.scrollViewStyle}
            >
                {pages}
            </Animated.ScrollView>
        );
    };

    return (
        <View
            style={[styles.container, props.containerStyle]}
            onLayout={onLayout}
        >
            {renderScrollView(pageElements)}
            {props.showsPagination &&
                (props.renderPagination
                    ? props.renderPagination(state.index, state.total)
                    : renderPagination())}
            {renderTitle()}
            {props.showsButtons && renderButtons()}
        </View>
    );
};

const defaultProps: Partial<CustomSwiperProps> = {
    horizontal: true,
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    bounces: false,
    scrollsToTop: false,
    removeClippedSubviews: true,
    automaticallyAdjustContentInsets: false,
    showsPagination: true,
    showsButtons: false,
    disableNextButton: false,
    disablePrevButton: false,
    loop: true,
    loadMinimal: false,
    loadMinimalSize: 1,
    autoplay: false,
    autoplayTimeout: 2.5,
    autoplayDirection: true,
    index: 0,
    onIndexChanged: () => null
};

CustomSwiper.defaultProps = defaultProps;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        position: 'relative',
        flex: 1
    },

    wrapperIOS: {
        backgroundColor: 'transparent'
    },

    wrapperAndroid: {
        backgroundColor: 'transparent',
        flex: 1
    },

    slide: {
        backgroundColor: 'transparent'
    },

    pagination_x: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },

    pagination_y: {
        position: 'absolute',
        right: 15,
        top: 0,
        bottom: 0,
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },

    title: {
        height: 30,
        justifyContent: 'center',
        position: 'absolute',
        paddingLeft: 10,
        bottom: -30,
        left: 0,
        flexWrap: 'nowrap',
        width: 250,
        backgroundColor: 'transparent'
    },

    buttonWrapper: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    buttonText: {
        fontSize: 50,
        color: '#007aff'
    }
});

export default CustomSwiper;
