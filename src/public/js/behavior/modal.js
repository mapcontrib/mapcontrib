
import $ from 'jquery';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';


export default Marionette.Behavior.extend({
    defaults() {
        return {
            'appendToBody': false,
            'routeOnClose': '',
            'triggerRouteOnClose': false,
        };
    },

    ui: {
        'closeBtn': '.close_btn',
    },

    events: {
        'click @ui.modal': 'onClickModal',
        'click @ui.closeBtn': 'onClickClose',
        'keyup': 'onKeyUp',
    },

    initialize(options) {
        this._radio = Wreqr.radio.channel('global');
    },

    onRender() {
        this.ui.modal.attr('tabindex', 0);
    },

    onShow() {
        this.onOpen();
    },

    onOpen() {
        if ( this.options.appendToBody && !this.view.isRendered ) {
            this.view.render();
            document.body.appendChild( this.el );
            return setTimeout(this.onOpen.bind(this), 0);
        }

        if (this.view.onBeforeOpen) {
            this.view.onBeforeOpen();
        }

        setTimeout(() => {
            window.requestAnimationFrame(() => {
                this.ui.modal.addClass('open').focus();

                if (this.view.onAfterOpen) {
                    this.view.onAfterOpen();
                }
            });
        }, 100);
    },

    onClose() {
        const mapElement = this._radio.reqres.request('map');

        this.navigateOnClose();

        if (mapElement) {
            $(mapElement._container).focus();
        }

        if (this.view.onBeforeClose) {
            this.view.onBeforeClose();
        }

        window.requestAnimationFrame(() => {
            this.ui.modal.on('transitionend', () => {
                if (this.view.onAfterClose) {
                    this.view.onAfterClose();
                }

                this.view.destroy();
            })
            .removeClass('open');
        });
    },

    onClickModal(e) {
        if (e.target !== this.ui.modal[0]) {
            return;
        }

        this.onClose();
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

    navigateOnClose() {
        const router = this._radio.reqres.request('router');

        router.navigate(
            this.options.routeOnClose,
            this.options.triggerRouteOnClose
        );
    }
});
