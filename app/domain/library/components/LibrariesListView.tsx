import React from "react";
import {FlatList, StyleSheet, View, Text} from "react-native";
import {AppState} from "../../../common/store";
import {connect} from "react-redux";
import {Library} from "../types/Library";
import {Button, Divider, ListItem} from "react-native-elements";
import {Dispatch} from "redux";
import {fetchUserLibrariesAction} from "../store/Actions";
import {OperationStatus} from "../../../common/store/async/AsyncOperationResult";
import {SettingsStackParamProps} from "../../../common/components/navigation/panels/SettingsStack";
import {StackNavigationProp} from "@react-navigation/stack";
import {brand} from "../../../common/styles/Colors";

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & {
    navigation: StackNavigationProp<SettingsStackParamProps, 'librariesList'>
}

const LibrariesListView: React.FC<Props> = ({libraries, refresh, loading, navigation}) => {
    const libraryAsElement = (data: {item: Library}) =>
        <ListItem title={data.item.name} bottomDivider={true} chevron={true} onPress={() => navigation.navigate('singleLibrary', {library: data.item})} />;

    const renderHeader = (
        <View>
            <Text style={styles.listHeader}>Moje biblioteki</Text>
            <Divider />
        </View>
    );

    const renderFooter = (
        <View>
            <Button title='Dodaj' onPress={() => navigation.navigate('createLibrary')} />
        </View>
    );

    return (
        <View>
            <FlatList
                ListHeaderComponent={renderHeader}
                ListHeaderComponentStyle={{backgroundColor: 'white'}}
                ListFooterComponent={renderFooter}
                data={libraries}
                renderItem={libraryAsElement}
                keyExtractor={i => i.id}
                onRefresh={refresh}
                refreshing={loading}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    listHeader: {
        padding: 15,
        color: brand,
        fontWeight: 'bold'
    }
});

const mapStateToProps = (state: AppState) => {
    return {
        libraries: state.libraries.librariesStatus.data || [],
        loading: state.libraries.librariesStatus.status === OperationStatus.PENDING
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        refresh() {
            dispatch(fetchUserLibrariesAction.started())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LibrariesListView)
