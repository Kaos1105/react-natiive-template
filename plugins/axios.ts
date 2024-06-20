import axios, { AxiosError, AxiosResponse, HttpStatusCode } from 'axios';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { stores } from '@/stores/stores';
import { TIME_OUT } from '@/constants/AxiosConst';

const instance = axios.create();
// instance.defaults.baseURL = process.env.EXPO_PUBLIC_API_URL;
instance.defaults.timeout = TIME_OUT;
instance.defaults.headers.common['Accept'] = 'application/json';
instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Interceptors
instance.interceptors.request.use(
    async (config) => {
        const { token } = stores.commonStore;
        if (token && config.headers)
            config.headers.Authorization = `Bearer ${token}`;
        config.headers.set('Accept-Language', 'ja-JP');
        return config;
    },
    async (error) => {}
);

const router = useRouter();
const delayApi = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

instance.interceptors.response.use(
    async (response) => {
        // await delayApi(1000);
        return response;
    },
    async (error: AxiosError) => {
        const { data, status, config: _ } = error.response as AxiosResponse;

        const handle400Error = () => {
            if (data.errors) {
                const modalStateErrors: Record<string, unknown> = {};
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        const lowerCaseKey =
                            key.charAt(0).toLowerCase() + key.slice(1);
                        modalStateErrors[lowerCaseKey] = Array.isArray(
                            data.errors[key]
                        )
                            ? data.errors[key][0]
                            : data.errors[key];
                    }
                }
                return {
                    ...error.response,
                    data: {
                        ...data,
                        errors: modalStateErrors
                    }
                };
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'unknown error'
                });
            }
        };

        switch (status) {
            case HttpStatusCode.BadRequest:
                return handle400Error();
            case HttpStatusCode.Unauthorized:
                // setToken(null);
                // router.navigate('/auth');
                break;
            case HttpStatusCode.Forbidden:
                Toast.show({
                    type: 'error',
                    text1: 'Forbidden'
                });
                break;
            case HttpStatusCode.NotFound:
                await router.navigate('/not-found');
                break;
            case HttpStatusCode.InternalServerError:
                await router.navigate('/server-error');
                break;
            default:
                await router.navigate('/auth/regis-url');
        }
        return Promise.reject(error);
    }
);

export default { instance };
