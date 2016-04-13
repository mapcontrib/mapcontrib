
import $ from 'jquery';
import Backbone from 'backbone';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';


export default Marionette.Behavior.extend({

    ui: {

        'closeBtn': '.close_btn',
    },

    events: {

        'click @ui.modal': 'onClickModal',
        'click @ui.closeBtn': 'onClickClose',
        'keyup': 'onKeyUp',
    },

    initialize: function (options) {

        this._radio = Wreqr.radio.channel('global');
    },

    onRender: function () {

        this.ui.modal.attr('tabindex', 0);
    },

    onShow: function () {

        this.onOpen();
    },

    onOpen: function () {

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

    onClose: function () {

        var map = this._radio.reqres.request('map');

        if (map) {
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
