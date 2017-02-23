export function purifyPathSlashes(path) {
    return path.replace(/([^:]\/)\/+/g, "$1");
}

export function dropLastPathComponent (path) {
    return purifyPathSlashes(path.replace(/\/[\w\s%]+\/?$/, ''));
}

export function replaceLastPathComponent (path, pathComponent) {
    return purifyPathSlashes(path.replace(/\/[\w\s%]+\/?$/, '/' + pathComponent));
}

export function appendPathComponent (path, pathComponent) {
    return purifyPathSlashes(path + '/' + pathComponent);
}