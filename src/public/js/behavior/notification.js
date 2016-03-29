
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');


module.exports = Marionette.Behavior.extend({

    defaults: {

        'destroyOnClose': false,
    },

    ui: {

        'closeBtn': '.close_btn',
    },

    events: {

        'click @ui.closeBtn': 'onClickClose',
        'keyup': 'onKeyUp',
    },

    initialize: function (options) {

        var self = this;

        this._radio = Wreqr.radio.channel('global');

        this.listenTo(this._radio.vent, 'notification:closeAll', this.onClose);

        this._isOpened = false;
    },

    onRender: function () {

        this.ui.notification.attr('tabindex', 0);
    },

    onDestroy: function () {

        this.stopListening(this._radio.vent, 'notification:closeAll');
    },

    onToggle: function () {

        if ( this._isOpened ) {

            this.onClose();
        }
        else {

            this.onOpen();
        }
    },

    onOpen: function () {

        var self = this;

        this._isOpened = true;

        if (this.view.onBeforeOpen) {

            this.view.onBeforeOpen();
        }

        window.requestAnimationFrame(function () {

            self.ui.notification.addClass('open').focus();

            if (self.view.onAfterOpen) {

                self.view.onAfterOpen();
            }
        });
    },

    onClose: function () {

        var self = this,
        mapElement = this._radio.reqres.request('map')._container;

        this._isOpened = false;

        $(mapElement).focus();

        if (this.view.onBeforeClose) {

            this.view.onBeforeClose();
        }

        window.requestAnimationFrame(function () {

            self.ui.notification.on('transitionend', function () {

                if (self.view.onAfterClose) {

                    self.view.onAfterClose();
                }

                if ( self.options.destroyOnClose ) {

                    self.view.destroy();
                }
            })
            .removeClass('open');
        });
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
