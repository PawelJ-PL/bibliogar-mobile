import {brand} from "./Colors";
import {StackNavigationOptions} from "@react-navigation/stack";

const commonNavigationOptions: StackNavigationOptions = {
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
