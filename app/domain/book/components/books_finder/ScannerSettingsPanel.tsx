import React from "react";
import {View} from "react-native";
import {Icon} from "react-native-elements";
import {AppState} from "../../../../common/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {torchToggleAction} from "../../../device/store/Actions";

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const ScannerSettingsPanel: React.FC<Props> = ({torchOn, torchToggle}) => {
    const iconName = torchOn ? 'flashlight-off' : 'flashlight'

    return(
        <View>
            <Icon name={iconName} type='material-community' size={32} onPress={torchToggle} />
        </View>
    )
}

const mapStateToProps = (state: AppState) => ({
    torchOn: state.device.torchOn
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    torchToggle() {
        dispatch(torchToggleAction())
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ScannerSettingsPanel)
