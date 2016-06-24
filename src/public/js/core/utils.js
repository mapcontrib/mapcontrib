
export function basename (path) {
    return path.replace(/\\/g,'/').replace(/.*\//, '');
}

export function extensionname (path) {
    return basename(path.replace(/.*\./, ''));
}

export function dirname(path) {
    return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');
}

// From those awesome posts:
// https://gist.github.com/jed/982883
// https://gist.github.com/LeverOne/1308368
export function uuid(a, b) {
    for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b;
}
