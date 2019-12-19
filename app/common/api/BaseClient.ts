import axios from 'axios';
import Config from "react-native-config";
import PackageJson from '../../../package.json'
import {NotLoggedIn} from "./Errors";

export const onKeyChange = (key?: string | null) => {
    if (key !== client.defaults.headers.common['X-Api-Key']) {
        if (key) {
            client.defaults.headers.common['X-Api-Key'] = key
        } else {
            delete client.defaults.headers.common['X-Api-Key']
        }
    }
};

const client = axios.create();
client.defaults.withCredentials = true;
client.defaults.baseURL = Config.API_URL + '/api/v1';
client.defaults.headers.common['User-Agent'] = 'Bibliogar-Mobile/' + PackageJson.version;

const ENDPOINTS_WITH_ALLOWED_401 = ['/api/v1/auth/login', '/api/v1/users/me/password'];
client.interceptors.response.use(resp => {
    return resp
}, err => {
    if (err.response?.status === 401) {
        const url = (err.response.config || {}).url || '';
        if (ENDPOINTS_WITH_ALLOWED_401.some(endpoint => url.endsWith(endpoint))) {
            return Promise.reject(err)
        } else {
            return Promise.reject(new NotLoggedIn())
        }
    } else {
        return Promise.reject(err)
    }
});

export default client
