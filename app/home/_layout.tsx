import React from 'react';
import { Stack, useRouter } from 'expo-router';

import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useStore } from '@/stores/stores';
import { AntDesign } from '@expo/vector-icons';
import NavHeader from '@/components/layout/NavHeader';
import { observer } from 'mobx-react';
import { Button } from '@/components/button/Button';
import { useTranslation } from 'react-i18next';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//     name: React.ComponentProps<typeof FontAwesome>['name'];
//     color: string;
// }) {
//     return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

const HomeLayout = observer(() => {
    const { t } = useTranslation();

    const { factoryStore, commonStore } = useStore();

    const router = useRouter();

    const handleLogout = () => {
        commonStore.setToken(null);
        factoryStore.setFactorySelect(null);
        router.navigate('/auth');
    };

    return (
        <Stack
            screenOptions={{
                // Disable the static render of the header on web
                // to prevent a hydration error in React Navigation v6.
                headerShown: useClientOnlyValue(false, true),
                headerStyle: {
                    backgroundColor: `${Colors.default.navbar}`
                }
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: ``,
                    headerLeft: () => (
                        <NavHeader title={t('dashboardPage.title')} />
                    ),
                    headerRight: () => (
                        <Button
                            onPress={handleLogout}
                            title={''}
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 10
                            }}
                        >
                            <AntDesign
                                name="logout"
                                size={15}
                                color={Colors.default.text}
                            />
                        </Button>
                    )
                }}
            />
        </Stack>
    );
});

export default HomeLayout;
