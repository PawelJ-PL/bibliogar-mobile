import {createReducer, defaultInitState} from "../../../common/store/async/AsyncReducerCreator";
import {
    changePasswordAction,
    confirmSignUpAction,
    fetchUserDataAction,
    performLoginAction,
    refreshUserDataAction,
    registerNewUserAction,
    requestPasswordResetAction, resetChangePasswordAction,
    resetPasswordAction,
    resetPasswordResetAction,
    resetRefreshUserDataAction,
    resetRegistrationStatusAction,
    resetRequestPasswordResetAction,
    resetSignUpConfirmationAction, resetUpdateUserDataAction,
    resetUserDataAction, updateUserDataAction
} from "./Actions";
import {combineReducers} from "redux";
import {OperationStatus} from "../../../common/store/async/AsyncOperationResult";

const loginReducer = createReducer(performLoginAction);
const userDataReducer = createReducer(fetchUserDataAction)
    .case(resetUserDataAction, state => ({
        ...state,
        ...defaultInitState
    }))
    .case(performLoginAction.done, (state, action) => {
        if (action.result !== null) {
            return {
                ...state,
                status: OperationStatus.FINISHED,
                data: action.result.user,
                error: undefined,
                params: undefined
            }
        } else {
            return {...state, ...defaultInitState}
        }
    });

const newRegistrationReducer = createReducer(registerNewUserAction).case(resetRegistrationStatusAction, state => ({
    ...state,
    ...defaultInitState
}));

const signUpConfirmationReducer = createReducer(confirmSignUpAction, resetSignUpConfirmationAction);

const requestPasswordResetReducer = createReducer(requestPasswordResetAction, resetRequestPasswordResetAction);

const resetPasswordReducer = createReducer(resetPasswordAction, resetPasswordResetAction);

const refreshUserDataReducer = createReducer(refreshUserDataAction, resetRefreshUserDataAction);

const updateUserDataReducer = createReducer(updateUserDataAction, resetUpdateUserDataAction);

const changePasswordReducer = createReducer(changePasswordAction, resetChangePasswordAction);

const registrationReducer = combineReducers({
    registrationStatus: newRegistrationReducer,
    confirmationStatus: signUpConfirmationReducer,
    requestPasswordResetStatus: requestPasswordResetReducer,
    resetPasswordStatus: resetPasswordReducer
});

export const userReducer = combineReducers({
    loginStatus: loginReducer,
    userDataStatus: userDataReducer,
    updateUserDataStatus: updateUserDataReducer,
    refreshUserDataStatus: refreshUserDataReducer,
    registration: registrationReducer,
    changePasswordStatus: changePasswordReducer
});
