import React from "react";
import {TouchableOpacity} from "react-native";

type Props = {
    onPress: (() => void) | undefined
}

const DashboardSection: React.FC<Props> = ({onPress, children}) => (
    <TouchableOpacity onPress={onPress ? onPress : () => void 0} disabled={onPress === undefined}>
        {children}
    </TouchableOpacity>
);

export default DashboardSection
