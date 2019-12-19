import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Button, Input} from "react-native-elements";
import {AppState} from "../../../../common/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {confirmSignUpAction, resetSignUpConfirmationAction} from "../../store/Actions";
import MessageBox from "../../../../common/components/messagebox/MessageBox";
import OperationErrorMessageBox from "../../../../common/components/messagebox/OperationErrorMessageBox";
import {OperationStatus} from "../../../../common/store/async/AsyncOperationResult";
import Toast from 'react-native-root-toast';
import {NavigationStackScreenProps} from "react-navigation-stack";
import {NavigationScreenComponent} from "react-navigation";
import SimpleFormStyle from "../password_reset/SimpleFormStyle";

type SignUpConfirmationScreenProps =
    ReturnType<typeof mapStateToProps>
    & ReturnType<typeof mapDispatchToProps>
    & NavigationStackScreenProps

const SignUpConfirmationScreen: React.FC<SignUpConfirmationScreenProps> & NavigationScreenComponent<{}, {}> = (props) => {
    const [code, setCode] = useState('');

    useEffect(() => {
        props.resetStatus()
    }, []);

    useEffect(() => {
        if (props.result === false) {
            setCode('')
        } else if (props.result === true) {
            setCode('');
            Toast.show('Konto zostało aktywowane', {duration: Toast.durations.LONG});
            props.resetStatus();
            props.navigation.navigate('loginScreen');
        }
    }, [props.result]);

    return (
        <View style={SimpleFormStyle.container}>
            <OperationErrorMessageBox visible={props.hasError}/>
            <MessageBox visible={props.result === false} message='Wprowadzony kod jest nieprawidłowy' type='warning'/>
            <Input autoFocus={true} onChangeText={setCode} value={code} label='Wprowadź kod aktywacji konta'/>
            <Button
                containerStyle={SimpleFormStyle.buttonContainer}
                title='Kontynuuj'
                disabled={code.trim().length < 1 || props.pending}
                loading={props.pending}
                onPress={() => props.confirmRegistration(code)}
            />
        </View>
    )
};

SignUpConfirmationScreen.navigationOptions = {
    title: 'Potwierdzenie rejestracji'
};

const mapStateToProps = (state: AppState) => {
    return {
        hasError: state.user.registration.confirmationStatus.error !== undefined,
        result: state.user.registration.confirmationStatus.data,
        pending: state.user.registration.confirmationStatus.status === OperationStatus.PENDING
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        confirmRegistration(token: string) {
            dispatch(confirmSignUpAction.started(token))
        },
        resetStatus() {
            dispatch(resetSignUpConfirmationAction())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpConfirmationScreen)
