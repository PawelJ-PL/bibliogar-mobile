import {createEpic} from "../../../common/store/async/AsyncActionEpicCreator";
import {User} from "../types/User";
import {
    changePasswordAction,
    confirmSignUpAction,
    fetchUserDataAction,
    performLoginAction, refreshUserDataAction,
    registerNewUserAction,
    requestPasswordResetAction, resetPasswordAction, updateUserDataAction
} from "./Actions";
import UsersApi, {UserRegistrationStatus} from "../api/UsersApi";
import {combineEpics, Epic} from "redux-observable";
import {AppState} from "../../../common/store";
import {filter, ignoreElements, map, mergeMap, tap} from "rxjs/operators";
import AsyncStorage from '@react-native-community/async-storage';
import {EMPTY, from, of} from "rxjs";

const USER_DATA_STORAGE_KEY = 'userData';

const loginEpic = createEpic<{ email: string, password: string }, { csrfToken: string, user: User } | null, Error>(performLoginAction, params => UsersApi.login(params.email, params.password));
const fetchUserDataEpic = createEpic<void, User, Error>(fetchUserDataAction, () => UsersApi.getCurrentUser());
const registerNewUserEpic = createEpic<{ email: string, nickName: string, password: string }, UserRegistrationStatus, Error>(registerNewUserAction, params => UsersApi.registerUser(params.email, params.nickName, params.password));
const signUpConfirmationEpic = createEpic<string, boolean, Error>(confirmSignUpAction, params => UsersApi.confirmRegistration(params));
const requestPasswordResetEpic = createEpic<string, void, Error>(requestPasswordResetAction, params => UsersApi.requestPasswordReset(params));
const resetPasswordEpic = createEpic<{ token: string, password: string }, boolean, Error>(resetPasswordAction, params => UsersApi.resetPassword(params.token, params.password));
const refreshUserDataEpic = createEpic<void, User, Error>(refreshUserDataAction, () => UsersApi.getCurrentUser());
const updateUserDataEpic = createEpic<string, User, Error>(updateUserDataAction, params => UsersApi.updateCurrentUsersData(params));
const changePasswordEpic = createEpic<{ oldPassword: string, newPassword: string }, void, Error>(changePasswordAction, params => UsersApi.changePassword(params.oldPassword, params.newPassword));

const updateUserOnRefreshSuccess: Epic<any, any, AppState> = (action$) =>
    action$
        .pipe(
            filter(refreshUserDataAction.done.match),
            map(a => fetchUserDataAction.done(a.payload))
        );

const updateUserDataOnUpdateActionSuccess: Epic<any, any, AppState> = (action$) =>
    action$
        .pipe(
            filter(updateUserDataAction.done.match),
            map(a => fetchUserDataAction.done({params: undefined, result: a.payload.result}))
        );

const saveUserEpic: Epic<any, any, AppState> = action$ =>
    action$.pipe(
        filter(fetchUserDataAction.done.match),
        tap(a => AsyncStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(a.payload.result))),
        ignoreElements()
    );

const fallbackToSavedUserEpic: Epic<any, any, AppState> = action$ => action$
    .pipe(
        filter(fetchUserDataAction.failed.match),
        mergeMap(
            () =>
                from(AsyncStorage.getItem(USER_DATA_STORAGE_KEY)).pipe(
                    mergeMap(result => {
                        if (result) {
                            try {
                                const userData = JSON.parse(result) as User;
                                return of(fetchUserDataAction.done({params: undefined, result: userData}))
                            } catch (e) {
                                return EMPTY
                            }
                        } else {
                            return EMPTY
                        }
                    })
                )
        )
    );

export const usersEpics = combineEpics(loginEpic, fetchUserDataEpic, registerNewUserEpic, signUpConfirmationEpic, requestPasswordResetEpic, resetPasswordEpic, refreshUserDataEpic, updateUserOnRefreshSuccess, updateUserDataEpic, updateUserDataOnUpdateActionSuccess, changePasswordEpic, saveUserEpic, fallbackToSavedUserEpic);
