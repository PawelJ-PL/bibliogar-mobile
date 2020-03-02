import React, {useEffect, useState} from "react";
import {StyleSheet, View} from "react-native";
import {Button, Input} from "react-native-elements";
import {useFormik} from "formik";
import * as yup from "yup";
import {AppState} from "../../../../common/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {registerNewUserAction, resetRegistrationStatusAction} from "../../store/Actions";
import MessageBox from "../../../../common/components/messagebox/MessageBox";
import {OperationStatus} from "../../../../common/store/async/AsyncOperationResult";
import {UserRegistrationStatus} from "../../api/UsersApi";
import OperationErrorMessageBox from "../../../../common/components/messagebox/OperationErrorMessageBox";
import Toast from "react-native-root-toast";
import { useNavigation } from '@react-navigation/native';
import PasswordInput from "../../../../common/components/inputs/PasswordInput";

export const emailPattern = /^\S+@\S+$/;
export const emailMaxLength = 320;
export const nicknameMaxLength = 30;
export const passwordMinLength = 12;

const formSchema = yup.object().shape({
    email: yup.string()
        .trim()
        .required('Pole wymagane')
        .max(emailMaxLength, 'Maksymalnie ${max} znaków')
        .matches(emailPattern, 'Niepoprawny format adresu email'),
    nickName: yup.string()
        .trim()
        .required('Pole wymagane')
        .max(nicknameMaxLength, 'Maksymalnie ${max} znaków'),
    password: yup.string()
        .trim()
        .required('Wymagane')
        .min(passwordMinLength, 'Minimum ${min} znaków')
});

type FormValues = {
    email: string,
    nickName: string,
    password: string
}

const initialValues: FormValues = {
    email: '',
    nickName: '',
    password: ''
};

type RegistrationFormProps =
    ReturnType<typeof mapStateToProps>
    & ReturnType<typeof mapDispatchToProps>

const RegistrationForm: React.FC<RegistrationFormProps> = (props) => {
    const [registrationWarning, setRegistrationWarning] = useState<string | null>(null);

    const navigation = useNavigation();

    useEffect(() => {
        return () => {
            props.resetRegistrationStatus();
        }
    }, []);

    useEffect(() => {
        if (props.registrationResult === undefined) {
            return
        } else {
            switch (props.registrationResult) {
                case UserRegistrationStatus.Conflict:
                    setRegistrationWarning('Użytkownik o podanym adresie już istnieje');
                    formik.setFieldValue('email', '');
                    break;
                case UserRegistrationStatus.InvalidData:
                    setRegistrationWarning('Wprowadzono nieprawidłowe dane');
                    break;
                case UserRegistrationStatus.Ok:
                    Toast.show('Poczekaj na email z kodem aktywacyjnym', {duration: Toast.durations.LONG});
                    setRegistrationWarning(null);
                    navigation.navigate('signUpConfirmationScreen');
                    break;
                default:
                    setRegistrationWarning(null);
                    break
            }
        }
    }, [props.registrationResult]);

    const onSubmit = (values: FormValues) => {
        props.registerUser(values)
    };

    const formik = useFormik<FormValues>({initialValues, onSubmit, validationSchema: formSchema});
    const inProgress = formik.isValidating || props.inProgress;

    return (
        <View>
            <OperationErrorMessageBox visible={props.registrationError !== undefined}/>
            <MessageBox
                visible={props.registrationError !== undefined}
                message={'Wystąpił błąd w trakcie przetwarzania'}
                type='error'
            />
            <MessageBox
                visible={registrationWarning !== null}
                message={registrationWarning || ''}
                type='warning'
            />
            <Input
                containerStyle={styles.inputContainer}
                placeholder='e-mail'
                keyboardType='email-address'
                label='Adres email'
                onChangeText={formik.handleChange('email') as (text: string) => void}
                onBlur={formik.handleBlur('email') as (event: any) => void}
                value={formik.values.email}
                errorMessage={(formik.touched.email && formik.errors.email) || undefined}
            />
            <Input
                containerStyle={styles.inputContainer}
                placeholder='pseudonim'
                label='Pseudonim'
                onChangeText={formik.handleChange('nickName') as (text: string) => void}
                onBlur={formik.handleBlur('nickName') as (event: any) => void}
                value={formik.values.nickName}
                errorMessage={(formik.touched.nickName && formik.errors.nickName) || undefined}
            />
            <PasswordInput
                onChangeText={formik.handleChange('password') as (text: string) => void}
                onBlur={formik.handleBlur('password') as (event: any) => void}
                value={formik.values.password}
                containerStyle={styles.inputContainer}
                errorMessage={(formik.touched.password && formik.errors.password) || undefined}
            />
            <Button
                title='Załóż konto'
                onPress={formik.handleSubmit}
                loading={inProgress}
                disabled={inProgress}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20
    }
});

const mapStateToProps = (state: AppState) => {
    return {
        registrationError: state.user.registration.registrationStatus.error,
        inProgress: state.user.registration.registrationStatus.status === OperationStatus.PENDING,
        registrationResult: state.user.registration.registrationStatus.data
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        registerUser(userData: FormValues) {
            dispatch(registerNewUserAction.started(userData))
        },
        resetRegistrationStatus() {
            dispatch(resetRegistrationStatusAction())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm)
