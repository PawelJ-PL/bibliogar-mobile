import {createStackNavigator} from "react-navigation-stack";
import LoginScreen from "../../../domain/user/components/login/LoginScreen";
import RegistrationScreen from "../../../domain/user/components/registration/RegistrationScreen";
import SignUpConfirmationScreen from "../../../domain/user/components/registration/SignUpConfirmationScreen";
import PasswordResetRequestScreen from "../../../domain/user/components/password_reset/PasswordResetRequestScreen";
import PasswordResetScreen from "../../../domain/user/components/password_reset/PasswordResetScreen";
import commonNavigationOptions from "../../styles/CommonNavigationOptions";

export default createStackNavigator({
    loginScreen: LoginScreen,
    registrationScreen: RegistrationScreen,
    signUpConfirmationScreen: SignUpConfirmationScreen,
    passwordResetRequestScreen: PasswordResetRequestScreen,
    passwordResetScreen: PasswordResetScreen
}, {
    initialRouteName: 'loginScreen',
    defaultNavigationOptions: commonNavigationOptions
})
