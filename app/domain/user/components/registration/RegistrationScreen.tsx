import React from "react";
import {Linking, StyleSheet, View} from "react-native";
import RegistrationForm from "./RegistrationForm";
import {info} from "../../../../common/styles/Colors";
import { Text } from "react-native-elements";
import Config from "react-native-config";

const RegistrationScreen: React.FC = () => {
    return (
        <View style={styles.screen}>
            <View style={styles.registrationFormContainer}>
                <RegistrationForm />
                <View style={styles.linkContainer}>
                    <Text style={styles.link} onPress={() => Linking.openURL(Config.PRIVACY_POLICY_URL)}>Polityka prywatności</Text>
                </View>
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
    },
    linkContainer: {
        margin: 10,
        alignSelf: 'center'
    },
    link: {
        color: info
    }
});

export default RegistrationScreen
