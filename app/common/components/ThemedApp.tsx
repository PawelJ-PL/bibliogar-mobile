import React from "react";
import {ThemeProvider} from "react-native-elements";
import {AppState} from "../store";
import {connect} from "react-redux";
import {brandDark} from "../styles/Colors";
import MainNavigationSelection from "./navigation/MainNavigationSelection";

const Button = {
    buttonStyle: {
        margin: 5,
        backgroundColor: brandDark
    }
};

const theme = {
    Button
};

const ThemedApp: React.FC<ThemedAppProps> = (props) => {
    return (
        <ThemeProvider theme={theme}>

            <MainNavigationSelection key={props.navigationKey} />
        </ThemeProvider>
    )
};

const mapStateToProps = (state: AppState) => {
    return {
        navigationKey: (state.user.userDataStatus.data?.email || '') + (state.device.loadApiKeyStatus.data || '')
    }
};

type ThemedAppProps = ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps)(ThemedApp);
