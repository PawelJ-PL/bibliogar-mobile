import React, {useEffect, useState} from "react";
import {Alert, StyleSheet, View} from "react-native";
import {Button, Input} from "react-native-elements";
import {AppState} from "../../../../common/store";
import {Dispatch} from "redux";
import {performLoginAction} from "../../store/Actions";
import {connect} from "react-redux";
import {OperationStatus} from "../../../../common/store/async/AsyncOperationResult";
import MessageBox from "../../../../common/components/messagebox/MessageBox";
import {emailPattern, passwordMinLength} from "../registration/RegistrationForm";

type LoginFormProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const LoginForm: React.FC<LoginFormProps> = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (props.result === null) {
            Alert.alert("Logowanie nieudane", "Niepoprawny użytkownik lub hasło")
        }
    }, [props.result]);

    const canSubmit = () => {
        return emailPattern.test(email.trim()) &&
            password.trim().length >= passwordMinLength &&
            !props.isLoading
    };

    const handleSubmit = () => {
        setPassword('');
        props.performLogin(email.trim(), password.trim());
    };

    return (
        <View style={styles.container}>
            <MessageBox
                visible={Boolean(props.loginError)}
                message='Wystąpił błąd w trakcie logowania. Spróbuj ponownie.'
                type='error'
            />
            <MessageBox
                visible={Boolean(props.deviceRegistrationError)}
                message='Wystąpił błąd w trakcie rejestracji urządzenia. Spróbuj ponownie.'
                type='error'
            />
            <Input
                placeholder='e-mail'
                autoFocus={true}
                keyboardType='email-address'
                onChangeText={setEmail}
                value={email}
            />
            <Input placeholder='hasło' secureTextEntry={true} onChangeText={setPassword} value={password}/>
            <Button
                containerStyle={styles.loginButton}
                title='Zaloguj'
                disabled={!canSubmit()}
                loading={props.isLoading}
                onPress={handleSubmit}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    loginButton: {
        alignSelf: 'stretch'
    }
});

const mapStateToProps = (state: AppState) => {
    return {
        isLoading: state.user.loginStatus.status === OperationStatus.PENDING,
        result: state.user.loginStatus.data,
        loginError: state.user.loginStatus.error,
        deviceRegistrationError: state.device.registrationStatus.error
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        performLogin(email: string, password: string) {
            dispatch(performLoginAction.started({email, password}))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
