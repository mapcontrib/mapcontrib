
export function basename(path) {
    return path.replace(/\\/g, '/').replace(/.*\//, '');
}

export function extensionname(path) {
    return basename(path.replace(/.*\./, ''));
}

export function dirname(path) {
    return path.replace(/\\/g, '/').replace(/\/[^\/]*$/, '');
}

// http://stackoverflow.com/a/18650828
/* eslint-disable */
export function formatBytes(bytes, decimals) {
    if (bytes == 0) return '0 Byte';
    const k = 1024;
    const dm = decimals + 1 || 3;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
/* eslint-enable */

// From those awesome posts:
// https://gist.github.com/jed/982883
// https://gist.github.com/LeverOne/1308368
/* eslint-disable */
export function uuid(a, b) {
    for (b = a = ''; a++ < 36; b += a * 51 & 52 ? (a ^ 15 ? 8 ^ Math.random() * (a ^ 20 ? 16 : 4) : 4).toString(16) : '-');return b;
}
/* eslint-enable */
