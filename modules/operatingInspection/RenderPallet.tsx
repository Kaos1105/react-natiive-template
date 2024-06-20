import React, { memo } from 'react';
import { View, ViewStyle } from 'react-native';
import PalletItem from '@/modules/operatingInspection/PalletItem';
import { PalletSortDetail } from '@/types/pages/palletSort';

interface IProps {
    item: PalletSortDetail;
    slideStyle: ViewStyle;
}

const RenderPallet: React.FC<IProps> = (props) => {
    return (
        <View style={{ flex: 1 }}>
            <PalletItem sortDetail={props.item} slideStyle={props.slideStyle} />
        </View>
    );
};

export default memo(RenderPallet);
