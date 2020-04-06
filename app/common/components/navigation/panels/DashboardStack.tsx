import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import commonNavigationOptions from "../../../styles/CommonNavigationOptions";
import DashboardScreen from "../../dasboard/DashboardScreen";

export type DashboardStackParamsProps = {
    mainDashboard: undefined
}

const Stack = createStackNavigator<DashboardStackParamsProps>();

export const DashboardStack = () => (
    <Stack.Navigator initialRouteName='mainDashboard' screenOptions={commonNavigationOptions}>
        <Stack.Screen name='mainDashboard' component={DashboardScreen} options={{headerShown: false}} />
    </Stack.Navigator>
);
