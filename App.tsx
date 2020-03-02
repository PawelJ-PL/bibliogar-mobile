import React from 'react';
import ThemedApp from "./app/common/components/ThemedApp";
import {Provider} from "react-redux";
import store from "./app/common/store"
import 'react-native-gesture-handler'
import { enableScreens } from 'react-native-screens';
import 'moment/locale/pl';

const App = () => {
    enableScreens();
    return (
        <Provider store={store}>
            <ThemedApp/>
        </Provider>
    );
};

export default App;
