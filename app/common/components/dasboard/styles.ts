import {StyleSheet} from "react-native";
import {errorDark, infoDark, warningDark} from "../../styles/Colors";

export default StyleSheet.create({
    text: {
        opacity: 0.4,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    headerText: {
        fontSize: 34,
    },
    subheaderText: {
        fontSize: 22
    },
    textPositive: {
        color: infoDark
    },
    textWaring: {
        color: warningDark
    },
    textNegative: {
        color: errorDark
    }
});
