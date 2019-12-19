import client from "../../../common/api/BaseClient";
import {DeviceDescription} from "../types/DeviceDescription";

export default {
    isBackendCompatible(appVersion: string): Promise<boolean> {
        return client.post('/devices/compatibility', {appVersion})
            .then(() => true)
            .catch(err => {
                if (err.response?.status > 399 && err.response?.status < 500) {
                    return false
                } else {
                    return Promise.reject(err)
                }
            })
    },
    registerDevice(uniqueId: string, deviceDescription: DeviceDescription, csrfToken: string): Promise<string> {
        return client.post<{ deviceId: string, deviceApiKey: string }>('/devices', {uniqueId, deviceDescription}, {headers: {'X-Csrf-Token': csrfToken}})
            .then(resp => resp.data.deviceApiKey)
    },
    unregisterCurrentDevice(): Promise<void> {
        return client.delete('/devices/this')
    }
}
