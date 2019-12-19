import React from "react";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {AAA, BBB} from "./TestComponent";
import {brand} from "../../styles/Colors";
import settingsStack from "./panels/SettingsStack";
import {Icon, IconType} from "react-native-elements";
import {StyleSheet, Text} from "react-native";

const generateLabel = (label: string) =>
    (props: {focused: boolean, tintColor?: string}) => props.focused ?
        <Text style={[styles.labelText, {color: props.tintColor}]}>{label}</Text> :
        null;

const generateIcon = (iconName: string, iconType: IconType) =>
    (props: {tintColor?: string}) => <Icon name={iconName} type={iconType} color={props.tintColor}/>;

export default createBottomTabNavigator({
    home: {
        screen: AAA,
        navigationOptions: {
            tabBarLabel: generateLabel('Przegląd'),
            tabBarIcon: generateIcon('desktop-mac-dashboard', 'material-community')
        }
    },
    loans: {
        screen: BBB,
        navigationOptions: {
            tabBarLabel: generateLabel('Wypożyczenia'),
            tabBarIcon: generateIcon('open-book', 'entypo')
        }
    },
    settings: {
        screen: settingsStack,
        navigationOptions: {
            tabBarLabel: generateLabel('Ustawienia'),
            tabBarIcon: generateIcon('ios-settings', 'ionicon')
        }
    }
}, {
    initialRouteName: 'home',
    tabBarOptions: {
        activeBackgroundColor: brand,
        inactiveBackgroundColor: brand,
        activeTintColor: 'white',
        inactiveTintColor: '#360036',
    }
})

const styles = StyleSheet.create({
    labelText: {
        textAlign: 'center'
    }
});
