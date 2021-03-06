import React from "react";
import {StyleSheet, View} from "react-native";
import RegistrationForm from "./RegistrationForm";

const RegistrationScreen: React.FC = () => {
    return (
        <View style={styles.screen}>
            <View style={styles.registrationFormContainer}>
                <RegistrationForm />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    registrationFormContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10
    }
});

export default RegistrationScreen
