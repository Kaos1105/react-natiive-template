import { ScrollView, StyleSheet } from 'react-native';

import { View } from '@/components/Themed';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import yup from '@/plugins/yup';
import { IP_REGEX } from '@/utils/regex';
import { Card } from '@/components/container/Card';
import { FormTextInput } from '@/components/form/FormTextInput';
import { useCustomForm } from '@/hooks/formHook';
import '@/plugins/i18n';
import { Button } from '@/components/button/Button';
import { FormikProps } from 'formik/dist/types';
import { isEmpty } from 'lodash';
import { HttpStatusCode } from 'axios';
import { useStore } from '@/stores/stores';
import { observer } from 'mobx-react';
import BaseModel from '@/model/BaseModel';

type UrlForm = {
    url: string;
};

const RegisUrl = observer(() => {
    const { t } = useTranslation();

    const { commonStore } = useStore();

    const router = useRouter();

    const [displayMessages, setDisplayMessages] = useState<string>('');

    const regisUrlScheme = yup.object().shape({
        url: yup
            .string()
            .required()
            .matches(IP_REGEX, `${t('validation.ipAddress')}`)
    });

    const onSubmit = async (urlForm: FormikProps<UrlForm>) => {
        const errors = await formHook.formik.validateForm();
        if (isEmpty(errors)) {
            try {
                commonStore.setIsLoading(true);
                const result = await BaseModel.checkAIP(urlForm.values.url);
                if (result.status === HttpStatusCode.Ok) {
                    commonStore.setApiUrl(urlForm.values.url);
                    router.navigate('/auth/');
                }
            } catch (ex) {
                console.log(ex);
                setDisplayMessages(t('auth.check_api.can_not_connect_server'));
            } finally {
                commonStore.setIsLoading(false);
            }
        }
    };

    const formHook = useCustomForm<UrlForm>({
        initialValue: {
            url: ''
        },
        validationSchema: regisUrlScheme
    });

    useEffect(() => {
        commonStore.setApiUrl('');
    }, []);

    return (
        <View style={styles.container}>
            <Card style={styles.authContainer}>
                <ScrollView>
                    <>
                        <FormTextInput
                            onInputChange={(e) =>
                                formHook.handleChange('url', e)
                            }
                            onInputBlur={() => formHook.handleBlur('url')}
                            value={formHook.formik.values.url}
                            label={t('auth.login.ip')}
                            error={
                                formHook.formik.errors.url
                                    ? formHook.formik.errors.url
                                    : displayMessages
                            }
                            touched={formHook.formik.touched.url}
                            placeholder={t('auth.login.ip_placeholder')}
                        />
                    </>
                    <Button
                        style={styles.submitButton}
                        title={t('auth.login.regis')}
                        onPress={() => onSubmit(formHook.formik)}
                    />
                </ScrollView>
            </Card>
        </View>
    );
});

export default RegisUrl;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20,
        marginVertical: 40
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%'
    },
    submitButton: {
        marginTop: 10,
        color: '#ffffff',
        backgroundColor: '#19477c',
        borderRadius: 10
    },
    header: {
        fontWeight: 'bold',
        textAlign: 'center',
        width: '100%',
        fontSize: 20,
        color: '#19477c',
        marginBottom: 20
    }
});
