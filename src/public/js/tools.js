
import $ from 'jquery';
import _ from 'underscore';


window.jQuery = window.$ = $;
window._ = _;


// Permet de ne pas faire sauter les sauts de ligne des textareas quand on recupere la valeur avec $.val()
// http://api.jquery.com/val/
$.valHooks.textarea = {
    get: function( elem ) {
        return elem.value.replace( /\r?\n/g, "\r\n" );
    }
};


if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}


if (!String.prototype.ucfirst) {
    String.prototype.ucfirst = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}
