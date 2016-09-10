
import $ from 'jquery';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';


export default Marionette.Behavior.extend({
    defaults() {
        return {
            'destroyOnClose': false,
        };
    },

    ui: {
        'closeBtn': '.close_btn',
    },

    events: {
        'click @ui.closeBtn': 'onClickClose',
        'keyup': 'onKeyUp',
    },

    initialize(options) {
        this._radio = Wreqr.radio.channel('global');

        this.listenTo(this._radio.vent, 'notification:closeAll', this.onCloseAll);

        this._isOpened = false;
    },

    onRender() {
        document.body.appendChild( this.el );
        this.ui.notification.attr('tabindex', 0);
    },

    onDestroy() {
        this.stopListening(this._radio.vent, 'notification:closeAll');
    },

    onToggle() {
        if ( this._isOpened ) {
            this.onClose();
        }
        else {
            this.onOpen();
        }
    },

    onOpen() {
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

    onClose() {
        const mapElement = this._radio.reqres.request('map')._container;

        $(mapElement).focus();

        this._close();
    },

    onCloseAll(excludedViews) {
        if ( !excludedViews ) {
            return this._close();
        }

        if ( excludedViews.indexOf(this.view.cid) === -1 ) {
            return this._close();
        }
    },

    onClickClose() {
        this.onClose();
    },

    onKeyUp(e) {
        switch ( e.keyCode ) {
            case 27:

                this.onClose();
                break;
        }
    },

    _close() {
        this._isOpened = false;

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
});
