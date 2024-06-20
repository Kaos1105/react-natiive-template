import React, { useState } from 'react';
import { TextInputProps, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface IProps extends TextInputProps {
    options?: Array<{ label: string; value: string }>;
    onInputChange: (text: string) => void;
}

export const HeaderDropdown: React.FC<IProps> = (props) => {
    const [selectedValue, setSelectedValue] = useState(props.value);

    const onChange = (itemValue: string, _: number) => {
        if (itemValue) {
            setSelectedValue(itemValue);
            props.onInputChange(itemValue);
        }
    };

    return (
        <View style={styles.pickerContainer}>
            <Picker
                mode="dropdown"
                style={styles.picker}
                onValueChange={onChange}
                itemStyle={{ height: 20 }}
                selectedValue={props.value}
            >
                {props.options?.map((value, index) => (
                    <Picker.Item
                        style={styles.pickerItem}
                        key={index}
                        label={value.label}
                        value={value.value}
                    />
                ))}
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 10,
        maxHeight: 30,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        borderColor: '#19477c',
        backgroundColor: '#c5d4e4'
    },
    picker: {
        minWidth: 140,
        width: '100%',
        borderRadius: 10
    },
    pickerItem: {
        display: 'flex',
        maxWidth: 120
    }
});
