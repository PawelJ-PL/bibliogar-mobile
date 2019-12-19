import client from "../../../common/api/BaseClient";
import {User} from "../types/User";
import {Forbidden, InvalidCredentials} from "../../../common/api/Errors";

export enum UserRegistrationStatus {
    Ok = 'Ok',
    Conflict = 'Conflict',
    InvalidData = 'InvalidData'
}

export default {
    login(email: string, password: string): Promise<{ csrfToken: string, user: User } | null> {
        return client.post<User>('/auth/login', {email, password})
            .then(resp => ({
                csrfToken: resp.headers['x-csrf-token'] || '',
                user: resp.data
            }))
            .catch(err => {
                if (err.response?.status === 401) {
                    return null
                } else {
                    return Promise.reject(err)
                }
            })
    },
    getCurrentUser(): Promise<User> {
        return client.get<User>('/users/me/data')
            .then(resp => resp.data)
    },
    checkSession(): Promise<{ isValid: boolean }> {
        return client.get<{ isValid: boolean }>('/users/me/session')
            .then(resp => resp.data)
    },
    registerUser(email: string, nickName: string, password: string): Promise<UserRegistrationStatus> {
        return client.post('/users', {email, nickName, password})
            .then(() => UserRegistrationStatus.Ok)
            .catch(err => {
                switch (err.response?.status) {
                    case 400:
                        return UserRegistrationStatus.InvalidData;
                    case 409:
                        return UserRegistrationStatus.Conflict;
                    default:
                        return Promise.reject(err)
                }
            })
    },
    confirmRegistration(token: string): Promise<boolean> {
        return client.get(`/registrations/${token}`)
            .then(() => true)
            .catch(err => err.response?.status === 404 ? false : Promise.reject(err))
    },
    requestPasswordReset(email: string): Promise<void> {
        return client.get(`/passwords/${email}`)
            .then(() => void 0)
    },
    resetPassword(token: string, password: string): Promise<boolean> {
        return client.post(`/passwords/${token}`, {password})
            .then(() => true)
            .catch(err => err.response?.status === 404 ? false : Promise.reject(err))
    },
    updateCurrentUsersData(nickName: string): Promise<User> {
        return client.put<User>('/users/me/data', {nickName})
            .then(resp => resp.data)
    },
    changePassword(oldPassword: string, newPassword: string): Promise<void> {
        return client.post('/users/me/password', {oldPassword, newPassword})
            .then(() => void 0)
            .catch(err => {
                if (err.response?.status === 401) {
                    return Promise.reject(new InvalidCredentials())
                } else if (err.response?.status === 403) {
                    return Promise.reject(new Forbidden("Zmiana hasła niedozwolona"))
                } else {
                    return Promise.reject(err)
                }
            })
    }
}
