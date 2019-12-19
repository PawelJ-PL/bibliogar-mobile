import {Dimensions, StyleSheet} from "react-native";

export default StyleSheet.create({
    container: {
        marginTop: Dimensions.get('window').height / 8,
        marginLeft: 30,
        marginRight: 30,
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        margin: 15
    }
});
