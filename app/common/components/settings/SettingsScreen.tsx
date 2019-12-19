import React, {useEffect} from "react";
import {SectionList, StyleSheet, Text, View} from "react-native";
import userProfileSection from "../../../domain/user/components/settings/UserProfileSettingsSection";
import {Divider} from "react-native-elements";
import {NavigationScreenComponent} from "react-navigation";
import {AppState} from "../../store";
import {OperationStatus} from "../../store/async/AsyncOperationResult";
import {Dispatch} from "redux";
import {refreshUserDataAction} from "../../../domain/user/store/Actions";
import {connect} from "react-redux";
import Toast from "react-native-root-toast";
import Spinner from "react-native-loading-spinner-overlay";

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export interface SettingsSection {
    title: string,
    data: Array<{
        component: React.ComponentType,
        key: string
        keyPrefix: string
    }>
}

const sections: SettingsSection[] = [userProfileSection];

const renderHeader = (title: string) => (
    <View>
        <Text style={styles.headerText}>{title}</Text>
        <Divider/>
    </View>
);

const SettingsScreen: React.FC<Props> & NavigationScreenComponent<{}, {}> = (props) => {
    useEffect(() => {
        if (props.refreshError) {
            Toast.show('Błąd w trakcie odświeżania ustawień')
        }
    }, [props.refreshError]);

    useEffect(() => {
        if (props.updateError) {
            Toast.show('Błąd w trakcie zmiany ustawień')
        }
    }, [props.updateError]);

    return (
        <View style={styles.container}>
            <Spinner visible={props.updateUserDataInProgress || props.unregisterDeviceInProgress}/>
            <SectionList
                sections={sections}
                renderItem={(Item) => <Item.item.component/>}
                renderSectionHeader={({section: {title}}) => renderHeader(title)}
                keyExtractor={i => i.keyPrefix + '_' + i.key}
                refreshing={props.refreshUserInProgress}
                onRefresh={() => {
                    props.refreshUser()
                }}
            />
        </View>
    )
};

SettingsScreen.navigationOptions = {
    title: 'Ustawienia'
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerText: {
        padding: 14,
        fontWeight: '700'
    }
});

const mapStateToProps = (state: AppState) => {
    return {
        refreshUserInProgress: state.user.refreshUserDataStatus.status === OperationStatus.PENDING,
        updateUserDataInProgress: state.user.updateUserDataStatus.status === OperationStatus.PENDING,
        unregisterDeviceInProgress: state.device.unregisterDeviceStatus.status === OperationStatus.PENDING,
        refreshError: state.user.refreshUserDataStatus.status === OperationStatus.FAILED,
        updateError: state.user.updateUserDataStatus.status === OperationStatus.FAILED || state.device.unregisterDeviceStatus.status === OperationStatus.FAILED
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        refreshUser() {
            dispatch(refreshUserDataAction.started())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
