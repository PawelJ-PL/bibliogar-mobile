import {PushNotification} from "react-native-push-notification";
import store from '../../common/store'
import {fetchActiveLoansAction} from "../../domain/loan/store/Actions";
import {fetchUserLibrariesAction} from "../../domain/library/store/Actions";

type LoansUpdateMessage = {messageType: 'loansUpdate'}
type LibrariesUpdateMessage = {messageType: 'librariesUpdate'}

const handler = (notification: PushNotification) => {
    const data = notification.data as undefined | LoansUpdateMessage | LibrariesUpdateMessage
    if (data) {
        switch (data.messageType) {
            case "loansUpdate":
                store.dispatch(fetchActiveLoansAction.started())
                break;
            case "librariesUpdate":
                store.dispatch(fetchUserLibrariesAction.started())
                break;
            default:
                break
        }
    }
}

export default handler
