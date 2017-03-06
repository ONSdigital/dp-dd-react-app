if (!window.location.origin) {
    const port = (window.location.port ? ':' + window.location.port: '');
    window.location.origin = window.location.protocol + "//" + window.location.hostname + port;
}

const defaults = {
    API_URL: 'http://localhost:20099',
    JOB_API_URL: 'http://localhost:20100',
    BASE_URL: window.location.origin,
    BASE_PATH: '/dd'
};

// if (appConfig) {
//     defaults.API_URL = appConfig.API_URL;
//     defaults.JOB_API_URL = appConfig.JOB_API_URL;
//     defaults.BASE_URL = appConfig.BASE_URL;
//     defaults.BASE_PATH = appConfig.BASE_PATH;
// }
//
// console.log(defaults);
//
// export default defaults;

export default Object.assign(defaults, appConfig || {});
// console.log(Object.assign(defaults, appConfig || {}));