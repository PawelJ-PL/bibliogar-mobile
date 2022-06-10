import React from "react";
import {Image, Linking, StyleSheet, Text, View} from "react-native";
import LoginForm from "./LoginForm";
import {Button} from "react-native-elements";
import Config from "react-native-config";

import Logo from '../../../../../resources/logo.png'
import {StackNavigationProp} from '@react-navigation/stack'
import {info, success} from "../../../../common/styles/Colors";
import {AuthStackParamProps} from "../../../../common/components/navigation/AuthStack";

type LoginScreenProps = {
    navigation: StackNavigationProp<AuthStackParamProps, 'loginScreen'>
}

const LoginScreen: React.FC<LoginScreenProps> = (props) => {
    return (
        <View style={styles.page}>
            <View style={styles.header}>
                <Image source={Logo} style={{height: undefined, width: undefined, flex: 1, alignSelf: 'stretch'}}
                       resizeMode='contain'/>
            </View>
            <View style={styles.login}>
                <LoginForm/>
                <View style={styles.linkContainer}>
                    <Text style={styles.link} onPress={() => props.navigation.navigate('passwordResetRequestScreen')}>Zapomniałem hasła</Text>
                </View>
            </View>
            <View style={styles.registration}>
                <Button title='Załóż konto' buttonStyle={styles.registrationButton}
                        onPress={() => props.navigation.navigate('registrationScreen')}/>
                <View style={styles.linkContainer}>
                    <Text style={styles.link} onPress={() => props.navigation.navigate('signUpConfirmationScreen')}>Wpisz
                        kod aktywacji konta</Text>
                </View>
                <View style={styles.linkContainer}>
                    <Text style={styles.link} onPress={() => Linking.openURL(Config.PRIVACY_POLICY_URL)}>Polityka prywatności</Text>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10
    },
    header: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    login: {
        flex: 3,
        justifyContent: 'center',
    },
    registration: {
        flex: 2,
        justifyContent: 'flex-start',
    },
    registrationButton: {
        backgroundColor: success
    },
    linkContainer: {
        margin: 10,
        alignSelf: 'flex-end'
    },
    link: {
        color: info
    }
});

export default LoginScreen
