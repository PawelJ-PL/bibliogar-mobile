import React from "react"
import { Linking, View } from "react-native"
import { ListItem } from "react-native-elements"
import Config from "react-native-config"

const HelpSection: React.FC = () => (
    <View>
        <ListItem
            title={"Polityka prywatności"}
            bottomDivider={true}
            onPress={() => Linking.openURL(Config.PRIVACY_POLICY_URL)}
        />
    </View>
)

export default HelpSection
