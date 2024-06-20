import { StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { useStore } from '@/stores/stores';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';

type IProps = {
    title: string;
    link?: string;
};
const NavHeader = observer((props: IProps) => {
    const { factoryStore } = useStore();

    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {t('dashboardPage.headerAdminIndex')}
            </Text>
            <AntDesign
                name="right"
                size={12}
                color={Colors.default.text}
                style={{
                    marginHorizontal: 5,
                    marginTop: 5
                }}
            />
            {factoryStore.factoryDetail && (
                <Text style={styles.title}>
                    ({factoryStore.factoryDetail?.name}){' '}
                </Text>
            )}
            <Text style={styles.title}>{props.title}</Text>
        </View>
    );
});
export default NavHeader;

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
