if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

const defaults = {
    API_URL: 'http://localhost:20099',
    JOB_API_URL: 'http://localhost:20100',
    BASE_URL: window.location.origin,
    BASE_PATH: '/dd'
}
const globals = typeof __CONFIG__ !== 'undefined' ? __CONFIG__ : {}
export default Object.assign(defaults, globals);