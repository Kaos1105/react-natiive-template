import { useTranslation } from 'react-i18next';
import { FactoryItemResource } from '@/types/pages/factory';
import { observer } from 'mobx-react';
import { Dropdown } from '@/components/form/Dropdown';
import { View } from 'react-native';

interface IProps {
    handleSelect: (value: string) => void;
    optionFilter?: FactoryItemResource[];
    factoryId: number | null;
}

export interface IOption {
    value: number;
    label: string;
}

const Search = observer(({ optionFilter, handleSelect, factoryId }: IProps) => {
    const { t } = useTranslation();

    const convertOptionFilter = () => {
        return optionFilter?.map((item: FactoryItemResource) => {
            return {
                value: item?.id.toString(),
                label: item?.name
            };
        });
    };

    return (
        <View>
            <Dropdown
                placeholder={''}
                value={factoryId?.toString()}
                onInputChange={(value: string) => handleSelect(value)}
                options={convertOptionFilter()}
            />
        </View>
    );
});
export default Search;
