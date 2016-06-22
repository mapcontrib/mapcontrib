
export function basename (path) {
    return path.replace(/\\/g,'/').replace(/.*\//, '');
}

export function extensionname (path) {
    return basename(path.replace(/.*\./, ''));
}

export function dirname(path) {
    return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
}
