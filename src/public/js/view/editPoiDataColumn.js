
import $ from 'jquery';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import settings from '../settings';
import osmAuth from 'osm-auth';
import ContributionErrorNotificationView from './contributionErrorNotification';
import OsmEditHelper from '../helper/osmEdit.js';
import CONST from '../const';
import template from '../../templates/editPoiDataColumn.ejs';
import ContribNodeTagsListView from '../ui/form/contribNodeTags';
import OsmNodeModel from '../model/osmNode';
import Cache from '../core/cache';



export default Marionette.LayoutView.extend({

    template: template,

    behaviors: {

        'l20n': {},
        'column': {},
    },

    regions: {

        'tagList': '.rg_tag_list',
    },

    ui: {

        'column': '#edit_poi_data_column',
        'content': '.content',
        'footer': '.sticky-footer',
        'footerButtons': '.sticky-footer button',
        'addBtn': '.add_btn',
    },

    events: {

        'click @ui.addBtn': 'onClickAddBtn',
        'submit': 'onSubmit',
    },

    initialize: function () {

        this._app = this.options.app;
        this._user = this._app.getUser();
        this._radio = Wreqr.radio.channel('global');

        if ( !this._app.isLogged() ) {
            return false;
        }

        this.model = new OsmNodeModel({
            'id': this.options.dataFromOverpass.id,
            'type': this.options.dataFromOverpass.type,
            'version': this.options.dataFromOverpass.version + 1,
            'lat': this.options.dataFromOverpass.lat,
            'lng': this.options.dataFromOverpass.lon,
            'tags': this.options.dataFromOverpass.tags,
        });

        this._osmEdit = new OsmEditHelper(
            osmAuth({

                'oauth_consumer_key': settings.oauthConsumerKey,
                'oauth_secret': settings.oauthSecret,
                'oauth_token': this._user.get('token'),
                'oauth_token_secret': this._user.get('tokenSecret'),
            })
        );
    },

    onBeforeOpen: function () {

        this._radio.vent.trigger('column:closeAll');
        this._radio.vent.trigger('widget:closeAll');
    },

    open: function () {

        this.triggerMethod('open');
    },

    close: function () {

        this.triggerMethod('close');
    },

    onRender: function () {

        if ( !this.options.poiLayerModel.get('dataEditable') ) {
            return this;
        }

        if ( !this._app.isLogged() ) {
            return this;
        }

        this._osmEdit.fetch(
            this.model.get('type'),
            this.model.get('id')
        )
        .then((osmEdit) => {
            let version = osmEdit.getVersion(),
            type = this.model.get('type'),
            id = this.model.get('id');

            this.model.set('tags', osmEdit.getTags());
            this.model.set('version', osmEdit.getVersion() + 1);

            if (Cache.exists(type, id)) {
                if (Cache.isNewerThanCache(type, id, version)) {
                    Cache.remove(type, id);
                }
                else {
                    let elementFromCache = Cache.get(type, id);

                    this.model.set('id', elementFromCache.id);
                    this.model.set('type', elementFromCache.type);
                    this.model.set('version', elementFromCache.version + 1);
                    this.model.set('lat', elementFromCache.lat);
                    this.model.set('lng', elementFromCache.lon);
                    this.model.set('tags', elementFromCache.tags);
                }
            }

            this.renderTags( this.model.get('tags') );
        })
        .catch(() => {
            console.error('FIXME');
        });
    },

    renderTags: function (tags) {
        this._tagList = new ContribNodeTagsListView();

        let popupTag, value,
        popupContent = this.options.poiLayerModel.get('popupContent'),
        re = new RegExp('{(.*?)}', 'g'),
        popupTags = popupContent.match(re);

        if ( popupTags) {
            for (let popupTag of popupTags) {
                popupTag = popupTag.replace( /\{(.*?)\}/g, '$1' );

                if ( tags[popupTag] ) {
                    value = tags[popupTag];
                }
                else {
                    value = '';
                }

                this._tagList.addTag({
                    'key': popupTag,
                    'value': value,
                    'keyReadOnly': false,
                    'valueReadOnly': false,
                });
            }
        }

        for (let key in tags) {
            if ( popupTags && popupTags.indexOf(key) > -1 ) {
                continue;
            }

            this._tagList.addTag({
                'key': key,
                'value': tags[key],
                'keyReadOnly': false,
                'valueReadOnly': false,
            });
        }

        this.ui.footer.removeClass('hide');

        this.getRegion('tagList').show( this._tagList );
    },

    onSubmit: function (e) {

        e.preventDefault();

        if ( !this._app.isLogged() ) {
            return false;
        }

        this.ui.footerButtons.prop('disabled', true);

        this.model.set('tags', this._tagList.getTags());

        this._osmEdit.setChangesetCreatedBy(CONST.osm.changesetCreatedBy);
        this._osmEdit.setChangesetComment(CONST.osm.changesetComment);
        this._osmEdit.setId(this.model.get('id'));
        this._osmEdit.setType(this.model.get('type'));
        this._osmEdit.setVersion(this.model.get('version'));
        this._osmEdit.setTimestamp(this.model.get('timestamp'));
        this._osmEdit.setLatitude(this.model.get('lat'));
        this._osmEdit.setLongitude(this.model.get('lng'));
        this._osmEdit.setTags(this.model.get('tags'));
        this._osmEdit.setUid(this._user.get('osmId'));
        this._osmEdit.setDisplayName(this._user.get('displayName'));

        this.sendContributionToOSM();

        this.close();
    },

    sendContributionToOSM: function () {
        this._osmEdit.send()
        .then((elementId) => {
            this._radio.commands.execute(
                'map:updatePoiPopup',
                this.options.poiLayerModel,
                this.model.attributes
            );

            Cache.save(this.model.attributes);
        })
        .catch(function (err) {
            var notification = new ContributionErrorNotificationView({
                'retryCallback': this.sendContributionToOSM.bind(this)
            });

            document.body.appendChild( notification.el );

            notification.open();
        });
    },

    onClickAddBtn: function () {

        this._tagList.addTag();

        let scrollHeight = this.ui.column.height() +
        this._tagList.el.scrollHeight;
        this.ui.content[0].scrollTo(0, scrollHeight);
    },
});
