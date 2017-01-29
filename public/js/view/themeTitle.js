
import $ from 'jquery';
import { FavoriteBurst } from 'helper/animation';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import CONST from 'const';
import MarkedHelper from 'helper/marked';
import template from 'templates/themeTitle.ejs';
import Locale from 'core/locale';


export default Marionette.LayoutView.extend({
    template,

    behaviors: {
        l20n: {},
    },

    ui: {
        titleWrapper: '#title',
        title: '#title .title_head',
        description: '#title .description',
        favoriteButton: '#title .favorite_btn',
        favoriteButtonIcon: '#title .favorite_btn .fa',
        descriptionButton: '#title .description_btn',
    },

    events: {
        'click @ui.descriptionButton': 'onClickDescription',
        'click @ui.favoriteButton': 'onClickFavorite',
    },

    initialize() {
        this._radio = Wreqr.radio.channel('global');

        this._currentTitleColor = this.model.get('color');
        this._app = this.options.app;
        this._userFavoriteThemes = this.options.userFavoriteThemes;

        this.listenTo(this.model, 'change', this.setTitle);
        this.listenTo(this.model, 'change', this.setDescription);

        this._radio.commands.setHandler('ui:setTitleColor', this.commandSetTitleColor, this);
        this._radio.vent.on('session:logged', this.render, this);
        this._radio.vent.on('session:unlogged', this.render, this);
    },

    templateHelpers() {
        const name = Locale.getLocalized(this.model, 'name');
        const description = Locale.getLocalized(this.model, 'description');
        let favoriteIconClass = 'fa-star-o';

        if ( this._userFavoriteThemes.has(this.model) ) {
            favoriteIconClass = 'fa-star';
        }

        return {
            name,
            favoriteIconClass,
            description: MarkedHelper.render( description || '' ),
        };
    },

    onRender() {
        this.setTitle();

        if ( this._app.isLogged() ) {
            this.ui.favoriteButton.removeClass('hide');
        }
        else {
            this.ui.favoriteButton.addClass('hide');
        }

        if ( this.model.get('description') ) {
            this.ui.descriptionButton.removeClass('hide');
        }

        this._favoriteTimeline = FavoriteBurst.init(
            this.ui.favoriteButton[0],
            '.fa'
        );
    },

    onShow() {
        this.ui.favoriteButton.tooltip({
            title: document.l10n.getSync('buttonFavoriteTooltip'),
            container: 'body',
            delay: {
                show: CONST.tooltip.showDelay,
                hide: CONST.tooltip.hideDelay,
            },
        })
        .on('click', (e) => {
            $(e.currentTarget)
            .blur()
            .tooltip('hide');
        });

        this.ui.descriptionButton.tooltip({
            title: document.l10n.getSync('buttonDescriptionTooltip'),
            container: 'body',
            delay: {
                show: CONST.tooltip.showDelay,
                hide: CONST.tooltip.hideDelay,
            },
        })
        .on('click', (e) => {
            $(e.currentTarget)
            .blur()
            .tooltip('hide');
        });
    },

    setTitle() {
        const themeName = Locale.getLocalized(this.model, 'name');
        const appName = document.l10n.getSync('mapcontrib');

        if (themeName === appName) {
            document.title = appName;
        }
        else {
            document.title = document.l10n.getSync('pageTitleWithMapName', {
                map: {
                    name: themeName,
                },
            });
        }

        this.ui.title.html(themeName);
    },

    commandSetTitleColor(color) {
        if ( this._currentTitleColor === color ) {
            return;
        }

        this.ui.titleWrapper
        .addClass( color )
        .removeClass( this._currentTitleColor );

        this._currentTitleColor = color;
    },

    setDescription() {
        const description = MarkedHelper.render(
            Locale.getLocalized(this.model, 'description')
        );

        if ( description ) {
            this.ui.description.html( description );
            this.ui.descriptionButton.removeClass('hide');
        }
        else {
            this.ui.description.html('');
            this.ui.descriptionButton.addClass('hide');
        }
    },

    onClickDescription() {
        this._radio.vent.trigger('column:closeAll');
        this._radio.vent.trigger('widget:closeAll');

        this.ui.titleWrapper.toggleClass('open');
    },

    onClickFavorite() {
        this._userFavoriteThemes.toggle(this.model);
        this._favoriteTimeline.replay();
    },
});
