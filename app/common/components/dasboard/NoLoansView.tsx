import React from "react";
import {Icon, Text} from "react-native-elements";
import {StyleSheet, View} from "react-native";

const NoLoansView: React.FC = () => (
    <View style={styles.noDataContainer}>
        <Icon name='meh-o' type='font-awesome' iconStyle={styles.noDataText}/>
        <Text h4={true} h4Style={styles.noDataText}>Brak wypożyczeń</Text>
    </View>
);

const styles = StyleSheet.create({
    noDataText: {
        fontSize: 28,
        opacity: 0.2,
        alignSelf: 'center',
        marginHorizontal: 3
    },
    noDataContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});


export default NoLoansView
