
import Marionette from 'backbone.marionette';
import LoginModalView from './loginModal';
import ThemeModel from '../model/theme';

export default Marionette.LayoutView.extend({

    template: false,

    behaviors: {
        'l20n': {},
    },

    ui: {
        'createThemeButton': '#createThemeButton'
    },

    regions: {
        'loginModal': '#rg_login_modal'
    },

    events: {
        'click @ui.createThemeButton': 'onClickCreateTheme'
    },

    initialize: function (options) {
        this._app = options.app;
        this._window = this._app.getWindow();
        this._document = this._app.getDocument();
    },

    onClickCreateTheme: function (e) {
        if (this._app.isLogged()) {
            let userId = this._app.getUser().get('_id');
            let theme = new ThemeModel({
                'userId': userId,
                'owners': [ userId ]
            });

            theme.save({}, {
                'success': () => {
                    window.location.replace(
                        theme.buildPath()
                    );
                },
                'error': this.displayLoginModal.bind(this)
            });
        }
        else {
            this.displayLoginModal();
        }
    },

    displayLoginModal: function () {
        let loginModalView = new LoginModalView({
            'authSuccessCallback': '/',
            'authFailCallback': '/'
        });

        this.getRegion('loginModal').show( loginModalView );
    }
});
