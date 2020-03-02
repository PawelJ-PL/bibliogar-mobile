import React, {useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import SimpleFormStyle from "./SimpleFormStyle";
import {Button, Input} from "react-native-elements";
import PasswordInput from "../../../../common/components/inputs/PasswordInput";
import {passwordMinLength} from "../registration/RegistrationForm";
import {AppState} from "../../../../common/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {resetPasswordAction, resetPasswordResetAction} from "../../store/Actions";
import OperationErrorMessageBox from "../../../../common/components/messagebox/OperationErrorMessageBox";
import MessageBox from "../../../../common/components/messagebox/MessageBox";
import Toast from "react-native-root-toast";
import {OperationStatus} from "../../../../common/store/async/AsyncOperationResult";
import {StackNavigationProp} from "@react-navigation/stack";
import {AuthStackParamProps} from "../../../../common/components/navigation/AuthStack";

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
    navigation: StackNavigationProp<AuthStackParamProps, 'passwordResetScreen'>
}

const PasswordResetScreen: React.FC<Props> = (props) => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        props.resetStatus()
    }, []);

    useEffect(() => {
        if (props.result) {
            Toast.show('Hasło zostało zmienione');
            props.resetStatus();
            props.navigation.navigate('loginScreen');
        }
    }, [props.result]);

    const canSubmit = code.trim().length > 0 && password.trim().length >= passwordMinLength && !props.inProgress;

    return(
        <View style={SimpleFormStyle.container}>
            <OperationErrorMessageBox visible={props.error !== undefined}/>
            <MessageBox visible={props.result === false} message='Wprowadzony kod jest nieprawidłowy' type='warning'/>
            <Input autoFocus={true} onChangeText={setCode} value={code} label='Wprowadź kod resetu hasła' containerStyle={styles.inputContainer} />
            <PasswordInput onChangeText={setPassword} value={password} containerStyle={styles.inputContainer} label='Nowe hasło' />
            <Button title='Ustaw hasło' disabled={!canSubmit} onPress={() => props.setPassword(code, password)} loading={props.inProgress} buttonStyle={styles.button} />
        </View>
    )
};

// PasswordResetScreen.navigationOptions = {
//     title: 'Reset hasła'
// };

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20
    },
    button: {
        minWidth: 120
    }
});

const mapStateToProps = (state: AppState) => {
    return {
        error: state.user.registration.resetPasswordStatus.error,
        result: state.user.registration.resetPasswordStatus.data,
        inProgress: state.user.registration.resetPasswordStatus.status === OperationStatus.PENDING
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setPassword(code: string, password: string) {
            dispatch(resetPasswordAction.started({token: code, password}))
        },
        resetStatus() {
            dispatch(resetPasswordResetAction())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetScreen)
