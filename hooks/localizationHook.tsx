import { useTranslation } from "react-i18next";

export interface IOption {
    value: null | string | number;
    label: string;
}

export function useLocalization() {
    const { t } = useTranslation();

    const allOption: Array<IOption> = [
        {
            value: "",
            label: t("common.all")
        }
    ];

    return { allOption };
}
