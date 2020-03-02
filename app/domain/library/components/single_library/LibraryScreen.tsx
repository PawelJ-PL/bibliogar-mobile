import React, {useEffect} from "react";
import {StyleSheet, View} from "react-native";
import {SettingsStackParamProps} from "../../../../common/components/navigation/panels/SettingsStack";
import {RouteProp} from '@react-navigation/native';
import {Button, Card} from "react-native-elements";
import EditLibraryForm, {LibraryFormValues} from "./EditLibraryForm";
import {AppState} from "../../../../common/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {
    deleteLibraryAction,
    resetDeleteLibraryStatusAction,
    resetUpdateLibraryStatusAction,
    updateLibraryAction
} from "../../store/Actions";
import {OperationStatus} from "../../../../common/store/async/AsyncOperationResult";
import Toast from "react-native-root-toast";
import {errorDark} from "../../../../common/styles/Colors";
import {useModal} from "../../../../common/components/modals/ModalHook";
import Confirmation from "../../../../common/components/modals/Confirmation";
import {StackNavigationProp} from "@react-navigation/stack";
import OperationErrorMessageBox from "../../../../common/components/messagebox/OperationErrorMessageBox";

type Props = {
    route: RouteProp<SettingsStackParamProps, 'singleLibrary'>
    navigation: StackNavigationProp<SettingsStackParamProps, 'singleLibrary'>
} & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const LibraryScreen: React.FC<Props> = ({route, updateLibrary, updateStatus, refreshStatus, version, library, cleanUpdateStatus, deleteLibrary, deleteStatus, cleanDeleteStatus, navigation}) => {
    useEffect(() => {
        if (updateStatus === OperationStatus.FINISHED) {
            Toast.show("Zaktualizowano dane biblioteki")
        } else if (updateStatus === OperationStatus.FAILED) {
            Toast.show("Błąd w trakcie aktualizacji")
        }
    }, [updateStatus]);

    useEffect(() => {
        return () => {
            cleanUpdateStatus();
            cleanDeleteStatus()
        }
    }, []);

    useEffect(() => {
        if (deleteStatus === OperationStatus.FINISHED) {
            cleanDeleteStatus();
            navigation.navigate('librariesList')
        }
    }, [deleteStatus]);

    const [deleteConfirmationModal, showDeleteConfirmationModal] = useModal(Confirmation, {
        content: 'Czy chcesz usunąć bibliotekę ' + (library?.name || route.params.library.name) + '?',
        onConfirm: () => deleteLibrary(route.params.library.id)
    });

    const onSubmit = (values: LibraryFormValues) => {
        updateLibrary(route.params.library.id, values)
    };

    return (
        <View>
            {deleteConfirmationModal}
            <Card title='Szczegóły biblioteki'>
                {<OperationErrorMessageBox visible={deleteStatus === OperationStatus.FAILED}/>}
                <EditLibraryForm
                    initialData={library || route.params.library}
                    submitTitle={'Aktualizuj'}
                    onSubmit={onSubmit}
                    inProgress={updateStatus === OperationStatus.PENDING || refreshStatus === OperationStatus.PENDING}
                    key={version || route.params.library.version}
                />
                <Button
                    title='Usuń'
                    buttonStyle={styles.deleteButton}
                    disabled={deleteStatus === OperationStatus.PENDING}
                    loading={deleteStatus === OperationStatus.PENDING}
                    onPress={() => showDeleteConfirmationModal()}
                />
            </Card>
        </View>
    )
};

const styles = StyleSheet.create({
    deleteButton: {
        backgroundColor: errorDark
    }
});

const mapStateToProps = (state: AppState) => {
    return {
        updateStatus: state.libraries.updateStatus.status,
        refreshStatus: state.libraries.librariesStatus.status,
        version: state.libraries.updateStatus.data?.version,
        library: state.libraries.updateStatus.data,
        deleteStatus: state.libraries.deleteStatus.status
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        updateLibrary(libraryId: string, data: LibraryFormValues) {
            dispatch(updateLibraryAction.started({...data, libraryId}))
        },
        cleanUpdateStatus() {
            dispatch(resetUpdateLibraryStatusAction())
        },
        deleteLibrary(libraryId: string) {
            dispatch(deleteLibraryAction.started(libraryId))
        },
        cleanDeleteStatus() {
            dispatch(resetDeleteLibraryStatusAction())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LibraryScreen)
