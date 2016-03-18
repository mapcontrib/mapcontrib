
'use strict';


var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var Wreqr = require('backbone.wreqr');
var Marionette = require('backbone.marionette');
var JST = require('../../templates/templates');
var settings = require('../settings');
var osmAuth = require('osm-auth');
var ContributionErrorNotificationView = require('./contributionErrorNotification');
var OsmEditHelper = require('../helper/osmEdit');
var CONST = require('../const');


module.exports = Marionette.LayoutView.extend({

    template: JST['editPoiDataColumn.html'],
    templateField: JST['editPoiDataField.html'],

    behaviors: {

        'l20n': {},
        'column': {},
    },

    ui: {

        'column': '#edit_poi_data_column',
        'fields': '.fields',
        'footer': '.sticky-footer',
        'footerButtons': '.sticky-footer button',
    },

    events: {

        'submit': 'onSubmit',
        'reset': 'onReset',
    },

    initialize: function () {

        this._radio = Wreqr.radio.channel('global');

        if ( !this._radio.reqres.request('var', 'isLogged') ) {

            return false;
        }

        var self = this;

        this._user = this._radio.reqres.request('model', 'user');

        this._unresolvedConflicts = 0;

        this._auth = osmAuth({

            'oauth_consumer_key': settings.oauthConsumerKey,
            'oauth_secret': settings.oauthSecret,
            'oauth_token': this._user.get('token'),
            'oauth_token_secret': this._user.get('tokenSecret'),
        });

        this._osmEdit = new OsmEditHelper( this._auth );
        this._osmEdit.setChangesetCreatedBy(CONST.osm.changesetCreatedBy);
        this._osmEdit.setChangesetComment(CONST.osm.changesetComment);
        this._osmEdit.setUid(this._user.get('osmId'));
        this._osmEdit.setDisplayName(this._user.get('displayName'));
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

        if ( !this._radio.reqres.request('var', 'isLogged') ) {

            return this;
        }

        var popupTag,
        self = this,
        html = '',
        dataFromOSM = this.options.dataFromOSM,
        poiLayerModel = this.options.poiLayerModel,
        popupContent = poiLayerModel.get('popupContent'),
        re = new RegExp('{(.*?)}', 'g'),
        popupTags = popupContent.match(re);


        this.getRemoteEntityData( dataFromOSM.id, dataFromOSM.type, function (remoteData) {

            self._remoteData = remoteData;

            if ( popupTags) {

                for (var i in popupTags) {

                    popupTags[i] = popupTags[i].replace( /\{(.*?)\}/g, '$1' );
                    popupTag = popupTags[i];

                    html += self.templateField({

                        'tag': popupTag,
                        'value': dataFromOSM.tags[popupTag],
                        'remoteValue': '',
                    });
                }
            }

            self.ui.fields.html( html );

            html = '';

            for (var tag in remoteData.tags) {

                var value = remoteData.tags[ tag ];

                if ( popupTags && popupTags.indexOf(tag) > -1 ) {

                    continue;
                }

                html += self.templateField({

                    'tag': tag,
                    'value': value,
                    'remoteValue': '',
                });
            }

            if ( html ) {

                self.ui.fields.append( '<hr>' + html );
            }

            self.ui.footer.removeClass('hide');

            // document.l10n.localizeNode( self.ui.fields[0] );
        });
    },

    getRemoteEntityData: function ( id, type, callback ) {

        var self = this;

        $.ajax({

            'method': 'GET',
            'dataType': 'xml',
            'url': 'https://api.openstreetmap.org/api/0.6/'+ type +'/'+ id,
            'success': function (xml, jqXHR, textStatus) {

                var key, value,
                parentElement = xml.getElementsByTagName(type)[0],
                tags = xml.documentElement.getElementsByTagName('tag'),
                version = parseInt( parentElement.getAttribute('version') ),
                result = {

                    'version': version,
                    'tags': {},
                    'xml': xml
                },
                contributionKey = self.options.dataFromOSM.type +'-'+ self.options.dataFromOSM.id,
                contributions = JSON.parse( localStorage.getItem('contributions') ) || {};

                if ( contributions[ contributionKey ] ) {

                    if ( version >= contributions[ contributionKey ].version ) {

                        delete contributions[ contributionKey ];

                        localStorage.setItem('contributions', JSON.stringify( contributions ));
                    }
                    else {

                        self.options.dataFromOSM = contributions[ contributionKey ];
                    }
                }


                for (var j in tags) {

                    if ( tags[j].getAttribute ) {

                        key = tags[j].getAttribute('k');
                        value = tags[j].getAttribute('v');

                        result.tags[ key ] = value;
                    }
                }

                callback( result );
            },
            'error': function (jqXHR, textStatus, error) {

                console.error('FIXME');
            },
        });
    },

    onSubmit: function (e) {

        var self = this;

        e.preventDefault();

        if ( !this._radio.reqres.request('var', 'isLogged') ) {

            return false;
        }

        this.ui.footerButtons.prop('disabled', true);

        this.getRemoteEntityData(

            this.options.dataFromOSM.id,
            this.options.dataFromOSM.type,
            function (remoteData) {

                if ( self._remoteData.version !== remoteData.version ) {

                    self.displayConflict( remoteData );
                }
                else {

                    self.prepareXml( remoteData );
                }
            }
        );
    },

    prepareXml: function ( remoteData ) {

        var tag, value,
        self = this,
        parentElement = remoteData.xml.getElementsByTagName(this.options.dataFromOSM.type)[0],
        tags = remoteData.xml.documentElement.getElementsByTagName('tag'),
        remoteTags = {};

        for (var i in tags) {

            if ( tags[i].getAttribute ) {

                remoteTags[ tags[i].getAttribute('k') ] = tags[i];
            }
        }

        this.ui.fields
        .find('input.form-control')
        .each(function (i, input) {

            tag = $(input).data('tag');
            value = input.value;

            if ( !value ) {

                if ( typeof remoteTags[tag] != 'undefined' ) {

                    parentElement.removeChild( remoteTags[tag] );

                    delete self.options.dataFromOSM.tags[tag];
                }

                return;
            }

            if ( remoteTags[tag] ) {

                remoteTags[tag].setAttribute('v', value);
            }
            else {

                var newTag = remoteData.xml.createElement('tag');

                newTag.setAttribute('k', tag);
                newTag.setAttribute('v', value);

                parentElement.appendChild(newTag);
            }

            self.options.dataFromOSM.tags[tag] = value;
        });


        this.getChangesetId(function (changesetId) {

            self.sendXml( remoteData.xml, changesetId );
        });
    },


    displayConflict: function ( remoteData ) {

        var tag, value, newField,
        self = this,
        html = '';

        this._radio.commands.execute('modal:showConflict');

        this.ui.fields
        .find('.form-group')
        .each(function (i, field) {

            self.displayFeedbackOnField(field, remoteData);
        });


        for (tag in remoteData.tags) {

            value = remoteData.tags[ tag ];

            if ( this._remoteData.tags[tag] ) {

                continue;
            }

            html = this.templateField({

                'tag': tag,
                'value': '',
                'remoteValue': value,
            });

            newField = $( html ).appendTo( this.ui.fields );

            this.displayFeedbackOnField(newField, remoteData);
        }

        this._remoteData = remoteData;

        if ( this._unresolvedConflicts === 0 ) {

            this.ui.footerButtons.prop('disabled', false);
        }
    },


    displayFeedbackOnField: function (field, remoteData) {

        var self = this,
        $input = $('input.form-control', field),
        tag = $input.data('tag'),
        value = $input.val(),
        remoteValue = remoteData.tags[tag] ? remoteData.tags[tag] : '';

        if ( value !== remoteValue ) {

            this._unresolvedConflicts++;

            $('.remote_value', field).html(

                // document.l10n.getSync('editPoiDataColumn_remoteValue', {
                //
                //     'remoteValue': remoteValue ? remoteValue : '<em>'+ // document.l10n.getSync('empty') +'</em>'
                // })
            );

            $(field).addClass('has-warning has-feedback');
            $('.merge_feedback', field).removeClass('hide');

            $('.take_btn', field).click( self.onClickTake.bind(this, field, $input, remoteValue) );

            $('.reject_btn', field).click( self.onClickReject.bind(this, field) );
        }
    },


    onClickTake: function (field, $input, remoteValue) {

        $input.val(remoteValue);

        $(field).removeClass('has-warning has-feedback');
        $('.merge_feedback', field).addClass('hide');

        if ( --this._unresolvedConflicts === 0 ) {

            this.ui.footerButtons.prop('disabled', false);
        }
    },


    onClickReject: function (field) {

        $(field).removeClass('has-warning has-feedback');
        $('.merge_feedback', field).addClass('hide');

        if ( --this._unresolvedConflicts === 0 ) {

            this.ui.footerButtons.prop('disabled', false);
        }
    },


    getChangesetId: function ( callback ) {

        var self = this,
        changesetId = sessionStorage.getItem('changesetId'),
        changesetXml = this._osmEdit._buildChangesetXml();

        if ( changesetId ) {

            this._osmEdit._isChangesetStillOpen(changesetId)
            .then(function (changesetId) {

                callback(changesetId);
            })
            .catch(function (err) {

                sessionStorage.removeItem('changesetId');
                self.getChangesetId(callback);
            });
        }
        else {

            this._osmEdit._createChangeset()
            .then(function (changesetId) {

                sessionStorage.setItem('changesetId', changesetId);
                callback(changesetId);
            })
            .catch(function (err) {

                console.log('ERROR on put changeset: ' + err.response);
                sessionStorage.removeItem('changesetId');
                self.getChangesetId(callback);
            });
        }
    },

    sendXml: function (xml, changesetId) {

        var data,
        self = this,
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
        function(err, res) {

            if (err) {

                var notification = new ContributionErrorNotificationView({ 'retryCallback': self.sendXml.bind(self, xml, changesetId) });

                $('body').append( notification.el );

                notification.open();

                return;
            }

            self._radio.commands.execute('map:updatePoiPopup', self.options.poiLayerModel, self.options.dataFromOSM);


            var key = self.options.dataFromOSM.type +'-'+ self.options.dataFromOSM.id,
            contributions = JSON.parse( localStorage.getItem('contributions') ) || {};

            self.options.dataFromOSM.version++;

            contributions[ key ] = self.options.dataFromOSM;

            localStorage.setItem( 'contributions', JSON.stringify( contributions ) );
        });

        this.close();
    },

    onReset: function () {

        this.close();
    },
});
