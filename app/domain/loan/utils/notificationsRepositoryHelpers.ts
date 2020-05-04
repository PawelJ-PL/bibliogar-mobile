import {Action, Success} from "typescript-fsa";
import {Loan} from "../types/Loan";
import moment from "moment";
import AsyncStorage from "@react-native-community/async-storage";
import findKey from "lodash/findKey";
import omit from "lodash/omit";
import fromPairs from "lodash/fromPairs";
import PushNotification from "react-native-push-notification";
import {brandDark} from "../../../common/styles/Colors";

const LOAN_NOTIFICATIONS_REPOSITORY_STORAGE_KEY = 'loanNotifications'
type LoanNotificationRepositoryEntry = { id: string, version: string, returnTo: number }

export const updateLoanNotificationsOnAction = (action: Action<Success<void, Loan[]>>) => {
    AsyncStorage.getItem(LOAN_NOTIFICATIONS_REPOSITORY_STORAGE_KEY).then(maybeNotifications => {
        const registered: Record<string, LoanNotificationRepositoryEntry> = maybeNotifications ? JSON.parse(maybeNotifications) : {}
        const newLoans = action.payload.result.filter(loan => !Object.values(registered).map(entry => entry.id).includes(loan.id))
        const removedLoans = Object.keys(registered).filter(notificationId => !action.payload.result.map(loan => loan.id).includes(registered[notificationId].id))
        const changedLoans = action.payload.result.filter(loan => findKey(registered, entry => entry.id === loan.id && entry.version !== loan.version))

        const changedNotificationIds = changedLoans
            .map(loan => findKey(registered, entry => entry.id === loan.id))
            .filter((id): id is string => id !== undefined)

        const toRemove = removedLoans.concat(changedNotificationIds)
        toRemove.forEach(notificationId => PushNotification.cancelLocalNotifications({id: notificationId}))
        const registeredWithoutRemoved: Record<string, LoanNotificationRepositoryEntry> = omit(registered, toRemove)

        const newEntries = fromPairs(newLoans.concat(changedLoans)
            .map(loan => ({id: loan.id, returnTo: loan.returnTo.unix(), version: loan.version}))
            .map(entry => [createNotification(entry.returnTo), entry]))

        const updatedRegistry: Record<string, LoanNotificationRepositoryEntry> = Object.assign({}, registeredWithoutRemoved, newEntries)
        return AsyncStorage.setItem(LOAN_NOTIFICATIONS_REPOSITORY_STORAGE_KEY, JSON.stringify(updatedRegistry))
    })
}

const createNotification = (returnTo: number) => {
    const notificationId = (moment().unix() + Math.floor(Math.random() * 10000)).toString(10)
    const returnToMoment = moment(returnTo * 1000)
    const message = returnToMoment.isAfter(moment()) ? 'Zbliża się termin zwrotu' : 'Minął termin zwrotu'
    const threeDaysBeforeEnd = returnToMoment.clone().subtract(3, 'days')
    const date = threeDaysBeforeEnd.isAfter(moment()) ? threeDaysBeforeEnd.toDate() : moment().clone().add(1, 'hour').toDate()
    PushNotification.localNotificationSchedule({
        id: notificationId,
        color: brandDark,
        message,
        date
    })
    return notificationId
}
