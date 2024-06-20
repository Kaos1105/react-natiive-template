import '@/plugins/i18n';
import { observer } from 'mobx-react';
import { useStore } from '@/stores/stores';
import { Redirect } from 'expo-router';

const Index = observer(() => {
    const { commonStore } = useStore();

    if (!commonStore.apiUrl) {
        return <Redirect href="/auth/regis-url" />;
    }

    if (!commonStore.token) {
        return <Redirect href="/auth" />;
    }

    return (
        <>
            <Redirect href={'/home'} />
        </>
    );
});

export default Index;
