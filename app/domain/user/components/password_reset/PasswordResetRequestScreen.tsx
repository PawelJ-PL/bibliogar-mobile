import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Button, Input} from "react-native-elements";
import {emailPattern} from "../registration/RegistrationForm";
import {AppState} from "../../../../common/store";
import {Dispatch} from "redux";
import {requestPasswordResetAction, resetRequestPasswordResetAction} from "../../store/Actions";
import {connect} from "react-redux";
import OperationErrorMessageBox from "../../../../common/components/messagebox/OperationErrorMessageBox";
import {OperationStatus} from "../../../../common/store/async/AsyncOperationResult";
import Toast from "react-native-root-toast";
import {NavigationScreenComponent} from "react-navigation";
import {NavigationStackScreenProps} from "react-navigation-stack";
import SimpleFormStyle from "./SimpleFormStyle";

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & NavigationStackScreenProps

const PasswordResetRequestScreen: React.FC<Props> & NavigationScreenComponent<{}, {}> = (props) => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (props.status === OperationStatus.FINISHED) {
            Toast.show("Poczekaj na email z kodem resetu hasła", {duration: Toast.durations.LONG});
            setEmail('');
            props.resetStatus();
            props.navigation.navigate('passwordResetScreen')
        }
    }, [props.status]);

    const canSubmit = emailPattern.test(email) || props.status === OperationStatus.PENDING;

    return (
        <View style={SimpleFormStyle.container}>
            <OperationErrorMessageBox visible={props.error !== undefined}/>
            <Input keyboardType='email-address' label='Wprowadź adres email' onChangeText={setEmail} value={email}/>
            <Button
                title='Wyślij'
                containerStyle={SimpleFormStyle.buttonContainer}
                disabled={!canSubmit}
                onPress={() => props.sendRequest(email.trim())}
                loading={props.status === OperationStatus.PENDING}
            />
        </View>
    )
};

PasswordResetRequestScreen.navigationOptions = {
    title: 'Reset hasła'
};

const mapStateToProps = (state: AppState) => {
    return {
        error: state.user.registration.requestPasswordResetStatus.error,
        status: state.user.registration.requestPasswordResetStatus.status
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        sendRequest(email: string) {
            dispatch(requestPasswordResetAction.started(email))
        },
        resetStatus() {
            dispatch(resetRequestPasswordResetAction())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordResetRequestScreen)
