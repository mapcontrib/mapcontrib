
export default function redirectToHttpsIfForced(forceHttps) {
    const protocol = window.location.protocol;
    const url = window.location.href;

    if ( protocol === 'http:' && forceHttps === true ) {
        const newUrl = url.replace(/^http:/, 'https:');
        window.location.replace(newUrl);
        return true;
    }

    return false;
}
