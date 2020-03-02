import React from "react";
import {StyleSheet, View} from "react-native";
import {Button, Icon, Text} from "react-native-elements";
import {useNavigation} from "@react-navigation/native";

const NoLibraryView: React.FC = () => {
    const navigation = useNavigation();

    return (
        <View>
            <View style={styles.container}>
                <Icon name='book' type='entypo' size={75} />
                <Text h4={true}>Nie stworzono biblioteki</Text>
                <Button title='Dodaj bibliotekę' onPress={() => navigation.navigate('settings', {screen: 'createLibrary'})} />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        alignItems: 'center'
    }
});

export default NoLibraryView
