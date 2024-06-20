import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { ServerError } from '@/types/common/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootStores from '@/stores/stores';
import { API_URL } from '@/enums/storageKey.enum';
import axios from '@/plugins/axios';

export default class CommonStore {
    rootStore: RootStores;

    error: ServerError | null = null;
    apiUrl: string = '';
    token: string | null = null;
    isLoading = false;

    constructor(rootStore: RootStores) {
        this.rootStore = rootStore;
        makeAutoObservable(this);

        reaction(
            () => this.token,
            async (token) => {
                if (token) {
                    await AsyncStorage.setItem('jwt', token);
                } else {
                    await AsyncStorage.multiRemove([
                        'jwt'
                        // OPERATING_INSPECTION_STORAGE,
                        // SORT_SETTINGS
                    ]);
                }
            }
        );

        reaction(
            () => this.apiUrl,
            async (apiUrl) => {
                if (apiUrl) {
                    await AsyncStorage.setItem(API_URL, apiUrl);
                } else {
                    await AsyncStorage.multiRemove([API_URL]);
                }
            }
        );
    }

    setServerError(error: ServerError) {
        this.error = error;
    }

    setApiUrl(url: string) {
        this.apiUrl = url;
        axios.instance.defaults.baseURL = `http://${url}:5025/api`;
    }

    async getUrl() {
        if (!this.apiUrl) {
            const apiUrl = await AsyncStorage.getItem(API_URL);
            runInAction(() => {
                this.apiUrl = apiUrl ?? '';
                return apiUrl;
            });
        }
        return this.apiUrl;
    }

    async getToken() {
        if (!this.token) {
            const token = await AsyncStorage.getItem('jwt');
            runInAction(() => {
                this.token = token;
                return token;
            });
        }
        return this.token;
    }

    setToken(token: string | null) {
        this.token = token;
    }

    setIsLoading(value: boolean) {
        this.isLoading = value;
    }
}
