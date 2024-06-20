import React from 'react';
import { Redirect, Stack } from 'expo-router';

import { observer } from 'mobx-react';
import { useStore } from '@/stores/stores';

const AuthLayout = observer(() => {
    const { commonStore } = useStore();

    if (commonStore.token) {
        return <Redirect href="/home" />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        ></Stack>
    );
});

export default AuthLayout;
