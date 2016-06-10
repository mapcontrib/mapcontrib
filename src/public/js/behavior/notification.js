
import $ from 'jquery';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';


export default Marionette.Behavior.extend({
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
        this._isOpened = true;

        if (this.view.onBeforeOpen) {
            this.view.onBeforeOpen();
        }

        window.requestAnimationFrame(() => {
            this.ui.notification.addClass('open').focus();

            if (this.view.onAfterOpen) {
                this.view.onAfterOpen();
            }
        });
    },

    onClose: function () {
        var mapElement = this._radio.reqres.request('map')._container;

        this._isOpened = false;

        $(mapElement).focus();

        if (this.view.onBeforeClose) {
            this.view.onBeforeClose();
        }

        window.requestAnimationFrame(() => {
            this.ui.notification.on('transitionend', () => {
                if (this.view.onAfterClose) {
                    this.view.onAfterClose();
                }

                if ( this.options.destroyOnClose ) {
                    this.view.destroy();
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
