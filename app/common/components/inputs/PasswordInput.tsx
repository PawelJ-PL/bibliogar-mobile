import React, {useState} from "react";
import {Input} from "react-native-elements";
import {StyleProp, TextStyle, ViewStyle} from "react-native";

type Props = {
    containerStyle?: StyleProp<ViewStyle>
    inputContainerStyle?: StyleProp<ViewStyle>
    inputStyle?: StyleProp<TextStyle>
    onChangeText: (text: string) => any
    onBlur?: (event: any) => any
    value: string
    errorMessage?: string,
    defaultShow?: boolean,
    label?: string
    placeholder?: string
}

const PasswordInput: React.FC<Props> = ({containerStyle, inputContainerStyle, inputStyle, onChangeText, onBlur, value, errorMessage, defaultShow, label, placeholder}) => {
    const [showPassword, setShowPassword] = useState(defaultShow === undefined ? false : defaultShow);

    const passwordShowIcon = {
        type: 'ionicon',
        name: showPassword ? 'ios-eye-off' : 'ios-eye',
        size: 32,
        onPress: () => setShowPassword(prev => !prev)
    };

    return (
        <Input
            containerStyle={containerStyle}
            inputContainerStyle={inputContainerStyle}
            inputStyle={inputStyle}
            secureTextEntry={!showPassword}
            placeholder={placeholder === undefined ? 'hasło' : placeholder}
            label={label === undefined ? 'Hasło' : label}
            rightIcon={passwordShowIcon}
            onChangeText={onChangeText}
            onBlur={onBlur}
            value={value}
            errorMessage={errorMessage}
        />
    )
};

export default PasswordInput
