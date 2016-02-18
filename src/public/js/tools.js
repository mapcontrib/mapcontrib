

define([

    'jquery',
    'math.format',
],
function (

    $
) {

    'use strict';


    // Pour pouvoir utiliser la librairie Math.format plus facilement
    window.f = Math.format;


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

    return {

    };
});
