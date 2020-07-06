import { Loan } from "./../types/Loan"
import { Action, Success } from "typescript-fsa"
import moment from "moment"
import AsyncStorage from "@react-native-community/async-storage"
import findKey from "lodash/findKey"
import omit from "lodash/omit"
import pickBy from "lodash/pickBy"
import fromPairs from "lodash/fromPairs"
import PushNotification from "react-native-push-notification"
import { brandDark } from "../../../common/styles/Colors"
import { AppState } from "../../../common/store"

const LOAN_NOTIFICATIONS_REPOSITORY_STORAGE_KEY = "loanNotifications"
type LoanNotificationRepositoryEntry = { id: string; version: string; returnTo: number }

export const updateLoanNotificationsOnAction = (action: Action<Success<void, Loan[]>>, appState?: AppState) => {
    AsyncStorage.getItem(LOAN_NOTIFICATIONS_REPOSITORY_STORAGE_KEY).then((maybeNotifications) => {
        const registered: Record<string, LoanNotificationRepositoryEntry> = maybeNotifications
            ? JSON.parse(maybeNotifications)
            : {}
        const newLoans = action.payload.result.filter(
            (loan) =>
                !Object.values(registered)
                    .map((entry) => entry.id)
                    .includes(loan.id)
        )

        const removedLoans = Object.keys(registered).filter(
            (notificationId) => !action.payload.result.map((loan) => loan.id).includes(registered[notificationId].id)
        )

        const changedLoans = action.payload.result.filter((loan) =>
            findKey(registered, (entry) => entry.id === loan.id && entry.version !== loan.version)
        )

        const changedNotificationIds: string[] = flatMap(
            changedLoans.map((loan) => Object.keys(pickBy(registered, (v) => v.id === loan.id)))
        )

        const toRemove = removedLoans.concat(changedNotificationIds)
        toRemove.forEach((notificationId) => PushNotification.cancelLocalNotifications({ id: notificationId }))
        const registeredWithoutRemoved: Record<string, LoanNotificationRepositoryEntry> = omit(registered, toRemove)

        const notificationsForLoan: (l: Loan) => Array<[string, LoanNotificationRepositoryEntry]> = (loan) => {
            const maybeLibraryName = appState?.libraries.librariesStatus.data?.find((l) => l.id === loan.libraryId)
                ?.name
            return [7, 3, 1].map((days) => createNotificationBefore(days, loan, maybeLibraryName))
        }

        const createNotificationBefore = (daysBefore: number, loan: Loan, libraryName?: string) => {
            const notificationId = createNotification(daysBefore, loan.returnTo.unix(), libraryName)
            const entry = {
                id: loan.id,
                returnTo: loan.returnTo.unix(),
                version: loan.version,
            }
            const pair: [string, LoanNotificationRepositoryEntry] = [notificationId, entry]
            return pair
        }

        const newEntries = fromPairs(flatMap(newLoans.concat(changedLoans).map(notificationsForLoan)))

        const updatedRegistry: Record<string, LoanNotificationRepositoryEntry> = Object.assign(
            {},
            registeredWithoutRemoved,
            newEntries
        )
        return AsyncStorage.setItem(LOAN_NOTIFICATIONS_REPOSITORY_STORAGE_KEY, JSON.stringify(updatedRegistry))
    })
}

function flatMap<T>(list: Array<Array<T>>) {
    return ([] as Array<T>).concat(...list)
}

const createNotification = (daysBefore: number, returnTo: number, libraryName?: string | null) => {
    const notificationId = (moment().unix() + Math.floor(Math.random() * 10000)).toString(10)
    const returnToMoment = moment(returnTo * 1000)
    const messageBase = returnToMoment.isAfter(moment()) ? "Zbliża się termin zwrotu." : "Minął termin zwrotu."
    const message = libraryName ? messageBase + " Biblioteka " + libraryName : messageBase
    const daysBeforeEnd = returnToMoment.clone().subtract(daysBefore, "days")
    const date = daysBeforeEnd.isAfter(moment()) ? daysBeforeEnd.toDate() : moment().clone().add(1, "hour").toDate()

    PushNotification.localNotificationSchedule({
        id: notificationId,
        color: brandDark,
        message,
        date,
    })
    return notificationId
}
