import { ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useLockCountdown } from '@/helper/auth/useLockCountdown';
import yup from '@/plugins/yup';
import {
    HAFT_WIDTH_REGEX_INPUT,
    REGEX_SYMBOL_ALPHA_NUMBER_LIST
} from '@/utils/regex';
import { Card } from '@/components/container/Card';
import { FormTextInput } from '@/components/form/FormTextInput';
import { handleValidationErrs, useCustomForm } from '@/hooks/formHook';
import '@/plugins/i18n';
import { Button } from '@/components/button/Button';
import { isNullOrEmpty } from '@/hooks/commonHook';
import { FormikProps } from 'formik/dist/types';
import { isEmpty } from 'lodash';
import { AxiosError } from 'axios';
import { FormErrors } from '@/types/common/common';
import { useStore } from '@/stores/stores';
import User from '@/model/User';
import { observer } from 'mobx-react';
import Toast from 'react-native-toast-message';

type LoginForm = {
    loginId: string;
    password: string;
};

type UserDetail = {
    code: string;
    name: string;
    kana: string;
    workplaceName: string;
    departmentName: string;
    companyName: string;
    token: string;
};

const Login = observer(() => {
    const { t } = useTranslation();

    const { commonStore } = useStore();

    const router = useRouter();

    const [displayMessages, setDisplayMessages] = useState<string>('');

    const { countdown, setCountdown, displayLockedMsg } = useLockCountdown();

    const loginScheme = yup.object().shape({
        loginId: yup
            .string()
            .required()
            .matches(HAFT_WIDTH_REGEX_INPUT, `${t('validation.half_width')}`)
            .min(5, t('validation.login_fail').toString())
            .max(40, t('validation.login_fail').toString()),
        password: yup
            .string()
            .required()
            .matches(
                REGEX_SYMBOL_ALPHA_NUMBER_LIST,
                `${t('validation.login_fail')}`
            )
            .min(5, t('validation.login_fail').toString())
            .max(40, t('validation.login_fail').toString())
    });

    const onSubmit = async (helpers: FormikProps<LoginForm>) => {
        const errors = await formHook.formik.validateForm();
        if (isEmpty(errors)) {
            try {
                commonStore.setIsLoading(true);
                const result = await User.login<FormErrors & UserDetail>(
                    helpers.values
                );
                if (result.data.errors) {
                    handleValidationErrs(result, helpers, helpers.values);
                } else {
                    commonStore.setToken(result.data.token);
                    router.navigate('/');
                }
            } catch (ex) {
                const errResp = (ex as AxiosError<{ lockedSeconds: number }>)
                    ?.response;
                console.log(ex);
                switch (errResp?.status) {
                    case 401:
                        setDisplayMessages(t('validation.login_fail'));
                        break;
                    case 403:
                        setDisplayMessages('Forbidden');
                        break;
                    case 429:
                        setCountdown(errResp?.data?.lockedSeconds);
                        break;
                    case 500:
                        setDisplayMessages('Server error');
                        break;
                    default:
                        Toast.show({
                            type: 'error',
                            text1: t('common.error.network_error')
                        });
                        commonStore.setApiUrl('');
                        router.navigate('/auth/regis-url');
                }
            } finally {
                commonStore.setIsLoading(false);
            }
        }
    };

    const formHook = useCustomForm<LoginForm>({
        initialValue: {
            loginId: '',
            password: ''
        },
        validationSchema: loginScheme
    });

    useEffect(() => {
        commonStore.setToken(null);
    }, []);

    useEffect(() => {
        if (countdown > 0) {
            setDisplayMessages(displayLockedMsg);
        }
    }, [countdown]);

    return (
        <View style={styles.container}>
            <Card style={styles.authContainer}>
                <ScrollView>
                    <>
                        <Text style={styles.header}>
                            {t('auth.login.title')}
                        </Text>
                        <FormTextInput
                            onInputChange={(e) =>
                                formHook.handleChange('loginId', e)
                            }
                            onInputBlur={() => formHook.handleBlur('loginId')}
                            value={formHook.formik.values.loginId}
                            label={t('auth.login.id')}
                            error={formHook.formik.errors.loginId}
                            touched={formHook.formik.touched.loginId}
                            placeholder={t('auth.login.id_placeholder')}
                        />
                        <FormTextInput
                            onInputChange={(e) =>
                                formHook.handleChange('password', e)
                            }
                            onInputBlur={() => formHook.handleBlur('password')}
                            value={formHook.formik.values.password}
                            label={t('auth.login.pass')}
                            error={
                                formHook.formik.errors.password
                                    ? formHook.formik.errors.password
                                    : displayMessages
                            }
                            touched={formHook.formik.touched.password}
                            placeholder={t('auth.login.pass_placeholder')}
                            secureTextEntry={true}
                        />
                    </>
                    <Button
                        disabled={
                            !isNullOrEmpty(formHook.formik.errors) ||
                            countdown > 0
                        }
                        style={styles.submitButton}
                        title={t('auth.login.loginButton')}
                        onPress={() => onSubmit(formHook.formik)}
                    />
                </ScrollView>
            </Card>
        </View>
    );
});

export default Login;

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
