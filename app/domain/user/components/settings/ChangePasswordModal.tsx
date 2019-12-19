import React, {useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import Modal from 'react-native-modal'
import settingsStyles from "../../../../common/components/modals/settingsStyles";
import {Button, Card} from "react-native-elements";
import PasswordInput from "../../../../common/components/inputs/PasswordInput";
import {passwordMinLength} from "../registration/RegistrationForm";
import {AppState} from "../../../../common/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {changePasswordAction, resetChangePasswordAction} from "../../store/Actions";
import {OperationStatus} from "../../../../common/store/async/AsyncOperationResult";
import MessageBox from "../../../../common/components/messagebox/MessageBox";
import {Forbidden, InvalidCredentials} from "../../../../common/api/Errors";
import Toast from "react-native-root-toast";

type Props = {
    visible: boolean
    onClose: () => void
} & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const ChangePasswordModal: React.FC<Props> = ({visible, onClose, changePassword, inProgress, error, resetStatus, success}) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (success) {
            resetStatus();
            Toast.show('Hasło zostało zmienione');
            onClose();
        }
    }, [success]);

    const canSubmit = () =>
        oldPassword.trim().length >= passwordMinLength &&
        newPassword.trim().length >= passwordMinLength &&
        oldPassword.trim() !== newPassword.trim() &&
        !inProgress;

    return (
        <Modal
            isVisible={visible}
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
            onModalHide={resetStatus}
            onModalWillShow={() => {
                setOldPassword('');
                setNewPassword('')
            }}
        >
            <View style={settingsStyles.contentContainer}>
                <Card
                    title='Zmiana hasła'
                    containerStyle={settingsStyles.cardContainer}
                    titleStyle={settingsStyles.cardTitle}
                >
                    <MessageBox
                        visible={error instanceof InvalidCredentials}
                        message='Wprowadzone hasło jest nieprawidłowe'
                        type='warning'
                    />
                    <MessageBox
                        visible={error instanceof Forbidden}
                        message='Zminana hasła niedozwolona'
                        type='warning'
                    />
                    <PasswordInput
                        onChangeText={setOldPassword}
                        value={oldPassword}
                        label={'Obecne hasło'}
                        inputStyle={settingsStyles.input}
                        inputContainerStyle={{...settingsStyles.inputContainer, ...styles.inputContainer}}
                    />
                    <PasswordInput
                        onChangeText={setNewPassword}
                        value={newPassword}
                        label={'Nowe hasło'}
                        inputStyle={settingsStyles.input}
                        inputContainerStyle={{...settingsStyles.inputContainer, ...styles.inputContainer}}
                    />
                    <View style={settingsStyles.buttonsView}>
                        <Button
                            title='Anuluj'
                            buttonStyle={{...settingsStyles.button, ...settingsStyles.cancelButton}}
                            titleStyle={settingsStyles.buttonTitle}
                            onPress={onClose}
                        />
                        <Button
                            title='Zmień'
                            containerStyle={settingsStyles.saveButtonContainer}
                            buttonStyle={settingsStyles.button}
                            titleStyle={settingsStyles.buttonTitle}
                            disabled={!canSubmit()}
                            onPress={() => changePassword(oldPassword.trim(), newPassword.trim())}
                            loading={inProgress}
                        />
                    </View>
                </Card>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20
    }
});

const mapStateToProps = (state: AppState) => {
    return {
        inProgress: state.user.changePasswordStatus.status === OperationStatus.PENDING,
        error: state.user.changePasswordStatus.error,
        success: state.user.changePasswordStatus.status === OperationStatus.FINISHED
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        changePassword(oldPassword: string, newPassword: string) {
            dispatch(changePasswordAction.started({oldPassword, newPassword}))
        },
        resetStatus() {
            dispatch(resetChangePasswordAction())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordModal)
