

define([

    'underscore',
    'backbone',
    'marionette',
    'l20n',
],
function (

    _,
    Backbone,
    Marionette,
    L20n
) {

    'use strict';

    return Marionette.Behavior.extend({

        onRender: function () {

            document.l10n.localizeNode( this.el );
        },
    });
});
