import {brand} from "./Colors";
import {NavigationStackOptions} from "react-navigation-stack";

const commonNavigationOptions: NavigationStackOptions = {
    headerStyle: {
        backgroundColor: brand,
    },
    headerTitleStyle: {
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10
    },
    headerTintColor: 'white'
};

export default commonNavigationOptions
