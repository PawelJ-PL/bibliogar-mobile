import actionCreatorFactory from "typescript-fsa";
import {DeviceDescription} from "../types/DeviceDescription";

const actionCreator = actionCreatorFactory();

export const checkApiCompatibilityAction = actionCreator.async<string, boolean, Error>("CHECK_API_COMPATIBILITY");
export const loadApiKeyAction = actionCreator.async<void, string | null, Error>('LOAD_API_KEY');
export const saveApiKeyAction = actionCreator.async<string, void, Error>("SAVE_API_KEY");
export const registerDeviceAction = actionCreator.async<{uniqueId: string, notificationToken: string | null, deviceDescription: DeviceDescription, csrfToken: string}, string, Error>("REGISTER_DEVICE");
export const resetApiKeyAction = actionCreator.async<void, void, Error>("RESET_API_KEY");
export const unregisterDeviceAction = actionCreator.async<void, void, Error>('UNREGISTER_DEVICE');
export const resetUnregisterDeviceAction = actionCreator('RESET_UNREGISTER_DEVICE');
export const setNotificationTokenAction = actionCreator<string>('SET_NOTIFICATION_TOKEN')
