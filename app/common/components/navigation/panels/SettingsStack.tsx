import React from "react";
import SettingsScreen from "../../settings/SettingsScreen";
import commonNavigationOptions from "../../../styles/CommonNavigationOptions";
import LibrariesListView from "../../../../domain/library/components/LibrariesListView";
import {createStackNavigator} from "@react-navigation/stack";
import LibraryScreen from "../../../../domain/library/components/single_library/LibraryScreen";
import {Library} from "../../../../domain/library/types/Library";
import CreateLibraryScreen from "../../../../domain/library/components/CreateLibraryScreen";
import {useFocusEffect} from "@react-navigation/native";

export type SettingsStackParamProps = {
    categories: undefined,
    librariesList: undefined,
    singleLibrary: { library: Library }
    createLibrary: undefined
}

const Stack = createStackNavigator<SettingsStackParamProps>();

type Props = {
    navigation: any
}

export const SettingsStack: React.FC<Props> = ({navigation}) => {
    useFocusEffect(
        React.useCallback(() => {
            return () => navigation.setParams({screen: undefined});
        }, [navigation])
    );

    return (
        <Stack.Navigator initialRouteName='categories' screenOptions={commonNavigationOptions}>
            <Stack.Screen name='categories' component={SettingsScreen} options={{title: 'Ustawienia'}}/>
            <Stack.Screen name='librariesList' component={LibrariesListView} options={{title: 'Biblioteki'}}/>
            <Stack.Screen name='singleLibrary' component={LibraryScreen}
                          options={({route}) => ({title: route.params.library.name})}/>
            <Stack.Screen name='createLibrary' component={CreateLibraryScreen} options={{title: 'Dodaj bibliotekę'}}/>
        </Stack.Navigator>
    )
};
