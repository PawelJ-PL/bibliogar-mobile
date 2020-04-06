import React from "react";
import {Text, View} from "react-native";
import {Loan} from "../../../domain/loan/types/Loan";
import styles from "./styles";

type Props = {
    loans: Loan[]
}

const BooksNumberView: React.FC<Props> = ({loans}) => {
    return (
        <View>
            <Text style={[styles.text, styles.headerText]}>{loans.map(l => l.books.length).reduce(((prev, current) => prev + current), 0)}</Text>
            <Text style={[styles.text, styles.subheaderText]}>Wypożyczonych książek</Text>
        </View>
    )
};

export default BooksNumberView
