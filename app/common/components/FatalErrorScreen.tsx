import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Icon, Text as RNEText} from "react-native-elements";

const FatalErrorScreen: React.FC<FatalErrorScreenProps> = (props) => {
    return (
        <View style={styles.view}>
            <View style={styles.header}>
                <Icon name='emoji-sad' type='entypo' size={120}/>
                <RNEText h3={true} h3Style={styles.text}>Wystąpił poważny błąd:</RNEText>
            </View>
            <Text style={styles.text}>{props.message}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    view: {
        paddingTop: 100,
        paddingLeft: 5,
        paddingRight: 5,
        alignItems: 'center'
    },
    header: {
        marginBottom: 5
    },
    text: {
        textAlign: 'center'
    }
});

type FatalErrorScreenProps = {
    message: string
}

export default FatalErrorScreen
