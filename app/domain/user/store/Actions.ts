import actionCreatorFactory from "typescript-fsa";
import {User} from "../types/User";
import {UserRegistrationStatus} from "../api/UsersApi";

const actionCreator = actionCreatorFactory();

export const fetchUserDataAction = actionCreator.async<void , User, Error>("FETCH_USER_DATA");
export const resetUserDataAction = actionCreator("RESET_USER_DATA");
export const performLoginAction = actionCreator.async<{email: string, password: string}, {csrfToken: string, user:User} | null, Error>("PERFORM_LOGIN");
export const registerNewUserAction = actionCreator.async<{email: string, nickName: string, password: string}, UserRegistrationStatus, Error>('REGISTER_NEW_USER');
export const resetRegistrationStatusAction = actionCreator('RESET_REGISTRATION_STATUS');
export const confirmSignUpAction = actionCreator.async<string, boolean, Error>('CONFIRM_SIGNUP');
export const resetSignUpConfirmationAction = actionCreator("RESET_SIGNUP_CONFIRMATION_STATUS");
export const requestPasswordResetAction = actionCreator.async<string, void, Error>('REQUEST_PASSWORD_RESET');
export const resetRequestPasswordResetAction = actionCreator('RESET_REQUEST_PASSWORD_RESET');
export const resetPasswordAction = actionCreator.async<{token: string, password: string}, boolean, Error>('RESET_PASSWORD');
export const resetPasswordResetAction = actionCreator("RESET_PASSWORD_RESET");
export const refreshUserDataAction = actionCreator.async<void, User, Error>('REFRESH_USER_DATA');
export const resetRefreshUserDataAction = actionCreator("RESET_REFRESH_USER_DATA");
export const updateUserDataAction = actionCreator.async<string, User, Error>('UPDATE_USER_DATA');
export const resetUpdateUserDataAction = actionCreator('RESET_UPDATE_USER_DATA');
export const changePasswordAction = actionCreator.async<{oldPassword: string, newPassword: string}, void, Error>('CHANGE_PASSWORD');
export const resetChangePasswordAction = actionCreator('RESET_CHANGE_PASSWORD');
