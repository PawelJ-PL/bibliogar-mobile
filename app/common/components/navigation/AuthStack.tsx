import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from "../../../domain/user/components/login/LoginScreen";
import RegistrationScreen from "../../../domain/user/components/registration/RegistrationScreen";
import SignUpConfirmationScreen from "../../../domain/user/components/registration/SignUpConfirmationScreen";
import PasswordResetRequestScreen from "../../../domain/user/components/password_reset/PasswordResetRequestScreen";
import PasswordResetScreen from "../../../domain/user/components/password_reset/PasswordResetScreen";
import commonNavigationOptions from "../../styles/CommonNavigationOptions";
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";

export type AuthStackParamProps = {
    loginScreen: undefined,
    registrationScreen: undefined,
    signUpConfirmationScreen: undefined,
    passwordResetRequestScreen: undefined,
    passwordResetScreen: undefined
}

const Stack = createStackNavigator<AuthStackParamProps>();

export const AuthStack = () => (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='loginScreen' screenOptions={commonNavigationOptions}>
            <Stack.Screen name='loginScreen' component={LoginScreen} options={{headerShown: false}}/>
            <Stack.Screen name='registrationScreen' component={RegistrationScreen} options={{title: 'Rejestracja'}}/>
            <Stack.Screen name='signUpConfirmationScreen' component={SignUpConfirmationScreen} options={{title: 'Potwierdzenie rejestracji'}}/>
            <Stack.Screen name='passwordResetRequestScreen' component={PasswordResetRequestScreen} options={{title: 'Reset hasła'}}/>
            <Stack.Screen name='passwordResetScreen' component={PasswordResetScreen} options={{title: 'Reset hasła'}}/>
        </Stack.Navigator>
    </NavigationContainer>
);
