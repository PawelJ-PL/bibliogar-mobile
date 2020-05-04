import {
    checkApiCompatibilityAction,
    loadApiKeyAction,
    registerDeviceAction,
    resetApiKeyAction, resetUnregisterDeviceAction,
    saveApiKeyAction, unregisterDeviceAction
} from "./Actions";
import DevicesApi from "../api/DevicesApi";
import {createEpic} from "../../../common/store/async/AsyncActionEpicCreator";
import {DeviceDescription} from "../types/DeviceDescription";
import {combineEpics, Epic} from "redux-observable";
import {AppState} from "../../../common/store";
import {filter, ignoreElements, map, mergeMap, tap} from "rxjs/operators";
import {fetchUserDataAction, performLoginAction} from "../../user/store/Actions";
import {getBrand, getDeviceId, getDeviceName, getUniqueId} from "react-native-device-info";
import {from} from "rxjs";
import AsyncStorage from '@react-native-community/async-storage';
import PushNotification from "react-native-push-notification";

const API_TOKEN_STORAGE_KEY = 'apiToken';

const checkApiCompatibilityEpic = createEpic<string, boolean, Error>(checkApiCompatibilityAction, params => DevicesApi.isBackendCompatible(params));
const loadApiKeyEpic = createEpic<void, string | null, Error>(loadApiKeyAction, () => AsyncStorage.getItem(API_TOKEN_STORAGE_KEY));
const saveKeyOnRegistrationEpic: Epic<any, any, AppState> = (action$, _) =>
    action$
        .pipe(
            filter(registerDeviceAction.done.match),
            filter(a => Boolean(a.payload.result)),
            map(a => {
                return saveApiKeyAction.started(a.payload.result)
            })
        );

const deviceData = getDeviceName().then(name => ({
    uniqueId: getUniqueId(),
    deviceDescription: {
        brand: getBrand(),
        deviceId: getDeviceId(),
        deviceName: name
    }
}));
const registerOnLoginSuccessEpic: Epic<any, any, AppState> = (action$, state$) =>
    action$
        .pipe(
            filter(performLoginAction.done.match),
            filter(a => Boolean(a.payload.result)),
            mergeMap(a =>
                from(deviceData).pipe(
                    map(data => registerDeviceAction.started({
                        uniqueId: data.uniqueId,
                        notificationToken: state$.value.device.notificationToken,
                        deviceDescription: data.deviceDescription,
                        csrfToken: a.payload?.result?.csrfToken || ''
                    }))
                )
            )
        );

const fetchUserDataOnUnregisterSuccessEpic: Epic<any, any, AppState> = action$ =>
    action$
        .pipe(
            filter(unregisterDeviceAction.done.match),
            map(() => fetchUserDataAction.started())
        );

const resetUnregisterStatusOnTokenRemove: Epic<any, any, AppState> = action$ =>
    action$
        .pipe(
            filter(resetApiKeyAction.done.match),
            map(() => resetUnregisterDeviceAction())
        );

const clearLocalStorageOnUnregisterEpic: Epic<any, any, AppState> = action$ => action$
    .pipe(
        filter(unregisterDeviceAction.done.match),
        tap(() => AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys))),
        ignoreElements()
    );

const removeNotificationsOnUnregisterEpic: Epic<any, any, AppState> = action$ => action$
    .pipe(
        filter(unregisterDeviceAction.done.match),
        tap(() => {
            PushNotification.cancelAllLocalNotifications()
            PushNotification.abandonPermissions()
            PushNotification.unregister()
        }),
        ignoreElements()
    )

const saveApiKeyEpic = createEpic<string, void, Error>(saveApiKeyAction, params => AsyncStorage.setItem(API_TOKEN_STORAGE_KEY, params));
const resetApiKeyEpic = createEpic<void, void, Error>(resetApiKeyAction, () => AsyncStorage.removeItem(API_TOKEN_STORAGE_KEY));
const registerDeviceEpic = createEpic<{ uniqueId: string, notificationToken: string | null, deviceDescription: DeviceDescription, csrfToken: string }, string, Error>(registerDeviceAction, params => DevicesApi.registerDevice(params.uniqueId, params.notificationToken, params.deviceDescription, params.csrfToken));
const unregisterDeviceEpic = createEpic<void, void, Error>(unregisterDeviceAction, () => DevicesApi.unregisterCurrentDevice());

export const devicesEpics = combineEpics(checkApiCompatibilityEpic, loadApiKeyEpic, saveKeyOnRegistrationEpic, registerOnLoginSuccessEpic, saveApiKeyEpic, resetApiKeyEpic, registerDeviceEpic, unregisterDeviceEpic, clearLocalStorageOnUnregisterEpic, fetchUserDataOnUnregisterSuccessEpic, resetUnregisterStatusOnTokenRemove, removeNotificationsOnUnregisterEpic);
