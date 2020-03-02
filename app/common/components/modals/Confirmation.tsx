import React from "react";
import Modal from "react-native-modal";
import {StyleSheet, Text, View} from "react-native";
import {Button, Card, Divider} from "react-native-elements";
import {errorDark} from "../../styles/Colors";

type Props = {
    visible: boolean
    onClose: () => void
    content: string,
    onConfirm: () => any
}

const Confirmation: React.FC<Props> = ({visible, onClose, content, onConfirm}) => {
    const handleConfirm = () => {
        onClose();
        onConfirm()
    };

    return (
        <Modal isVisible={visible} onBackdropPress={onClose} onBackButtonPress={onClose}>
            <View style={styles.contentContainer}>
                <Card>
                    <Text>{content}</Text>
                    <Divider style={styles.divider}/>
                    <View style={styles.buttonsContainer}>
                        <Button
                            title='Nie'
                            containerStyle={styles.singleButtonContainer}
                            buttonStyle={styles.noButton}
                            onPress={onClose}
                        />
                        <View style={styles.singleButtonContainer} />
                        <Button
                            title='Tak'
                            containerStyle={styles.singleButtonContainer}
                            onPress={handleConfirm}
                        />
                    </View>
                </Card>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        marginTop: 10
    },
    divider: {
        marginVertical: 5
    },
    buttonsContainer: {
        flexDirection: 'row'
    },
    singleButtonContainer: {
        flex: 1
    },
    noButton: {
        backgroundColor: errorDark
    }
});

export default Confirmation
