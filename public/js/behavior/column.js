
import $ from 'jquery';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';


export default Marionette.Behavior.extend({
    defaults() {
        return {
            destroyOnClose: false,
            appendToBody: false,
            routeOnClose: '',
            triggerRouteOnClose: false,
        };
    },

    ui: {
        closeBtn: '.close_btn',
    },

    events: {
        'click @ui.closeBtn': 'onClickClose',
        keyup: 'onKeyUp',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this.listenTo(this._radio.vent, 'column:closeAll', this.onCloseAll);

        this._isOpened = false;
    },

    onRender() {
        this.ui.column.attr('tabindex', 0);
    },

    onDestroy() {
        this.stopListening(this._radio.vent, 'column:closeAll');
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

        if ( this.options.appendToBody && !this.view.isRendered ) {
            this.view.render();
            document.body.appendChild( this.el );
            return setTimeout(this.onOpen.bind(this), 0);
        }

        if (this.view.onBeforeOpen) {
            this.view.onBeforeOpen();
        }

        window.requestAnimationFrame(() => {
            this.ui.column.addClass('open').focus();

            if (this.view.onAfterOpen) {
                this.view.onAfterOpen();
            }
        });

        return true;
    },

    onClose() {
        const mapElement = this._radio.reqres.request('map');
        const router = this._radio.reqres.request('router');

        router.navigate(
            this.options.routeOnClose,
            this.options.triggerRouteOnClose
        );

        if (mapElement) {
            $(mapElement._container).focus();
        }

        this._close();
    },

    onCloseAll(excludedViews) {
        if ( !excludedViews ) {
            return this._close();
        }

        if ( excludedViews.indexOf(this.view.cid) === -1 ) {
            return this._close();
        }

        return true;
    },

    onClickClose() {
        this.onClose();
    },

    onKeyUp(e) {
        if (e.target === this.ui.column[0]) {
            switch (e.keyCode) {
                case 27:
                this.onClose();
                break;
                default:
            }
        }
    },

    _close() {
        this._isOpened = false;

        if (this.view.onBeforeClose) {
            this.view.onBeforeClose();
        }

        window.requestAnimationFrame(() => {
            this.ui.column.on('transitionend', () => {
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
