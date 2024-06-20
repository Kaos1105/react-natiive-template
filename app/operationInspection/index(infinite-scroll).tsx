// import {
//     Dimensions,
//     StyleSheet,
//     Text,
//     View,
//     ViewStyle,
//     StatusBar
// } from 'react-native';
// import { observer } from 'mobx-react';
// import { useHeaderHeight } from '@react-navigation/elements';
// import { useMemo, useRef, useState } from 'react';
// import CustomSwiper from '@/components/carousel/CustomSwiper';
// import { EmojiItemProp } from '@/components/reactionPicker/components/ReactionView/types';
// import { PalletSortDetail } from '@/types/pages/palletSort';
// import { splitArrayIntoChunks } from '@/hooks/commonHook';
// import { operationInspectionMockup } from '@/mock-up/operationInspectionMockup';
// import { Button } from '@/components/button/Button';
// import { Reaction } from '@/components/reactionPicker';
// import { ReactionRefType } from '@/components/reactionPicker/components/ReactionView/RootReaction';
//
// const ITEM_PER_PAGE = 6;
//
// type PalletItemProps = {
//     slideStyle: ViewStyle;
//     onPressIn?: () => void;
//     onPressOut?: () => void;
//     sortDetail: PalletSortDetail;
// };
//
// const ReactionItems = [
//     {
//         id: 0,
//         emoji: '😇',
//         title: 'like'
//     },
//     {
//         id: 1,
//         emoji: '🥰',
//         title: 'love'
//     },
//     {
//         id: 2,
//         emoji: '🤗',
//         title: 'care'
//     },
//     {
//         id: 3,
//         emoji: '😘',
//         title: 'kiss'
//     }
// ];
//
// const ReactionItem = () => {
//     const [selectedEmoji, setSelectedEmoji] = useState<EmojiItemProp>();
//     const rootRef = useRef<ReactionRefType>(null);
//     return (
//         <Reaction
//             cardStyle={{
//                 paddingVertical: 1
//             }}
//             ref={rootRef}
//             iconSize={20}
//             type={'modal'}
//             showPopupType={'onPress'}
//             items={ReactionItems}
//             onTap={setSelectedEmoji}
//         >
//             <Button
//                 title={''}
//                 style={styles.buttonContainer}
//                 onPress={(e) => {
//                     rootRef.current?.pressHandler();
//                 }}
//                 onLongPress={() => {
//                     rootRef.current?.longPressHandler();
//                 }}
//             >
//                 <Text
//                     style={{
//                         fontSize: 15
//                     }}
//                 >
//                     {selectedEmoji ? selectedEmoji?.emoji : 'Like'}
//                 </Text>
//             </Button>
//         </Reaction>
//     );
// };
//
// const PalletItem = ({ slideStyle, sortDetail }: PalletItemProps) => {
//     return (
//         <View style={slideStyle}>
//             <View style={styles.reactionContainer}>
//                 <ReactionItem></ReactionItem>
//                 <ReactionItem></ReactionItem>
//             </View>
//             <View style={styles.palletContainer}>
//                 <View style={{ flex: 1 }}>
//                     <Text style={[styles.palletCode, { fontSize: 14 }]}>
//                         {sortDetail.latestInspectionInfo?.sortOrder.toString()}
//                     </Text>
//                 </View>
//
//                 <View style={{ flex: 3 }}>
//                     <Text style={styles.palletCode}>
//                         {sortDetail.code.toString()}
//                     </Text>
//                 </View>
//             </View>
//             <View style={styles.reactionContainer}>
//                 <ReactionItem></ReactionItem>
//                 <ReactionItem></ReactionItem>
//             </View>
//         </View>
//     );
// };
//
// const InspectionIndex = observer(() => {
//     const headerHeight = useHeaderHeight();
//     const statusBarHeight = StatusBar.currentHeight || 0;
//     const { height } = Dimensions.get('window');
//
//     const slideStyle: ViewStyle = useMemo(() => {
//         return {
//             ...styles.slide,
//             maxHeight: (height - headerHeight + statusBarHeight) / ITEM_PER_PAGE
//         };
//     }, [height, headerHeight, statusBarHeight]);
//
//     const [isTouching, setIsTouching] = useState(false);
//
//     const chunkedOnlinePallets = useMemo(() => {
//         return splitArrayIntoChunks(
//             operationInspectionMockup.onlinePallets,
//             ITEM_PER_PAGE
//         );
//     }, []);
//
//     const handleTouchStart = () => {
//         // setIsTouching(true);
//     };
//
//     const handleTouchEnd = () => {
//         // setTimeout(() => {
//         //     setIsTouching(false);
//         // }, 2000);
//     };
//
//     return (
//         <View style={styles.container}>
//             <CustomSwiper
//                 removeClippedSubviews={false}
//                 maxItemPerPage={6}
//                 containerStyle={[styles.wrapper]}
//                 horizontal={false}
//                 pagingEnabled={false}
//                 showsPagination={false}
//                 onTouchStart={handleTouchStart}
//                 onTouchEnd={handleTouchEnd}
//                 // autoplay={!isTouching}
//                 autoScroll={
//                     !isTouching
//                         ? {
//                               distance: -slideStyle.maxHeight! / 3,
//                               direction: true,
//                               timeout: 1000
//                           }
//                         : undefined
//                 }
//                 loop
//                 onIndexChanged={(index) => {
//                     // console.log('scrollTo', index);
//                 }}
//             >
//                 {chunkedOnlinePallets.map((chunked, item) => {
//                     return (
//                         <View style={[styles.slideWrapper]} key={item}>
//                             {chunked.map((pallet, idx) => {
//                                 return (
//                                     <PalletItem
//                                         key={idx}
//                                         sortDetail={pallet}
//                                         slideStyle={slideStyle}
//                                     ></PalletItem>
//                                 );
//                             })}
//                         </View>
//                     );
//                 })}
//             </CustomSwiper>
//         </View>
//     );
// });
//
// export default InspectionIndex;
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1
//     },
//
//     wrapper: {},
//
//     slideWrapper: {},
//
//     slide: {
//         height: '100%',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#9DD6EB',
//         borderColor: '#fff',
//         borderWidth: 1,
//         flexDirection: 'row',
//         borderRadius: 5
//     },
//
//     palletCode: {
//         color: '#fff',
//         fontSize: 30,
//         fontWeight: 'bold'
//     },
//
//     reactionContainer: {
//         flexDirection: 'column',
//         height: '100%',
//         flex: 1,
//         justifyContent: 'space-between',
//         paddingVertical: 5,
//         paddingHorizontal: 5
//     },
//
//     palletContainer: {
//         flexDirection: 'column',
//         flex: 3,
//         justifyContent: 'center',
//         alignItems: 'center'
//     },
//
//     buttonContainer: {
//         paddingHorizontal: 0,
//         paddingVertical: 10
//     }
// });
