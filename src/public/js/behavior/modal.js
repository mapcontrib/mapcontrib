

define([

    'underscore',
    'backbone',
    'marionette',
],
function (

    _,
    Backbone,
    Marionette
) {

    'use strict';

    return Marionette.Behavior.extend({

        ui: {

            'closeBtn': '.close_btn',
        },

        events: {

            'click @ui.modal': 'onClickModal',
            'click @ui.closeBtn': 'onClickClose',
            'keyup': 'onKeyUp',
        },

        initialize: function (options) {

            var self = this;

            this._radio = Backbone.Wreqr.radio.channel('global');
        },

        onRender: function () {

            this.ui.modal.attr('tabindex', 0);
        },

        onShow: function () {

            this.onOpen();
        },

        onOpen: function () {

            var self = this;

            this.view.trigger('open');

            setTimeout(function () {

                window.requestAnimationFrame(function () {

                    self.ui.modal.addClass('open').focus();
                });
            }, 100);
        },

        onClose: function () {

            var self = this,
            mapElement = this._radio.reqres.request('map')._container;

            $(mapElement).focus();

            window.requestAnimationFrame(function () {

                self.view.trigger('close');

                self.ui.modal.on('transitionend', function () {

                    self.view.destroy();
                })
                .removeClass('open');
            });
        },

        onClickModal: function (e) {

            if (e.target !== this.ui.modal[0]) {

                return;
            }

            this.onClose();
        },

        onClickClose: function () {

            this.onClose();
        },

        onKeyUp: function (e) {

            switch ( e.keyCode ) {

                case 27:

                    this.onClose();
                    break;
            }
        },
    });
});
