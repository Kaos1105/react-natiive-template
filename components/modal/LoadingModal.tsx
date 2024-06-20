import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Theme } from '@/theme';
import { observer } from 'mobx-react';
import { useStore } from '@/stores/stores';

interface TProps {
    color?: string;
}

export const LoadingModal = observer((props: TProps) => {
    const { commonStore } = useStore();

    return (
        commonStore.isLoading && (
            <View style={styles.container}>
                <ActivityIndicator
                    size="large"
                    color={Theme.colors.tintColor}
                    style={styles.activityIndicator}
                />
            </View>
        )
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ scaleX: 2 }, { scaleY: 2 }]
    }
});
