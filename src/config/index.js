
if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

export default Object.assign({
    API_URL: 'http://localhost:20099',
    BASE_URL: window.location.origin,
    BASE_PATH: '/dd'
}, typeof __CONFIG__ !== 'undefined' ? __CONFIG__ : {});