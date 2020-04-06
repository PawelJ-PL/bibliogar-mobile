import React from "react";
import {Text, View} from "react-native";
import {Loan} from "../../../domain/loan/types/Loan";
import styles from "./styles";

type Props = {
    loans: Loan[]
}

const OutdatedLoansView: React.FC<Props> = ({loans}) => {
    const textColor = loans.length > 0 ? styles.textNegative : styles.textPositive;

    return(
        <View>
            <Text style={[styles.text, styles.headerText, textColor]}>{loans.length}</Text>
            <Text style={[styles.text, styles.subheaderText, textColor]}>Wypożyczeń po terminie</Text>
        </View>
    )
};

export default OutdatedLoansView
