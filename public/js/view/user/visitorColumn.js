
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import template from 'templates/user/visitorColumn.ejs';
import LoginModalView from 'view/loginModal';
import ThemeCore from 'core/theme';


export default Marionette.LayoutView.extend({
    template,

    behaviors() {
        return {
            l20n: {},
            column: {
                appendToBody: true,
                destroyOnClose: true,
                routeOnClose: this.options.previousRoute,
            },
        };
    },

    ui: {
        column: '.column',
        goBackToHomeNav: '.go_back_to_home_nav',
        createThemeItem: '.create_theme_item',
        blogLinks: '.blog_link',
        loginItem: '.login_item',
    },

    events: {
        'click @ui.createThemeItem': 'onClickCreateTheme',
        'click @ui.loginItem': 'onClickLogin',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');
        this._app = this.options.app;
    },

    onBeforeOpen() {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    onRender() {
        if (document.l10n.supportedLocales.length > 0 && document.l10n.supportedLocales[0] === 'fr') {
            this.ui.blogLinks.each((index, element) => {
                element.href = element.href.replace('blog.mapcontrib.xyz', 'blog.mapcontrib.xyz/fr');
            });
        }

        if ( this._app.isThemePage() ) {
            this.ui.goBackToHomeNav.removeClass('hide');
        }
    },

    open() {
        this.triggerMethod('open');
        return this;
    },

    close() {
        this.triggerMethod('close');
        return this;
    },

    onClickLogin() {
        // FIXME To have a real fail callback
        let authSuccessCallback;
        let authFailCallback;

        if (this.model) {
            authSuccessCallback = authFailCallback = ThemeCore.buildPath(
                this.model.get('fragment'),
                this.model.get('name')
            );
        }
        else {
            authSuccessCallback = authFailCallback = '/';
        }

        new LoginModalView({
            authSuccessCallback,
            authFailCallback,
        }).open();
    },

    onClickCreateTheme() {
        // FIXME To have a real fail callback
        const authSuccessCallback = '/create_theme';
        let authFailCallback;

        if (this.model) {
            authFailCallback = ThemeCore.buildPath(
                this.model.get('fragment'),
                this.model.get('name')
            );
        }
        else {
            authFailCallback = '/';
        }
        new LoginModalView({
            authSuccessCallback,
            authFailCallback,
        }).open();
    },
});
