import React from "react";
import {ListItem, ListItemProps} from "react-native-elements";
import {View} from "react-native";
import {AppState} from "../../../../common/store";
import {connect} from "react-redux";
import { useNavigation } from '@react-navigation/native';

type Props = ReturnType<typeof mapStateToProps>

const LibrariesSettingsSection: React.FC<Props> = ({libraries}) => {
    const navigation = useNavigation();

    const entryExtraProps: ListItemProps = libraries === undefined ? {} : {
        badge: {value: libraries.length},
        onPress: () =>  navigation.navigate('librariesList')
    };

    return(
        <View>
            <ListItem
                title={'Biblioteki'}
                bottomDivider={true}
                leftIcon={{name: 'book', type: 'entypo'}}
                chevron={true}
                {...entryExtraProps}
            />
        </View>
    )
};

const mapStateToProps = (state: AppState) => {
    return {
        libraries: state.libraries.librariesStatus.data
    }
};

export default connect(mapStateToProps)(LibrariesSettingsSection)
