

define([

    'underscore',
    'backbone',
    'marionette',
    'bootstrap',
    'templates',
    'leaflet',
    'osm-auth',
    'helper/osmEdit',
    'ui/map',
    'const',
    'settings',
    'model/poiLayer',
],
function (

    _,
    Backbone,
    Marionette,
    Bootstrap,
    templates,
    L,
    osmAuth,
    OsmEditHelper,
    MapUi,
    CONST,
    settings,
    PoiLayerModel
) {

    'use strict';

    return Marionette.LayoutView.extend({

        template: JST['contribColumn.html'],
        templateField: JST['contribField.html'],

        behaviors: {

            'l20n': {},
            'column': {},
        },

        ui: {

            'column': '#contrib_column',
            'tagList': '.rg_tag_list',
            'formGroups': '.form-group',
            'addBtn': '.add_btn',
            'removeBtn': '.remove_btn',
        },

        events: {

            'click @ui.addBtn': 'onClickAddBtn',
            'click @ui.removeBtn': 'onClickRemoveBtn',

            'submit': 'onSubmit',
        },

        initialize: function () {

            var self = this;

            this._radio = Backbone.Wreqr.radio.channel('global');
            this._user = this._radio.reqres.request('model', 'user');
        },

        setModel: function (model) {

            this.model = model;

            this.render();
        },

        _buildNewMarker: function () {

            var pos = new L.LatLng(
                this.model.get('lat'),
                this.model.get('lng')
            ),
            icon = MapUi.buildPoiLayerIcon(
                new PoiLayerModel({
                    'markerShape': settings.newPoiMarkerShape,
                    'markerIconType': CONST.map.markerIconType.library,
                    'markerIcon': settings.newPoiMarkerIcon,
                    'markerColor': settings.newPoiMarkerColor
                })
            );

            return L.marker(pos, {

                'icon': icon
            });
        },

        onBeforeOpen: function () {

            this._radio.vent.trigger('column:closeAll');
            this._radio.vent.trigger('widget:closeAll');
        },

        open: function () {

            this.triggerMethod('open');
        },

        onAfterOpen: function () {

            this._tempMarker = this._buildNewMarker();
            this._radio.reqres.request('map').addLayer(this._tempMarker);
        },

        close: function () {

            this.triggerMethod('close');
        },

        onBeforeClose: function () {

            if (this._tempMarker) {

                this._radio.reqres.request('map').removeLayer(this._tempMarker);
            }
        },

        onRender: function () {

            this.addField();
        },

        onClickAddBtn: function () {

            this.addField();
        },

        onClickRemoveBtn: function (e) {

            $(e.target).parents('.form-group').remove();
        },

        addField: function () {

            var field = $( this.templateField() ).appendTo( this.ui.tagList ).get(0);

            document.l10n.localizeNode( field );
        },

        onSubmit: function (e) {

            var self = this,
            tags = [],
            map = this._radio.reqres.request('map');

            e.preventDefault();

            this.bindUIElements();

            this.ui.formGroups.each(function () {

                var keyInput = this.querySelector('.key'),
                valueInput = this.querySelector('.value'),
                key = keyInput.value,
                value = valueInput.value,
                tag = {};

                if ( !key || !value ) {
                    return;
                }

                tag[key] = value;

                tags.push(tag);
            });

            this.model.set('tags', tags);

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
            osmEdit.setLatitude(this.model.get('lat'));
            osmEdit.setLongitude(this.model.get('lng'));
            osmEdit.setTags(this.model.get('tags'));
            osmEdit.setUid(this._user.get('osmId'));
            osmEdit.setDisplayName(this._user.get('displayName'));

            map.addLayer( this._buildNewMarker() );

            this.close();

            osmEdit.createNode()
            .then(function (nodeId) {

                var key = 'node-'+ nodeId,
                contributions = JSON.parse( localStorage.getItem('osmEdit-contributions') ) || {};

                self.model.set('version', 0);

                contributions[ key ] = self.model.attributes;

                localStorage.setItem( 'osmEdit-contributions', JSON.stringify( contributions ) );
            })
            .catch(function (err) {

                console.error(err);
            });
        },
    });
});
