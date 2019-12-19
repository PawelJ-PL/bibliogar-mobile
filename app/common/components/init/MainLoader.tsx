import React from "react";
import {ActivityIndicator, Image, StyleSheet, View} from "react-native";
import {Text} from "react-native-elements";

import logo from '../../../../resources/logo.png'


const MainLoader: React.FC = () => {
    return(
        <View style={styles.loaderScreen}>
            <Image source={logo} style={styles.logo} resizeMode='cover' />
            <Text h4={true}>Bibliogar</Text>
            <ActivityIndicator />
        </View>
    )
};

const styles = StyleSheet.create({
    loaderScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 100,
        height: 100
    }
});

export default MainLoader
