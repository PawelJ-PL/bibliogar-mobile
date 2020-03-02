import React, {useEffect} from "react";
import {View} from "react-native";
import EditLibraryForm, {LibraryFormValues} from "./single_library/EditLibraryForm";
import {AppState} from "../../../common/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {createLibraryAction, resetCreateLibraryStatusAction} from "../store/Actions";
import {OperationStatus} from "../../../common/store/async/AsyncOperationResult";
import OperationErrorMessageBox from "../../../common/components/messagebox/OperationErrorMessageBox";
import {StackNavigationProp} from "@react-navigation/stack";
import {SettingsStackParamProps} from "../../../common/components/navigation/panels/SettingsStack";

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
    navigation: StackNavigationProp<SettingsStackParamProps, 'createLibrary'>
}

const CreateLibraryScreen: React.FC<Props> = ({status, createLibrary, cleanupStatus, navigation}) => {
    useEffect(() => {
        cleanupStatus();
        return () => cleanupStatus()
    }, []);

    useEffect(() => {
        if (status === OperationStatus.FINISHED) {
            navigation.goBack()
        }
    }, [status]);

    return (
        <View>
            <OperationErrorMessageBox visible={status === OperationStatus.FAILED} />
            <EditLibraryForm
                submitTitle='Stwórz'
                inProgress={status === OperationStatus.PENDING}
                onSubmit={createLibrary}
            />
        </View>
    )
};

const mapStateToProps = (state: AppState) => {
    return {
        status: state.libraries.createStatus.status
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        createLibrary(data: LibraryFormValues) {
            dispatch(createLibraryAction.started(data))
        },
        cleanupStatus() {
            dispatch(resetCreateLibraryStatusAction())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateLibraryScreen)
