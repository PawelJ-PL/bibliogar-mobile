import {Dimensions, StyleSheet} from "react-native";
import {errorDark} from "../../styles/Colors";

export default StyleSheet.create({
    contentContainer: {
        flex: 1,
        marginTop: 100
    },
    cardContainer: {
        padding: 10,
        width: Dimensions.get('window').width - 80
    },
    cardTitle: {
        textAlign: 'left'
    },
    input: {
        fontSize: 15
    },
    inputContainer: {
        height: 25
    },
    buttonsView: {
        flexDirection: 'row'
    },
    button: {
        height: 40,
        width: 60
    },
    buttonTitle: {
        fontSize: 12
    },
    saveButtonContainer: {
        marginLeft: 'auto'
    },
    cancelButton: {
        backgroundColor: errorDark
    }
});
