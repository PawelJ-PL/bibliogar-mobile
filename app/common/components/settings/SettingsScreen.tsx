import React, {useEffect} from "react";
import {SectionList, StyleSheet, Text, View} from "react-native";
import userProfileSection from "../../../domain/user/components/settings/UserProfileSettingsSection";
import {Divider} from "react-native-elements";
import {AppState} from "../../store";
import {OperationStatus} from "../../store/async/AsyncOperationResult";
import {Dispatch} from "redux";
import {refreshUserDataAction} from "../../../domain/user/store/Actions";
import {connect} from "react-redux";
import Toast from "react-native-root-toast";
import Spinner from "react-native-loading-spinner-overlay";
import LibrariesSettingsSection from "../../../domain/library/components/settings/LibrariesSettingsSection";
import {fetchUserLibrariesAction} from "../../../domain/library/store/Actions";
import {StackNavigationProp} from "@react-navigation/stack";
import {SettingsStackParamProps} from "../navigation/panels/SettingsStack";
import {brand} from "../../styles/Colors";

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
    navigation: StackNavigationProp<SettingsStackParamProps, 'categories'>
}

export interface SettingsSection {
    title: string,
    data: Array<{
        component: React.ComponentType,
        key: string
        keyPrefix: string
    }>
}

const sections: SettingsSection[] = [
    {title: 'Dane', data: [{key: 'libraries', keyPrefix: 'data', component: LibrariesSettingsSection}]},
    userProfileSection
];

const renderHeader = (title: string) => (
    <View>
        <Text style={styles.headerText}>{title}</Text>
        <Divider/>
    </View>
);

const SettingsScreen: React.FC<Props> = (props) => {
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

    useEffect(() => {
        if (props.refreshLibrariesStatus === OperationStatus.NOT_STARTED) {
            props.refreshLibraries();
        }
    }, []);

    return (
        <View style={styles.container}>
            <Spinner visible={props.updateUserDataInProgress || props.unregisterDeviceInProgress}/>
            <SectionList
                sections={sections}
                renderItem={(Item) => <Item.item.component/>}
                renderSectionHeader={({section: {title}}) => renderHeader(title)}
                keyExtractor={i => i.keyPrefix + '_' + i.key}
                refreshing={props.refreshInProgress}
                onRefresh={() => {
                    props.refreshUser();
                    props.refreshLibraries()
                }}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerText: {
        padding: 14,
        fontWeight: '700',
        color: brand
    }
});

const mapStateToProps = (state: AppState) => {
    return {
        updateUserDataInProgress: state.user.updateUserDataStatus.status === OperationStatus.PENDING,
        unregisterDeviceInProgress: state.device.unregisterDeviceStatus.status === OperationStatus.PENDING,
        refreshLibrariesStatus: state.libraries.librariesStatus.status,
        refreshInProgress: state.user.refreshUserDataStatus.status === OperationStatus.PENDING || state.libraries.librariesStatus.status === OperationStatus.PENDING,
        refreshError: state.user.refreshUserDataStatus.status === OperationStatus.FAILED || state.libraries.librariesStatus.status === OperationStatus.FAILED,
        updateError: state.user.updateUserDataStatus.status === OperationStatus.FAILED || state.device.unregisterDeviceStatus.status === OperationStatus.FAILED
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        refreshUser() {
            dispatch(refreshUserDataAction.started())
        },
        refreshLibraries() {
            dispatch(fetchUserLibrariesAction.started())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen)
