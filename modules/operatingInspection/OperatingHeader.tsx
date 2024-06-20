import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/stores/stores';
import { HeaderDropdown } from '@/modules/operatingInspection/HeaderDropdown';
import { observer } from 'mobx-react';

interface IProps {}

export const OperatingHeader: React.FC<IProps> = observer(() => {
    const { t } = useTranslation();

    const { factoryStore, operationInspectionStore } = useStore();

    const convertOptionFilter = () => {
        return operationInspectionStore.validOnlinePallet.map((item) => {
            return {
                value: item?.code,
                label: item?.code
            };
        });
    };

    const setBottomPallet = (value: string) => {
        const pallet = operationInspectionStore.validOnlinePallet.find(
            (x) => x?.code === value
        );
        if (pallet) {
            operationInspectionStore.setBottomPallet(pallet);
        }
    };

    return (
        <View style={styles.container}>
            {factoryStore.factoryDetail && (
                <Text style={styles.title}>
                    ({factoryStore.factoryDetail?.name}){' '}
                </Text>
            )}
            <Text style={styles.title}>
                {t('dashboardPage.featHoleInspection')}
            </Text>
            <View style={{ maxHeight: 25, paddingHorizontal: 10 }}>
                <HeaderDropdown
                    placeholder={''}
                    value={
                        operationInspectionStore.bottomPallet?.code ?? undefined
                    }
                    onInputChange={(value: string) => {
                        setBottomPallet(value);
                    }}
                    options={convertOptionFilter()}
                />
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    title: {
        fontSize: Colors.default.headerFontSize,
        color: `${Colors.default.text}`,
        textAlign: 'center'
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 1,
        height: 20
    }
});
