
import $ from 'jquery';
import Wreqr from 'backbone.wreqr';
import Marionette from 'backbone.marionette';
import settings from '../settings';
import osmAuth from 'osm-auth';
import ContributionErrorNotificationView from './contributionErrorNotification';
import OsmEditHelper from '../helper/osmEdit.js';
import CONST from '../const';
import template from '../../templates/editPoiDataColumn.ejs';
import templateField from '../../templates/editPoiDataField.ejs';


export default Marionette.LayoutView.extend({

    template: template,
    templateField: templateField,

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
        html = '',
        dataFromOSM = this.options.dataFromOSM,
        poiLayerModel = this.options.poiLayerModel,
        popupContent = poiLayerModel.get('popupContent'),
        re = new RegExp('{(.*?)}', 'g'),
        popupTags = popupContent.match(re);


        this.getRemoteEntityData( dataFromOSM.id, dataFromOSM.type, (remoteData) => {

            this._remoteData = remoteData;

            if ( popupTags) {

                for (var i in popupTags) {

                    popupTags[i] = popupTags[i].replace( /\{(.*?)\}/g, '$1' );
                    popupTag = popupTags[i];

                    html += this.templateField({

                        'tag': popupTag,
                        'value': dataFromOSM.tags[popupTag],
                        'remoteValue': '',
                    });
                }
            }

            this.ui.fields.html( html );

            html = '';

            for (var tag in remoteData.tags) {

                var value = remoteData.tags[ tag ];

                if ( popupTags && popupTags.indexOf(tag) > -1 ) {

                    continue;
                }

                html += this.templateField({

                    'tag': tag,
                    'value': value,
                    'remoteValue': '',
                });
            }

            if ( html ) {

                this.ui.fields.append( '<hr>' + html );
            }

            this.ui.footer.removeClass('hide');

            document.l10n.localizeNode( this.ui.fields[0] );
        });
    },

    getRemoteEntityData: function ( id, type, callback ) {

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

                callback( result );
            },
            'error': (jqXHR, textStatus, error) => {

                console.error('FIXME');
            },
        });
    },

    onSubmit: function (e) {

        e.preventDefault();

        if ( !this._radio.reqres.request('var', 'isLogged') ) {

            return false;
        }

        this.ui.footerButtons.prop('disabled', true);

        this.getRemoteEntityData(

            this.options.dataFromOSM.id,
            this.options.dataFromOSM.type,
            (remoteData) => {

                if ( this._remoteData.version !== remoteData.version ) {

                    this.displayConflict( remoteData );
                }
                else {

                    this.prepareXml( remoteData );
                }
            }
        );
    },

    prepareXml: function ( remoteData ) {

        var tag, value,
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
        .each((i, input) => {

            tag = $(input).data('tag');
            value = input.value;

            if ( !value ) {

                if ( typeof remoteTags[tag] != 'undefined' ) {

                    parentElement.removeChild( remoteTags[tag] );

                    delete this.options.dataFromOSM.tags[tag];
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

            this.options.dataFromOSM.tags[tag] = value;
        });


        this.getChangesetId((changesetId) => {

            this.sendXml( remoteData.xml, changesetId );
        });
    },


    displayConflict: function ( remoteData ) {

        var tag, value, newField,
        html = '';

        this._radio.commands.execute('modal:showConflict');

        this.ui.fields
        .find('.form-group')
        .each((i, field) => {

            this.displayFeedbackOnField(field, remoteData);
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

        var $input = $('input.form-control', field),
        tag = $input.data('tag'),
        value = $input.val(),
        remoteValue = remoteData.tags[tag] ? remoteData.tags[tag] : '';

        if ( value !== remoteValue ) {

            this._unresolvedConflicts++;

            $('.remote_value', field).html(

                document.l10n.getSync('editPoiDataColumn_remoteValue', {

                    'remoteValue': remoteValue ? remoteValue : '<em>'+ document.l10n.getSync('empty') +'</em>'
                })
            );

            $(field).addClass('has-warning has-feedback');
            $('.merge_feedback', field).removeClass('hide');

            $('.take_btn', field).click( this.onClickTake.bind(this, field, $input, remoteValue) );

            $('.reject_btn', field).click( this.onClickReject.bind(this, field) );
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

        var changesetId = sessionStorage.getItem('changesetId'),
        changesetXml = this._osmEdit._buildChangesetXml();

        if ( changesetId ) {

            this._osmEdit._isChangesetStillOpen(changesetId)
            .then((changesetId) => {

                callback(changesetId);
            })
            .catch((err) => {

                sessionStorage.removeItem('changesetId');
                this.getChangesetId(callback);
            });
        }
        else {

            this._osmEdit._createChangeset()
            .then((changesetId) => {

                sessionStorage.setItem('changesetId', changesetId);
                callback(changesetId);
            })
            .catch((err) => {

                console.log('ERROR on put changeset: ' + err.response);
                sessionStorage.removeItem('changesetId');
                this.getChangesetId(callback);
            });
        }
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

    onReset: function () {

        this.close();
    },
});
