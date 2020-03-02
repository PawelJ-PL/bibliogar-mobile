import React, {ComponentType, useState} from "react";

type RequiredProps = { visible: boolean, onClose: () => void }
type Props<T> = T & RequiredProps

export const useModal = <T extends {}>(Modal: ComponentType<Props<T>>, props: T): [JSX.Element, () => void] => {
    const [visible, setVisible] = useState(false);

    return ([
        // tslint:disable-next-line:jsx-key
        <Modal {...props} visible={visible} onClose={() => setVisible(false)}/>,
        () => setVisible(true)
    ])
};
