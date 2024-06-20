import React from 'react';
import { Stack } from 'expo-router';

import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { observer } from 'mobx-react';
import { OperatingHeader } from '@/modules/operatingInspection/OperatingHeader';

const InspectionLayout = observer(() => {
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
                    headerLeft: () => <OperatingHeader />
                }}
            />
        </Stack>
    );
});

export default InspectionLayout;
