import React from 'react';
import {
    TextInputProps,
    View,
    StyleSheet,
    Text,
    TextInput,
    TextInputFocusEventData,
    NativeSyntheticEvent
} from 'react-native';
interface IProps extends TextInputProps {
    label: string;
    error?: string;
    touched?: boolean;
    editable?: boolean;
    onInputBlur: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
    onInputChange: (text: string) => void;
}
export const FormTextInput: React.FC<IProps> = (props) => {
    return (
        <View style={styles.formControl}>
            <View style={styles.inputControl}>
                <Text style={styles.label}>{props.label}</Text>
                <TextInput
                    {...props}
                    editable={props.editable}
                    style={styles.input}
                    onChangeText={props.onInputChange}
                    onBlur={props.onInputBlur}
                    value={props.value}
                />
            </View>
            <Text style={styles.errorText}>{props.error}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    inputControl: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row'
    },
    label: {
        flex: 1,
        textAlign: 'center',
        verticalAlign: 'middle',
        color: '#ffffff',
        backgroundColor: '#19477c',
        padding: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    input: {
        flex: 5,
        padding: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    formControl: { width: '100%', paddingBottom: 10 },
    errorText: {
        marginVertical: 2,
        marginHorizontal: 2,
        color: 'red',
        fontSize: 12
    }
});
