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

export default Object.assign(defaults, appConfig || {});