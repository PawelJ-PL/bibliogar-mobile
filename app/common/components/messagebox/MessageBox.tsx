import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {error, errorDark, info, infoDark, success, successDark, warning, warningDark} from "../../styles/Colors";

const MessageBox: React.FC<MessageBoxProps> = ({visible, message, type}) => {
    if (visible) {
        return (
            <View style={[styles.container, styles[type]]}>
                <Text>{message}</Text>
            </View>
        )
    } else {
        return null
    }
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 15,
        margin: 5,
        borderRadius: 7,
        borderWidth: 1
    },
    success: {
        backgroundColor: success,
        borderColor: successDark
    },
    info: {
        backgroundColor: info,
        borderColor: infoDark
    },
    warning: {
        backgroundColor: warning,
        borderColor: warningDark
    },
    error: {
        backgroundColor: error,
        borderColor: errorDark
    }
});

type MessageBoxProps = {
    visible: boolean,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error'
}

export default MessageBox;
