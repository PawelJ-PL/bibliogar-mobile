import React, {useState} from "react";
import Modal from "react-native-modal";
import {View} from "react-native";
import {Button, Card, Input} from "react-native-elements";
import settingsStyles from "./settingsStyles";

type Props = {
    onClose: () => void
    canSubmit: (text: string) => boolean
    onSave: (text: string) => void
    visible: boolean
    title?: string
    initialValue: string
}

const UpdateSingleValueForm: React.FC<Props> = ({visible, onClose, initialValue, title, canSubmit, onSave}) => {
    const [value, setValue] = useState(initialValue);
    const handleSave = () => {
        if (initialValue === value) {
            onClose();
        } else {
            onSave(value);
            onClose()
        }
    };

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
            onModalWillShow={() => setValue(initialValue)}
        >
            <View style={settingsStyles.contentContainer}>
                <Card title={title} containerStyle={settingsStyles.cardContainer} titleStyle={settingsStyles.cardTitle}>
                    <Input
                        inputStyle={settingsStyles.input}
                        inputContainerStyle={settingsStyles.inputContainer}
                        value={value}
                        onChangeText={setValue}
                        autoFocus={true}
                    />
                    <View style={settingsStyles.buttonsView}>
                        <Button
                            title='Anuluj'
                            buttonStyle={{...settingsStyles.button, ...settingsStyles.cancelButton}}
                            titleStyle={settingsStyles.buttonTitle}
                            onPress={onClose}
                        />
                        <Button
                            title='Zapisz'
                            containerStyle={settingsStyles.saveButtonContainer}
                            buttonStyle={settingsStyles.button}
                            titleStyle={settingsStyles.buttonTitle}
                            disabled={!canSubmit(value)}
                            onPress={handleSave}
                        />
                    </View>
                </Card>
            </View>
        </Modal>
    )
};

export default UpdateSingleValueForm
