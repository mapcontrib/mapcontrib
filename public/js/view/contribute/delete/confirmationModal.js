import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import osmAuth from 'osm-auth';
import OsmEditHelper from 'helper/osmEdit';
import template from 'templates/contribute/delete/confirmationModal.ejs';
import DeletionErrorNotificationView from 'view/deletionErrorNotification';
import CONST from 'const';
import ThemeCore from 'core/theme';

export default Marionette.LayoutView.extend({
  template,

  behaviors() {
    return {
      l20n: {},
      modal: {
        appendToBody: true,
        routeOnClose: this.options.routeOnClose
      }
    };
  },

  ui: {
    modal: '#delete_confirmation_modal',
    confirmationBtn: '#confirmationBtn',
    cancelBtn: '#cancelBtn'
  },

  events: {
    'click @ui.confirmationBtn': 'onClickConfirmation',
    'click @ui.cancelBtn': 'onClickCancel'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
    this._config = this.options.config;
    this._theme = this.options.theme;
    this._iDPresetsHelper = this.options.iDPresetsHelper;
    this._nonOsmData = this.options.nonOsmData;
    this._osmCache = this.options.osmCache;
    this._user = this.options.user;
    this._layer = this.options.layer;
    this._layerModel = this.options.layerModel;

    this._osmCacheModel = this._osmCache.findWhere({
      themeFragment: this._theme.get('fragment'),
      osmId: this.options.osmId,
      osmType: this.options.osmType
    });

    this._osmEdit = new OsmEditHelper(
      osmAuth({
        url: this._config.oauthEndPoint,
        oauth_consumer_key: this._config.oauthConsumerKey,
        oauth_secret: this._config.oauthSecret,
        oauth_token: this._user.get('token'),
        oauth_token_secret: this._user.get('tokenSecret')
      })
    );

    this._osmEdit.setType(this.options.osmType);
    this._osmEdit.setId(this.options.osmId);
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  },

  onClickCancel() {
    this.close();
  },

  onClickConfirmation() {
    const createdBy = CONST.osm.changesetCreatedBy.replace(
      '{version}',
      MAPCONTRIB.version
    );
    const changesetAttribution = this._radio.reqres.request(
      'changeset-attribution'
    );
    let changesetComment = CONST.osm.changesetComment.replace(
      '{url}',
      ThemeCore.buildUrl(
        window,
        this._theme.get('fragment'),
        this._theme.get('name')
      )
    );

    if (changesetAttribution) {
      changesetComment += `\n\nTiles: ${changesetAttribution}`;
    }

    this._osmEdit
      .fetch()
      .then(() => {
        this._osmEdit.setChangesetCreatedBy(createdBy);
        this._osmEdit.setChangesetComment(changesetComment);

        return this._osmEdit.delete();
      })
      .then(() => {
        const overPassElement = this._osmEdit.getOverPassElement();

        this._radio.commands.execute(
          'removeOverPassData',
          overPassElement,
          this._layerModel
        );

        this._radio.commands.execute(
          'map:removePoi',
          this._layerModel,
          overPassElement
        );

        this._osmCacheModel.destroy();

        this.close();

        const router = this._radio.reqres.request('router');

        router.navigate('', true);
        this._radio.vent.trigger('column:closeAll');
      })
      .catch(err => {
        console.error(err); // eslint-disable-line

        this.close();

        const router = this._radio.reqres.request('router');

        router.navigate('', true);
        this._radio.vent.trigger('column:closeAll');

        new DeletionErrorNotificationView({
          retryCallback: this.onClickConfirmation.bind(this)
        }).open();
      });
  }
});
