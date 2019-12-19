import {createStackNavigator} from "react-navigation-stack";
import SettingsScreen from "../../settings/SettingsScreen";
import commonNavigationOptions from "../../../styles/CommonNavigationOptions";

const settingsStack = createStackNavigator({
    categories: SettingsScreen
}, {
    initialRouteName: 'categories',
    defaultNavigationOptions: commonNavigationOptions
});

export default settingsStack
