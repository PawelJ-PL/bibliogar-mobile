import React from "react";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {brand} from "../../styles/Colors";
import {Icon, IconType} from "react-native-elements";
import {StyleSheet, Text} from "react-native";
import {SettingsStack} from "./panels/SettingsStack";
import {NavigationContainer} from "@react-navigation/native";
import {LoanStack} from "./panels/LoansStack";
import {DashboardStack} from "./panels/DashboardStack";

const generateLabel = (label: string) =>
    (props: { focused: boolean, color: string }) => props.focused ?
        <Text style={[styles.labelText, {color: props.color}]}>{label}</Text> :
        null;

const generateIcon = (iconName: string, iconType: IconType) =>
    (props: { focused: boolean, color: string, size: number }) =>
        <Icon name={iconName} type={iconType} color={props.color}/>;

const tabBarOptions = {
    activeBackgroundColor: brand,
    inactiveBackgroundColor: brand,
    activeTintColor: 'white',
    inactiveTintColor: '#360036'
};

const Tab = createBottomTabNavigator();


export const AppPanels = () => (
    <NavigationContainer>
        <Tab.Navigator initialRouteName='hone' tabBarOptions={tabBarOptions}>
            <Tab.Screen
                name='home'
                component={DashboardStack}
                options={{
                    tabBarLabel: generateLabel('Przegląd'),
                    tabBarIcon: generateIcon('desktop-mac-dashboard', 'material-community'),
                    unmountOnBlur: true
                }}
            />
            <Tab.Screen
                name='loans'
                component={LoanStack}
                options={{
                    tabBarLabel: generateLabel('Wypożyczenia'),
                    tabBarIcon: generateIcon('open-book', 'entypo'),
                    unmountOnBlur: true
                }}
            />
            <Tab.Screen
                name='settings'
                component={SettingsStack}
                options={{
                    tabBarLabel: generateLabel('Ustawienia'),
                    tabBarIcon: generateIcon('ios-settings', 'ionicon'),
                    unmountOnBlur: true
                }}
            />
        </Tab.Navigator>
    </NavigationContainer>
);

const styles = StyleSheet.create({
    labelText: {
        textAlign: 'center'
    }
});
