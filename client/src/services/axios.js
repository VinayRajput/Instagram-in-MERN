import axios from 'axios';
import {
    ACCESS_TOKEN,
    APPLICATION_JSON,
    AUTHORIZATION,
    CACHE_CONTROL,
    CONTENT_TYPE,
    NO_CACHE
} from "../shared/AppConstants";
import * as Utils from "../shared/Utils";

//axios instance only
export const axiosOnly = axios.create()
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials:true,
    timeout:10000,
    validateStatus: status => {
        return (status >=200 && status <=299) || status === 404 || status === 422;
    }
})

let counter = 0;
const statusToRetry = [400, 500, 503];
const retryDelay = 800;
let recentlySucceeded = [];
const maxRetry=2;
const notToRetry = [
    '/resetPassword',
];

const onReject = (error) => {
    const config = error.config;
    if (config) {
        let urlStr = config.url;
        if (urlStr.includes('?')) {
            urlStr = urlStr.split('?')[0];
        }
        if (notToRetry.includes(urlStr)) {
            return Promise.reject(error);
        }
    }

    if (
        config &&
        config.timeStamp &&
        (config.timeStamp + retryDelay > Date.now() ||
            config.timeStamp === Date.now())
    ) {
        return Promise.reject(error);
    }

    if (config) {
        const errorId = error.response?.data
            ? error.response?.data?.errorId
            : undefined;
        config.count = config.count || counter;
        config.retrySuccess = config.retrySuccess || false;
        console.warn(
            `[API FAILED]:${config.url} failed ${config.count} time${
                config.count > 1 ? 's' : ''
            }, ${errorId ? 'ErrorID: ' + errorId : ''} and returning status: ${
                error.response?.status
            }, params:${JSON.stringify(config.params)}`,
        );
    }
    if ((config && counter > maxRetry) || recentlySucceeded.length > 0) {
        setTimeout(() => {
            counter = 0;
        }, 1000);
        return Promise.reject(error);
    }
    if (
        config &&
        counter <= maxRetry &&
        statusToRetry.find((s) => s === error.response?.status)
    ) {
        counter++;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, retryDelay);
        })
            .then(() => {
                config.timeStamp = Date.now();
                return axios({ ...config })
                    .then((res) => {
                        recentlySucceeded.push(res.config.url);
                        setTimeout(() => {
                            counter = 0;
                            recentlySucceeded.length = 0;
                        }, 1100);
                        return res;
                    })
                    .catch((e) => {
                        onReject(e);
                    });
            })
            .catch((e) => {
                if (e.response) {
                    onReject(e);
                }
            });
    } else if (!error.response) {
        return Promise.reject(error);
    }
};

// Logic for session renewal via page refresh
axiosInstance.interceptors.request.use(
    (request) => {
        var now = new Date();
        if (
            now.valueOf() >
            new Date(Utils.getCookieByName('expire_time')).valueOf()
            // && store.getState().user.isLoggedIn
        ) {
            // const { dispatch } = store;
            // dispatch(getNewAccessToken(Utils.getCookieByName('refresh')));
        }
        let req = { ...request };
        if (req.method.toLowerCase() === 'get') {
            req = {
                ...request,
                params: {
                    ...request.params,
                    timestamp: Date.now(),
                },
            };
        }
        return req;
    },
    onReject
);

/*axiosInstance.interceptors.response.use((response) => {
    response.ok = response.status >= 200 && response.status <= 299;
    if (response.status === 404) {
        response.ok = true;
        response.data = [];
    }
    return response;
},onReject);*/

axiosInstance.interceptors.request.use((config) => {
    if(!!config?.headers) {
        config.headers[AUTHORIZATION] = `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        config.headers[CONTENT_TYPE] = APPLICATION_JSON;
        config.headers[CACHE_CONTROL] = NO_CACHE;
        return config;
    }
},onReject);

// Add isCancel method
axiosInstance.isCancel = axios.isCancel;



export const axiosGet = ({ url, params, setter, ref }) => {
    if (!ref.current) {
        ref.current = true;
        axiosInstance
            .get(url.indexOf('http') !== -1 ? url : `${window.env.apiUrl || ''}${url}`, {
                params: params,
            })
            .then((res) => {
                setter({ loading: false, data: res.data, error: null });
            })
            .catch((e) => {
                setter({ loading: false, data: [], error: e });
            });
    }
};
export default axiosInstance;