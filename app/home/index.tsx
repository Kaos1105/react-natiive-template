import { StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import Search from '@/components/pages/home/Search';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Factory from '@/model/Factory';
import { useStore } from '@/stores/stores';
import { observer } from 'mobx-react';
import { Card } from '@/components/container/Card';
import { Button } from '@/components/button/Button';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import OperatingInspection from '@/model/OperatingInspection';
import { HttpStatusCode } from 'axios';
import { PalletSortList } from '@/types/pages/palletSort';
import SummaryInspection from '@/modules/dashboard/SummaryInspection';
import { UNEVENNESS_INFO_MEASUREMENT_PART } from '@/enums/commonFlg.enum';
import { FormErrors } from '@/types/common/common';
import { keys } from 'lodash';
import * as Network from 'expo-network';
import { SECOND_TO_MILLI } from '@/enums/operationInspection.enum';

const HomeIndex = observer(() => {
    const { t } = useTranslation();

    const { factoryStore, commonStore, operationInspectionStore } = useStore();

    const [network, setNetwork] = useState<Network.NetworkState>();

    useEffect(() => {
        const interval = setInterval(async () => {
            const networkState = await Network.getNetworkStateAsync();
            setNetwork(networkState);
        }, SECOND_TO_MILLI / 2);
        return () => clearInterval(interval);
    }, []);

    const fetchList = async () => {
        try {
            const result = await Factory.getMainDropdown();
            factoryStore.setFactoryDropdownList(result.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            Toast.show({
                type: 'error',
                text1: t('common.error.network_error')
            });
        }
    };

    const handleSelect = (value: string) => {
        const val = parseInt(value);
        factoryStore.setFactorySelect(val);
    };

    useEffect(() => {
        if (!factoryStore.factoryId && factoryStore.factories.length) {
            factoryStore.setFactorySelect(factoryStore.factories[0].id);
        }
    }, [factoryStore.factoryId, factoryStore.factories.length]);

    // init data
    useEffect(() => {
        (async () => {
            await factoryStore.initGetFactories();
            await operationInspectionStore.initGetOnlinePallets();
            await operationInspectionStore.initSortSetting();
        })();
    }, []);

    useEffect(() => {
        if (!factoryStore.factories.length && commonStore.apiUrl) {
            (async () => {
                await fetchList();
            })();
        }
    }, [factoryStore.factories.length, commonStore.apiUrl]);

    const currentFactoryPallet = useMemo(() => {
        return operationInspectionStore.onlineFactoryPallets?.find(
            (x) => x.factoryId == factoryStore.factoryId
        );
    }, [factoryStore.factoryId, operationInspectionStore.onlineFactoryPallets]);

    const fetchOperatingInspection = async () => {
        try {
            if (factoryStore.factoryId) {
                const result =
                    await OperatingInspection.getListOperatingInspection(
                        factoryStore.factoryId.toString()
                    );
                if (result.data && result.status == HttpStatusCode.Ok) {
                    Toast.show({
                        type: 'success',
                        text1: t('dashboardPage.success.downloadPallet')
                    });
                    setInspectionResult(result.data);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Toast.show({
                type: 'error',
                text1: t('common.error.network_error')
            });
        }
    };

    const setInspectionResult = (data: PalletSortList) => {
        operationInspectionStore.setOnlinePalletInspection({
            factoryId: factoryStore.factoryId ?? 0,
            onlinePallets: data.onlinePallets
        });

        operationInspectionStore.setSortSetting(data.sortSetting);
    };

    const handleRegisGapHold = useCallback(async () => {
        try {
            const result =
                await OperatingInspection.regisCachedOperatingInspection<FormErrors>(
                    factoryStore.factoryId?.toString() ?? '',
                    {
                        operatingInspections:
                            operationInspectionStore.getSubmitData
                    }
                );
            if (result.status == HttpStatusCode.Ok && result.data) {
                Toast.show({
                    type: 'success',
                    text1: t('dashboardPage.success.uploadGapHole')
                });
                setInspectionResult(result.data);
            } else {
                if (result.status == HttpStatusCode.BadRequest) {
                    const { errors }: FormErrors = result.data;
                    Toast.show({
                        type: 'error',
                        text1: errors[keys(errors)[0]]
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: t('error.failed_get_data')
                    });
                }
            }
        } catch (error) {
            console.warn(error);
            Toast.show({
                type: 'error',
                text1: t('common.error.network_error')
            });
        }
    }, [operationInspectionStore.getSubmitData]);

    const handleClearCachedData = () => {
        const emptyData: PalletSortList = {
            onlinePallets: [],
            offlinePallets: [],
            sortSetting: null
        };
        setInspectionResult(emptyData);
        Toast.show({
            type: 'success',
            text1: t('dashboardPage.success.clearData')
        });
    };

    return (
        <View style={styles.container}>
            <Card style={styles.cardContainer}>
                <Search
                    optionFilter={factoryStore.factories}
                    handleSelect={handleSelect}
                    factoryId={factoryStore.factoryId}
                />
                <View style={{ ...styles.featureContainer, marginTop: 10 }}>
                    <SummaryInspection
                        label={t('dashboardPage.north')}
                        gapSide={
                            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_NORTH
                        }
                    />
                    <SummaryInspection
                        label={t('dashboardPage.south')}
                        gapSide={
                            UNEVENNESS_INFO_MEASUREMENT_PART.ORE_DISCHARGE_SOUTH
                        }
                    />
                </View>
                <View style={styles.featureContainer}>
                    <Button
                        disabled={
                            !factoryStore.factoryId ||
                            !currentFactoryPallet?.onlinePallets.length
                        }
                        style={styles.featureBtn}
                        title={t('dashboardPage.featHoleInspection')}
                        onPress={() => {
                            router.navigate('/operationInspection');
                        }}
                    ></Button>
                    <Button
                        disabled={
                            !factoryStore.factoryId ||
                            !currentFactoryPallet?.onlinePallets.length
                        }
                        style={styles.featureBtn}
                        title={t('dashboardPage.featClearData')}
                        onPress={() => {
                            handleClearCachedData();
                        }}
                    />
                    <Button
                        disabled={
                            !factoryStore.factoryId || !network?.isConnected
                        }
                        style={styles.featureBtn}
                        title={t('dashboardPage.featPalletOrderDL')}
                        onPress={async () => {
                            await fetchOperatingInspection();
                        }}
                    />
                    <Button
                        disabled={
                            !factoryStore.factoryId ||
                            !currentFactoryPallet?.onlinePallets.length ||
                            !network?.isConnected
                        }
                        style={styles.featureBtn}
                        title={t('dashboardPage.featPalletHoleUL')}
                        onPress={async () => {
                            await handleRegisGapHold();
                        }}
                    />
                </View>
            </Card>
        </View>
    );
});

export default HomeIndex;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    featureContainer: {
        flexDirection: 'column',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginVertical: 5
    },
    cardContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 800,
        padding: 20,
        marginVertical: 40
    },
    featureBtn: {
        color: '#ffffff',
        backgroundColor: '#19477c',
        borderRadius: 10,
        marginVertical: 10,
        minHeight: 50
    }
});
