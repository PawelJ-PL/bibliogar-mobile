import React, {useState} from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import {Button, Input} from "react-native-elements";
import IsbnScanner from "./IsbnScanner";
import {IsbnPattern} from "../EditBookForm";
import Toast from "react-native-root-toast";

type Props = {
    scannerEnabled: boolean
    onSubmit: (isbn: string) => void
}

const IsbnForm: React.FC<Props> = ({onSubmit, scannerEnabled}) => {
    const [isbn, setIsbn] = useState('');

    const onTextChange = (text: string) => {
        if ((/^\w*(\d+|X)+$/.test(text) && text.length <= 13) || (text === '')) {
            setIsbn(text)
        }
    };

    const canSubmit = IsbnPattern.test(isbn);

    const onScanned = (data: string) => {
        if (IsbnPattern.test(data)) {
            setIsbn(data);
            onSubmit(data)
        } else {
            Toast.show(`${data} nie jest poprawnym numerem ISBN`, {duration: Toast.durations.LONG})
        }
    };

    return (
        <View style={styles.mainContainer}>
            {scannerEnabled ? <IsbnScanner onScanned={onScanned}/> : <View/>}
            <Input label='ISBN' value={isbn} onChangeText={onTextChange} containerStyle={styles.internalContainer}/>
            <Button title='Szukaj' disabled={!canSubmit} onPress={() => onSubmit(isbn)} containerStyle={styles.internalContainer}/>
        </View>
    )
};

const styles = StyleSheet.create({
    internalContainer: {
        flex: 1
    },
    mainContainer: {
        height: Dimensions.get('window').height * 0.6
    }
});

export default IsbnForm
