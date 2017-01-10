import Global from 'react-global';

if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

const appConfig = Global.get('appConfig');
const defaults = {
    API_URL: appConfig.API_URL,
    JOB_API_URL: appConfig.JOB_API_URL,
    BASE_URL: window.location.origin,
    BASE_PATH: appConfig.BASE_PATH
};

const globals = typeof __CONFIG__ !== 'undefined' ? __CONFIG__ : {};
export default Object.assign(defaults, globals);