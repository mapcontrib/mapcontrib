
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

    initialize: function (options) {

        this._app = options.app;
        this._user = this._app.getUser();
        this._radio = Wreqr.radio.channel('global');

        this.model = new OsmNodeModel();

        if ( !this._app.isLogged() ) {
            return false;
        }
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

        this.getRemoteEntityData(
            this.options.dataFromOSM.id,
            this.options.dataFromOSM.type
        )
        .then((remoteData) => {
            this.renderTags(remoteData);
        })
        .catch(() => {
            console.error('FIXME');
        });
    },

    getRemoteEntityData: function ( id, type ) {

        return new Promise((resolve, reject) => {

            $.ajax({
                'method': 'GET',
                'dataType': 'xml',
                'url': 'https://api.openstreetmap.org/api/0.6/'+ type +'/'+ id,
                'success': (xml, jqXHR, textStatus) => {

                    var key, value,
                    parentElement = xml.getElementsByTagName(type)[0],
                    tags = xml.documentElement.getElementsByTagName('tag'),
                    version = parseInt( parentElement.getAttribute('version') ),
                    result = {
                        'version': version,
                        'tags': {},
                        'xml': xml
                    },
                    contributionKey = this.options.dataFromOSM.type +'-'+ this.options.dataFromOSM.id,
                    contributions = JSON.parse( localStorage.getItem('contributions') ) || {};

                    if ( contributions[ contributionKey ] ) {

                        if ( version >= contributions[ contributionKey ].version ) {

                            delete contributions[ contributionKey ];

                            localStorage.setItem('contributions', JSON.stringify( contributions ));
                        }
                        else {

                            this.options.dataFromOSM = contributions[ contributionKey ];
                        }
                    }

                    for (var j in tags) {

                        if ( tags[j].getAttribute ) {

                            key = tags[j].getAttribute('k');
                            value = tags[j].getAttribute('v');

                            result.tags[ key ] = value;
                        }
                    }

                    resolve(result);
                },
                'error': (jqXHR, textStatus, error) => {
                    reject();
                },
            });
        });
    },

    renderTags: function (remoteData) {

        this._remoteData = remoteData;
        this._tagList = new ContribNodeTagsListView();

        var popupTag,
        popupContent = this.options.poiLayerModel.get('popupContent'),
        re = new RegExp('{(.*?)}', 'g'),
        popupTags = popupContent.match(re);

        if ( popupTags) {

            for (var i in popupTags) {

                popupTags[i] = popupTags[i].replace( /\{(.*?)\}/g, '$1' );
                popupTag = popupTags[i];

                this._tagList.addTag({
                    'key': popupTag,
                    'value': this.options.dataFromOSM.tags[popupTag],
                    'keyReadOnly': false,
                    'valueReadOnly': false,
                });
            }
        }

        for (var key in remoteData.tags) {

            var value = remoteData.tags[ key ];

            if ( popupTags && popupTags.indexOf(key) > -1 ) {
                continue;
            }

            this._tagList.addTag({
                'key': key,
                'value': value,
                'keyReadOnly': false,
                'valueReadOnly': false,
            });
        }

        this.ui.footer.removeClass('hide');

        this.model.set('tags', this._tagList.getTags());

        this.getRegion('tagList').show( this._tagList );
    },

    onSubmit: function (e) {

        e.preventDefault();

        if ( !this._app.isLogged() ) {

            return false;
        }

        this.ui.footerButtons.prop('disabled', true);

        this.model.set('tags', this._tagList.getTags());


        var osmEdit = new OsmEditHelper(
            osmAuth({

                'oauth_consumer_key': settings.oauthConsumerKey,
                'oauth_secret': settings.oauthSecret,
                'oauth_token': this._user.get('token'),
                'oauth_token_secret': this._user.get('tokenSecret'),
            })
        );

        osmEdit.setChangesetCreatedBy(CONST.osm.changesetCreatedBy);
        osmEdit.setChangesetComment(CONST.osm.changesetComment);
        osmEdit.setId(this.model.get('id'));
        osmEdit.setType(this.model.get('type'));
        osmEdit.setVersion(this.model.get('version'));
        osmEdit.setTimestamp(this.model.get('timestamp'));
        osmEdit.setLatitude(this.model.get('lat'));
        osmEdit.setLongitude(this.model.get('lng'));
        osmEdit.setTags(this.model.get('tags'));
        osmEdit.setUid(this._user.get('osmId'));
        osmEdit.setDisplayName(this._user.get('displayName'));

        osmEdit.send()
        .then((nodeId) => {

            // var key = 'node-'+ nodeId,
            // contributions = JSON.parse( localStorage.getItem('osmEdit-contributions') ) || {};
            //
            // this.model.set('version', 0);
            //
            // contributions[ key ] = this.model.attributes;
            //
            // localStorage.setItem( 'osmEdit-contributions', JSON.stringify( contributions ) );
        })
        .catch(function (err) {
            console.error(err);
        });
    },


    sendXml: function (xml, changesetId) {

        var data,
        id = this.options.dataFromOSM.id,
        type = this.options.dataFromOSM.type,
        parentElement = xml.getElementsByTagName(type)[0],
        version = parseInt( parentElement.getAttribute('version') ),
        serializer = new XMLSerializer();

        parentElement.setAttribute('changeset', changesetId);
        parentElement.setAttribute('timestamp', new Date().toISOString());
        parentElement.setAttribute('uid', this._user.get('osmId'));
        parentElement.setAttribute('display_name', this._user.get('displayName'));
        parentElement.removeAttribute('user');

        data = serializer.serializeToString(xml);


        this._auth.xhr({

            'method': 'PUT',
            'path': '/api/0.6/'+ type +'/'+ id,
            'options': { 'header': { 'Content-Type': 'text/xml' } },
            'content': data,
        },
        (err, res) => {

            if (err) {

                var notification = new ContributionErrorNotificationView({
                    'retryCallback': this.sendXml.bind(this, xml, changesetId)
                });

                $('body').append( notification.el );

                notification.open();

                return;
            }

            this._radio.commands.execute(
                'map:updatePoiPopup',
                this.options.poiLayerModel,
                this.options.dataFromOSM
            );


            var key = this.options.dataFromOSM.type +'-'+ this.options.dataFromOSM.id,
            contributions = JSON.parse( localStorage.getItem('contributions') ) || {};

            this.options.dataFromOSM.version++;

            contributions[ key ] = this.options.dataFromOSM;

            localStorage.setItem( 'contributions', JSON.stringify( contributions ) );
        });

        this.close();
    },

    onClickAddBtn: function () {

        this._tagList.addTag();

        let scrollHeight = this.ui.column.height() +
        this._tagList.el.scrollHeight;
        this.ui.content[0].scrollTo(0, scrollHeight);
    },
});
