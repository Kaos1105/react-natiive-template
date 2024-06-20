import { isEmpty, isNull, some } from 'lodash';

import { FileContent } from '@/types/common/common';

export function containsJapanese(str: string) {
    const regex = /[\u3040-\u309F\u30A0-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/;
    return regex.test(str);
}

export const handleDownload = (
    blob: Blob,
    file?: FileContent,
    fileName?: string
) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = file?.fileName || fileName || '';
    link.click();
};

export const downloadFromUrl = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
};

export const cutSymbol = (text: string) => {
    if (text) {
        if (containsJapanese(text) && text?.length > 15) {
            return `${text.substring(0, 15)}...`;
        } else if (text.length >= 30) {
            return `${text.substring(0, 30)}...`;
        }
        return text;
    }
};

export const hasNullValueObj = (
    obj: Record<string, unknown> | null
): boolean => {
    if (isNull(obj)) {
        return true; // Object is null
    }
    return some(obj, (value) => isNull(value)); // Check for any null value in the object
};

export const isNullOrEmpty = (obj: unknown) => {
    return isNull(obj) || isEmpty(obj);
};

export const formatTime = (secondNumber: number) => {
    const minutes = Math.floor(secondNumber / 60);
    const seconds = secondNumber % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
};
export const formatOperatingTime = (minute: number) => {
    const hours = Math.floor(minute / 60);
    const days = Math.floor(minute / 60 / 24);

    return `${hours}時間  (${days}日)`;
};

export const splitArrayIntoChunks = <T extends Record<string, unknown>>(
    arr: T[],
    chunkSize: number
): T[][] => {
    const result: T[][] = [];

    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }

    return result;
};
