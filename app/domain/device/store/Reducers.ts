import {createReducer} from "../../../common/store/async/AsyncReducerCreator";
import {
    checkApiCompatibilityAction,
    loadApiKeyAction,
    registerDeviceAction,
    resetApiKeyAction, resetUnregisterDeviceAction,
    saveApiKeyAction, unregisterDeviceAction
} from "./Actions";
import {combineReducers} from "redux";
import {OperationStatus} from "../../../common/store/async/AsyncOperationResult";

const apiCompatibilityReducer = createReducer(checkApiCompatibilityAction);
const loadApiKeyReducer = createReducer(loadApiKeyAction)
    .case(saveApiKeyAction.done, (state, action) => ({
        ...state,
        status: OperationStatus.FINISHED,
        error: undefined,
        data: action.params
    }))
    .case(resetApiKeyAction.done, (state) => ({
        ...state,
        status: OperationStatus.NOT_STARTED,
        error: undefined,
        data: undefined
    }));
const saveApiKeyReducer = createReducer(saveApiKeyAction);
const resetApiKeyReducer = createReducer(resetApiKeyAction);
const registrationReducer = createReducer(registerDeviceAction);
const unregisterReducer = createReducer(unregisterDeviceAction, resetUnregisterDeviceAction);

export const deviceReducer = combineReducers({
    compatibilityCheckStatus: apiCompatibilityReducer,
    loadApiKeyStatus: loadApiKeyReducer,
    saveApiKeyStatus: saveApiKeyReducer,
    resetApiKeyStatus: resetApiKeyReducer,
    registrationStatus: registrationReducer,
    unregisterDeviceStatus: unregisterReducer
});
