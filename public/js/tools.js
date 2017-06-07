
import $ from 'jquery';
import _ from 'underscore';


window.jQuery = $;
window.$ = $;
window._ = _;


// Don't drop breaklines when using $.val()
// http://api.jquery.com/val/
$.valHooks.textarea = {
    get( elem ) {
        return elem.value.replace( /\r?\n/g, '\r\n' );
    },
};


function trim() {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

function ucfirst() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

if (!String.prototype.trim) {
    /* eslint-disable no-extend-native */
    String.prototype.trim = trim;
    /* eslint-enable */
}

if (!String.prototype.ucfirst) {
    /* eslint-disable no-extend-native */
    String.prototype.ucfirst = ucfirst;
    /* eslint-enable */
}
