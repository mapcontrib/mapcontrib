import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import InfoDisplay from 'core/infoDisplay';
import template from 'templates/infoDisplayModal.ejs';
import CONST from 'const';
import LoginModalView from 'view/loginModal';
import ThemeCore from 'core/theme';

export default Marionette.LayoutView.extend({
  template,

  behaviors: {
    l20n: {},
    modal: {
      appendToBody: true
    }
  },

  ui: {
    modal: '.info_display_modal',
    content: '.info_content',
    editBtn: '.edit_btn',
    footer: '.bordered-footer'
  },

  events: {
    'click @ui.editBtn': '_onClickEdit'
  },

  initialize() {
    this._radio = Wreqr.radio.channel('global');
  },

  templateHelpers() {
    let editButtonLabel = '';

    if (this.options.isLogged) {
      editButtonLabel = 'editThatElement';
    } else {
      editButtonLabel = 'connectToEditThatElement';
    }

    return {
      editRoute: this.options.editRoute,
      editButtonLabel
    };
  },

  onRender() {
    const layerModel = this.options.layerModel;
    const layer = this.options.layer;
    const osmType = layer.feature.properties.type;
    const osmId = layer.feature.properties.id;

    this.ui.content.append(this.options.content);

    if (layerModel.get('type') === CONST.layerType.overpass) {
      this.ui.footer.removeClass('hide');
    }

    InfoDisplay.buildDirectRelationsList(
      document,
      this.options.config.overPassEndPoint,
      osmType,
      osmId
    ).then(ul => {
      if (ul.childElementCount > 0) {
        this.$el
          .find('.relations')
          .removeClass('hide')
          .find('.list')
          .append(ul);
      }
    });
  },

  open() {
    this.triggerMethod('open');
    return this;
  },

  close() {
    this.triggerMethod('close');
    return this;
  },

  onBeforeOpen() {
    this._radio.vent.trigger('column:closeAll', [this.cid]);
    this._radio.vent.trigger('widget:closeAll', [this.cid]);
  },

  _onClickEdit() {
    if (!this.options.isLogged) {
      return this.openLoginModal();
    }

    this._radio.commands.execute('set:edition-data', {
      layer: this.options.layer,
      layerModel: this.options.layerModel
    });
    this.close();
  },

  openLoginModal() {
    // FIXME To have a real fail callback
    let authSuccessCallback;
    let authFailCallback;
    const theme = this.options.app.getTheme();

    if (theme) {
      authSuccessCallback = ThemeCore.buildPath(
        theme.get('fragment'),
        theme.get('name')
      );
      authFailCallback = authSuccessCallback;
    } else {
      authSuccessCallback = '/';
      authFailCallback = authSuccessCallback;
    }

    new LoginModalView({
      authSuccessCallback,
      authFailCallback
    }).open();
  }
});
