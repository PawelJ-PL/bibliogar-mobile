import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import commonNavigationOptions from "../../../styles/CommonNavigationOptions";
import LoansScreen from "../../../../domain/loan/components/LoansScreen";
import LoanPreviewScreen from "../../../../domain/loan/components/LoanPreviewScreen";
import ModifyLoanScreen from "../../../../domain/loan/components/ModifyLoanScreen";
import {useFocusEffect} from "@react-navigation/native";

export type LoansStackParamsProps = {
    loansScreen: undefined,
    loanPreviewScreen: { loanId: string },
    modifyLoanScreen: { loanId?: string }
}

const Stack = createStackNavigator<LoansStackParamsProps>();

type Props = {
    navigation: any
}

export const LoanStack: React.FC<Props> = ({navigation}) => {
    useFocusEffect(
        React.useCallback(() => {
            return () => navigation.setParams({screen: undefined});
        }, [navigation])
    );

    return (
        <Stack.Navigator initialRouteName='loansScreen' screenOptions={commonNavigationOptions}>
            <Stack.Screen name='loansScreen' component={LoansScreen} options={{title: 'Wypożyczenia'}}/>
            <Stack.Screen name='loanPreviewScreen' component={LoanPreviewScreen} options={{title: 'Wypożyczenia'}}/>
            <Stack.Screen name='modifyLoanScreen' component={ModifyLoanScreen}
                          options={({route}) => ({title: route.params?.loanId ? 'Edycja wypożyczenia' : 'Nowe wypożyczenie'})}/>
        </Stack.Navigator>
    )
};
