import React from "react";
import MessageBox from "./MessageBox";

type OperationErrorMessageBoxProps = {
    visible: boolean
}

const OperationErrorMessageBox: React.FC<OperationErrorMessageBoxProps> = ({visible}) => {
    return (
        <MessageBox visible={visible} message={'Wystąpił błąd w trakcie przetwarzania'} type='error'/>
    )
};

export default OperationErrorMessageBox
