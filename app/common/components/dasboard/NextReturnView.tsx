import React from "react";
import {View, Text} from "react-native";
import {Loan} from "../../../domain/loan/types/Loan";
import moment from "moment";
import styles from "./styles";

type Props = {
    loan: Loan
}

const NextReturnView: React.FC<Props> = ({loan}) => {
    const returnInPast = loan.returnTo.isBefore(moment());

    const textColorClass = () => {
        if (returnInPast) {
            return styles.textNegative
        } else if (loan.returnTo.clone().subtract(3, 'days').isBefore(moment())) {
            return styles.textWaring
        } else {
            return styles.textPositive
        }
    };

    const addMomentSuffix = !returnInPast;

    const subheaderValue = returnInPast ? 'Minął termin wypożyczenia' : 'Do najbliższego zwrotu';

    return (
        <View>
            <Text style={[styles.text, styles.headerText, textColorClass()]}>{loan.returnTo.fromNow(addMomentSuffix)}</Text>
            <Text style={[styles.text, styles.subheaderText, textColorClass()]}>{subheaderValue}</Text>
        </View>
    )
};

export default NextReturnView
