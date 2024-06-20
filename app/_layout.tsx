import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Navigator } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import Slot = Navigator.Slot;
import Toast from 'react-native-toast-message';
import { useStore } from '@/stores/stores';
import { observer } from 'mobx-react';
import { ReactionProvider } from '@/components/reactionPicker';
import { LoadingModal } from '@/components/modal/LoadingModal';

if (__DEV__) {
    require('../ReactotronConfig');
}

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: 'index'
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <>
            <RootLayoutNav />
        </>
    );
}

const RootLayoutNav = observer(() => {
    const colorScheme = useColorScheme();

    const { commonStore } = useStore();

    useEffect(() => {
        (async () => {
            await commonStore.getToken();
            const apiUrl = await commonStore.getUrl();
            commonStore.setApiUrl(apiUrl);
        })();
    }, []);

    return (
        <ReactionProvider>
            <>
                <ThemeProvider
                    value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
                >
                    <Slot />
                    {/*<Stack>*/}
                    {/*  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />*/}
                    {/*  <Stack.Screen name="modal" options={{ presentation: 'modal' }} />*/}
                    {/*</Stack>*/}
                </ThemeProvider>
                <Toast />
                <LoadingModal />
            </>
        </ReactionProvider>
    );
});
