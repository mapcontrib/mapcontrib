

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

            if (this.view.onBeforeOpen) {

                this.view.onBeforeOpen();
            }

            setTimeout(function () {

                window.requestAnimationFrame(function () {

                    self.ui.modal.addClass('open').focus();

                    if (self.view.onAfterOpen) {

                        self.view.onAfterOpen();
                    }
                });
            }, 100);
        },

        onClose: function () {

            var self = this,
            mapElement = this._radio.reqres.request('map')._container;

            $(mapElement).focus();

            if (this.view.onBeforeClose) {

                this.view.onBeforeClose();
            }

            window.requestAnimationFrame(function () {

                self.ui.modal.on('transitionend', function () {

                    if (self.view.onAfterClose) {

                        self.view.onAfterClose();
                    }

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
