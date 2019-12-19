import {createAppContainer, createSwitchNavigator} from "react-navigation";
import MainNavigationSelection from "./MainNavigationSelection";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

export default createAppContainer(
    createSwitchNavigator({
        navSelect: MainNavigationSelection,
        app: AppStack,
        auth: AuthStack
    }, {
        initialRouteName: 'navSelect'
    })
)
