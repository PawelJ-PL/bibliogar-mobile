import React, {useState} from "react";
import {SettingsSection} from "../../../../common/components/settings/SettingsScreen";
import {ListItem} from "react-native-elements";
import {AppState} from "../../../../common/store";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {StyleSheet, View} from "react-native";
import UpdateSingleValueForm from "../../../../common/components/modals/UpdateSingleValueForm";
import {updateUserDataAction} from "../../store/Actions";
import ChangePasswordModal from "./ChangePasswordModal";
import {nicknameMaxLength} from "../registration/RegistrationForm";
import {error, errorDark} from "../../../../common/styles/Colors";
import {unregisterDeviceAction} from "../../../device/store/Actions";


type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

const emailItem: React.FC<Props> = ({email}) => {
    return (
        <ListItem title={email} subtitle='Email' bottomDivider={true} leftIcon={{name: 'email', type: 'entypo'}}/>
    )
};

const nickNameItem: React.FC<Props> = ({nickName, updateUser}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const performAction = (nick: string) => updateUser(nick.trim());

    return (
        <View>
            <UpdateSingleValueForm
                initialValue={nickName || ''}
                onClose={() => setModalVisible(false)}
                onSave={performAction}
                canSubmit={(text: string) => text.trim().length > 0 && text.length <= nicknameMaxLength}
                visible={modalVisible}
                title='Pseudonim'
            />
            <ListItem title={nickName}
                      subtitle='Pseudonim'
                      bottomDivider={true}
                      leftIcon={{name: 'user', type: 'font-awesome'}}
                      rightIcon={{name: 'edit', type: 'font-awesome'}}
                      onPress={() => setModalVisible(true)}
            />
        </View>
    )
};

const passwordItem: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View>
            <ChangePasswordModal visible={modalVisible} onClose={() => setModalVisible(false)}/>
            <ListItem
                title='***'
                subtitle='Hasło'
                bottomDivider={true}
                leftIcon={{name: 'lock', type: 'font-awesome'}}
                rightIcon={{name: 'edit', type: 'font-awesome'}}
                onPress={() => setModalVisible(true)}
            />
        </View>
    )
};

const logoutItem: React.FC<Props> = (props) => {
    return(
        <ListItem
            title='Wyloguj'
            onPress={props.unregisterDevice}
            titleStyle={styles.logoutTitle}
            containerStyle={styles.logoutContainer}
        />
    )
};

const styles = StyleSheet.create({
    logoutTitle: {
        fontSize: 20,
        fontWeight: '700',
        alignSelf: 'center'
    },
    logoutContainer: {
        backgroundColor: error,
        borderWidth: 1,
        borderColor: errorDark
    }
});

const mapStateToProps = (state: AppState) => {
    return {
        email: state.user.userDataStatus.data?.email,
        nickName: state.user.userDataStatus.data?.nickName
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        updateUser(nickname: string) {
            dispatch(updateUserDataAction.started(nickname))
        },
        unregisterDevice() {
            dispatch(unregisterDeviceAction.started())
        }
    }
};

const prefix = 'Profil';

const userProfileSection: SettingsSection = {
    title: 'Profil użytkownika',
    data: [
        {key: 'email', keyPrefix: prefix, component: connect(mapStateToProps, mapDispatchToProps)(emailItem)},
        {key: 'nickName', keyPrefix: prefix, component: connect(mapStateToProps, mapDispatchToProps)(nickNameItem)},
        {key: 'password', keyPrefix: prefix, component: passwordItem},
        {key: 'logout', keyPrefix: prefix, component: connect(mapStateToProps, mapDispatchToProps)(logoutItem)}
    ]
};

export default userProfileSection
