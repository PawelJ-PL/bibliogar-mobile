import React from "react";
import {StyleSheet, View} from "react-native";
import {RNCamera} from "react-native-camera";
import MessageBox from "../../../../common/components/messagebox/MessageBox";

type Props = {
    onScanned: (isbn: string) => void
}

const IsbnScanner: React.FC<Props> = ({onScanned}) => {
    const notAuthorizedView = <MessageBox visible={true} message='Brak dostępu do kamery. Skaner kodów kresowych niedostępny.' type='warning'/>;

    return (
        <View style={styles.container}>
            <RNCamera
                androidCameraPermissionOptions={{
                    title: 'Uprawnienia do kamery',
                    message: 'Kamera wymagana jest do działania skanera kodów kreskowych',
                    buttonPositive: 'Ok'
                }}
                notAuthorizedView={notAuthorizedView}
                style={styles.preview}
                captureAudio={false}
                type={RNCamera.Constants.Type.back}
                barCodeTypes={[RNCamera.Constants.BarCodeType.ean13]}
                onBarCodeRead={event => onScanned(event.data)}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 3,
        width: '100%'
    },
    preview: {
        height: '40%'
    }
});

export default IsbnScanner
