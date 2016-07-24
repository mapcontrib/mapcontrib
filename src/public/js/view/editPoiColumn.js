
import $ from 'jquery';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import osmAuth from 'osm-auth';
import ContributionErrorNotificationView from './contributionErrorNotification';
import OsmEditHelper from '../helper/osmEdit.js';
import CONST from '../const';
import template from '../../templates/editPoiColumn.ejs';
import ContribNodeTagsListView from '../ui/form/contribNodeTags';
import Cache from '../core/cache';
import InfoDisplay from '../core/infoDisplay';
import MovePoiContextual from './movePoiContextual';
import NonOsmDataModel from '../model/nonOsmData';



export default Marionette.LayoutView.extend({
    template: template,

    behaviors: {
        'l20n': {},
        'column': {
            'appendToBody': true,
        },
    },

    regions: {
        'tagList': '.rg_tag_list',
    },

    ui: {
        'column': '#edit_poi_column',
        'content': '.content',
        'footer': '.sticky-footer',
        'footerButtons': '.sticky-footer button',
        'addBtn': '.add_btn',
        'moveBtn': '.move_btn',
        'moveSection': '.move_section',
    },

    events: {
        'click @ui.addBtn': 'onClickAddBtn',
        'click @ui.moveBtn': 'onClickMove',
        'submit': 'onSubmit',
    },

    initialize: function () {
        this._app = this.options.app;
        this._user = this._app.getUser();
        this._radio = Wreqr.radio.channel('global');
        this._layer = this.options.layer;
        this._layerModel = this.options.layerModel;

        this._theme = this._radio.reqres.request('theme');
        this._nonOsmData = this._radio.reqres.request('nonOsmData');


        this._contributionSent = false;

        if ( !this._app.isLogged() ) {
            return false;
        }

        this._osmEdit = new OsmEditHelper(
            osmAuth({
                'oauth_consumer_key': MAPCONTRIB.config.oauthConsumerKey,
                'oauth_secret': MAPCONTRIB.config.oauthSecret,
                'oauth_token': this._user.get('token'),
                'oauth_token_secret': this._user.get('tokenSecret'),
            })
        );

        this._osmEdit.setType( this.options.osmType );
        this._osmEdit.setId( this.options.osmId );
    },

    onBeforeOpen: function () {
        this._radio.vent.trigger('column:closeAll', [ this.cid ]);
        this._radio.vent.trigger('widget:closeAll', [ this.cid ]);
    },

    open: function () {
        this.triggerMethod('open');
        return this;
    },

    onBeforeClose: function () {
        if ( this._osmEdit.getType() === 'node' && this._oldLatLng ) {
            if (!this._contributionSent) {
                this._layer.setLatLng( this._oldLatLng );
            }
        }
    },

    close: function () {
        this.triggerMethod('close');
        return this;
    },

    onRender: function () {
        if ( !this._layerModel.get('dataEditable') ) {
            return this;
        }

        if ( !this._app.isLogged() ) {
            return this;
        }

        const promises = [ this._osmEdit.fetch() ];


        this._nonOsmDataModel = this._nonOsmData.findWhere({
            'themeFragment': this._theme.get('fragment'),
            'osmId': this.options.osmId,
            'osmType': this.options.osmType,
        });

        if ( !this._nonOsmDataModel ) {
            this._nonOsmDataModel = new NonOsmDataModel({
                'themeFragment': this._theme.get('fragment'),
                'osmId': this.options.osmId,
                'osmType': this.options.osmType,
                'userId': this._user.get('osmId'),
            });
            this._nonOsmData.add( this._nonOsmDataModel );
        }
        else {
            promises.push(
                new Promise((resolve, reject) => {
                    this._nonOsmDataModel.fetch({
                        'success': model => resolve(model),
                        'error': (model, response) => reject(response),
                    });
                })
            );
        }

        Promise.all(promises)
        .then(results => {
            const osmEdit = results[0];

            if ( this._osmEdit.getType() === 'node' ) {
                this._oldLatLng = this._layer.getLatLng();
                this.ui.moveSection.removeClass('hide');
            }

            const version = osmEdit.getVersion();
            const type = osmEdit.getType();
            const id = osmEdit.getId();

            if (Cache.exists(type, id)) {
                if (Cache.isNewerThanCache(type, id, version)) {
                    Cache.remove(type, id);
                }
                else {
                    osmEdit.setElement( Cache.getOsmElement(type, id) );
                }
            }

            this.renderTags( osmEdit.getTags() );
        })
        .catch(err => {
            console.error('FIXME', err);
        });
    },

    renderTags: function (tags) {
        this._tagList = new ContribNodeTagsListView();

        let value;
        const popupContent = this._layerModel.get('popupContent');
        const popupTags = InfoDisplay.findTagsFromContent(popupContent);
        const keysAdded = [];

        for (const tag of this._nonOsmDataModel.get('tags')) {
            keysAdded.push(tag.key);
            this._tagList.addTag({
                'key': tag.key,
                'value': tag.value,
                'keyReadOnly': true,
                'valueReadOnly': false,
                'nonOsmData': true,
            });
        }

        if (this.options.presetModel) {
            for (const tag of this.options.presetModel.get('tags')) {
                if ( keysAdded.indexOf(tag.key) > -1 ) {
                    continue;
                }

                keysAdded.push(tag.key);
                this._tagList.addTag(tag);
            }
        }

        if ( popupTags) {
            for (const popupTag of popupTags) {
                if ( keysAdded.indexOf(popupTag) > -1 ) {
                    continue;
                }

                if (popupTag === 'id' || popupTag === 'type') {
                    continue;
                }

                if ( tags[popupTag] ) {
                    value = tags[popupTag];
                }
                else {
                    value = '';
                }

                keysAdded.push(popupTag);

                this._tagList.addTag({
                    'key': popupTag,
                    'value': value,
                    'keyReadOnly': false,
                    'valueReadOnly': false,
                    'nonOsmData': false,
                });
            }
        }

        for (const key in tags) {
            if ( keysAdded.indexOf(key) > -1 ) {
                continue;
            }

            this._tagList.addTag({
                'key': key,
                'value': tags[key],
                'keyReadOnly': false,
                'valueReadOnly': false,
                'nonOsmData': false,
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

        const createdBy = CONST.osm.changesetCreatedBy
        .replace('{version}', MAPCONTRIB.version);
        const tags = this._tagList.getTags();
        const osmTags = {};
        const nonOsmTags = [];

        for (const tag of tags) {
            if (tag.nonOsmData) {
                nonOsmTags.push({
                    'key': tag.key,
                    'value': tag.value,
                    'type': 'text',
                });
            }
            else {
                if (!tag.key || !tag.value) {
                    continue;
                }

                osmTags[tag.key] = tag.value;
            }
        }

        this._nonOsmDataModel.updateModificationDate();
        this._nonOsmDataModel.set('tags', nonOsmTags);
        this._nonOsmDataModel.save();

        this._osmEdit.setChangesetCreatedBy(createdBy);
        this._osmEdit.setChangesetComment(CONST.osm.changesetComment);
        this._osmEdit.setTimestamp();
        this._osmEdit.setTags( osmTags );
        this._osmEdit.setUid(this._user.get('osmId'));
        this._osmEdit.setDisplayName(this._user.get('displayName'));


        this.sendContributionToOSM();
    },

    sendContributionToOSM: function () {
        this._osmEdit.send()
        .then(version => {
            this._contributionSent = true;

            this._osmEdit.setVersion(version);

            this.close();

            const overPassElement = this._osmEdit.getOverPassElement();

            this._radio.commands.execute(
                'saveOsmData',
                overPassElement,
                this._layerModel
            );

            this._radio.commands.execute(
                'map:updatePoiPopup',
                this._layerModel,
                overPassElement
            );

            Cache.save(overPassElement);
            Cache.saveOsmElement(this._osmEdit.getElement());
        })
        .catch((err) => {
            new ContributionErrorNotificationView({
                'retryCallback': this.sendContributionToOSM.bind(this)
            }).open();
        });
    },

    onClickAddBtn: function () {
        this._tagList.addTag();

        let scrollHeight = this.ui.column.height() +
        this._tagList.el.scrollHeight;
        this.ui.content[0].scrollTo(0, scrollHeight);
    },

    setNewPosition: function (lat, lng) {
        this._osmEdit.setLatitude(lat);
        this._osmEdit.setLongitude(lng);

        this._layer.setLatLng(
            L.latLng([ lat, lng ])
        );
    },

    onClickMove: function (e) {
        e.preventDefault();

        new MovePoiContextual({
            'marker': this._layer,
            'editPoiColumnView': this,
        }).open();

        this.close(true);
    },
});
