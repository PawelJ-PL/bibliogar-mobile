import React from "react";
import {ThemeProvider} from "react-native-elements";
import MainNavigation from "./navigation/MainNavigation";
import {AppState} from "../store";
import {connect} from "react-redux";
import {brand} from "../styles/Colors";

const Button = {
    buttonStyle: {
        margin: 5,
        backgroundColor: brand
    }
};

const theme = {
    Button
};

const ThemedApp: React.FC<ThemedAppProps> = (props) => {
    return (
        <ThemeProvider theme={theme}>
            <MainNavigation key={props.navigationKey} />
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
