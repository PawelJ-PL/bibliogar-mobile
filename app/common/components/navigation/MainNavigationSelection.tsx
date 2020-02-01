import React, {useEffect} from "react";
import packageJson from "../../../../package.json"
import {Dispatch} from "redux";
import {checkApiCompatibilityAction, loadApiKeyAction} from "../../../domain/device/store/Actions";
import {connect} from "react-redux";
import {AppState} from "../../store";
import MainLoader from "../init/MainLoader";
import {Alert} from "react-native";
import FatalErrorScreen from "../FatalErrorScreen";
import {fetchUserDataAction} from "../../../domain/user/store/Actions";
import {NavigationSwitchScreenProps} from "react-navigation";
import {OperationStatus} from "../../store/async/AsyncOperationResult";
import {NotLoggedIn} from "../../api/Errors";
import Toast from "react-native-root-toast";

type MainNavigationSelectionProps = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & NavigationSwitchScreenProps

const MainNavigationSelection: React.FC<MainNavigationSelectionProps> = (props) => {
    useEffect(() => {
        if (props.isApiCompatible === undefined) {
            props.checkApiCompatibility();
        }
    }, []);

    useEffect(() => {
        if (props.apiCompatibilityError) {
            Alert.alert('Błąd weryfikacji zgodności', 'Nie udało się zweryfikować zgodności API. Aplikacja może działać niestabilnie')
        }
    }, [props.apiCompatibilityError]);

    useEffect(() => {
        if (props.isApiCompatible !== false && props.apiKeyStatus.status === OperationStatus.NOT_STARTED) {
            props.loadLocalApiKey();
        }
    }, [props.isApiCompatible]);

    useEffect(() => {
        if (props.apiKeyStatus.data && props.userDataStatus.status === OperationStatus.NOT_STARTED) {
            props.fetchUserData();
        } else if (props.apiKeyStatus.data === null) {
            props.navigation.navigate('auth')
        }
    }, [props.apiKeyStatus]);

    useEffect(() => {
        if (props.userDataStatus.data) {
            props.navigation.navigate('app')
        }
        if (props.userDataStatus.error && !(props.userDataStatus.error instanceof NotLoggedIn)) {
            Toast.show('Błąd w trakcie pobierania danych użytkownika')
        }
    }, [props.userDataStatus]);

    if (props.isApiCompatible === false) {
        return <FatalErrorScreen message='Obecna wersja aplikacji nie jest wspierana. Konieczna jest aktualizacja'/>
    } else if (props.apiKeyStatus.error) {
        return <FatalErrorScreen message='Nie można odczytać klucza API. Spróbuj ponownie później' />
    } else if (props.userDataStatus.error && !(props.userDataStatus.error instanceof NotLoggedIn)) {
        return <FatalErrorScreen message='Nie można pobrać danych użytkownika' />
    } else {
        return <MainLoader />
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        checkApiCompatibility() {
            dispatch(checkApiCompatibilityAction.started(packageJson.version))
        },
        loadLocalApiKey() {
            dispatch(loadApiKeyAction.started())
        },
        fetchUserData() {
            dispatch(fetchUserDataAction.started())
        }
    }
};

const mapStateToProps = (state: AppState) => {
    return {
        apiCompatibilityError: state.device.compatibilityCheckStatus.error,
        isApiCompatible: state.device.compatibilityCheckStatus.data,
        apiKeyStatus: state.device.loadApiKeyStatus,
        userDataStatus: state.user.userDataStatus
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MainNavigationSelection);

