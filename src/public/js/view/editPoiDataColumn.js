

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'settings',
	'osm-auth',
	'view/contributionErrorNotification',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	settings,
	osmAuth,
	ContributionErrorNotificationView
) {

	'use strict';

	return Marionette.LayoutView.extend({

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
		},

		events: {

			'submit': 'onSubmit',
			'reset': 'onReset',
		},

		initialize: function () {

			this._radio = Backbone.Wreqr.radio.channel('global');

			if ( !this._radio.reqres.request('var', 'isLogged') ) {

				return false;
			}

			var self = this;

			this._user = this._radio.reqres.request('model', 'user');

			this._auth = osmAuth({

				'oauth_consumer_key': settings.oauthConsumerKey,
				'oauth_secret': settings.oauthSecret,
				'oauth_token': this._user.get('token'),
				'oauth_token_secret': this._user.get('tokenSecret'),
			});
		},

		open: function () {

			this._radio.vent.trigger('column:closeAll');
			this._radio.vent.trigger('widget:closeAll');

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

				for (var i in popupTags) {

					popupTags[i] = popupTags[i].replace( /\{(.*?)\}/g, '$1' );
					popupTag = popupTags[i];

					html += self.templateField({

						'tag': popupTag,
						'value': dataFromOSM.tags[popupTag],
						'remoteValue': dataFromOSM.tags[popupTag],
					});
				}

				self.ui.fields.html( html );

				html = '';

				for (var tag in remoteData.tags) {

					var value = remoteData.tags[ tag ];

					if ( popupTags.indexOf(tag) > -1 ) {

						continue;
					}

					html += self.templateField({

						'tag': tag,
						'value': value,
						'remoteValue': value,
					});
				}

				if ( html ) {

					self.ui.fields.append( '<hr>' + html );
				}

				self.ui.footer.removeClass('hide');
			});
		},

		getRemoteEntityData: function ( id, type, callback ) {

			$.ajax({

				'method': 'GET',
				'dataType': 'xml',
				'url': 'https://api.openstreetmap.org/api/0.6/'+ type +'/'+ id,
				'success': function (xml, jqXHR, textStatus) {

					var key, value,
					parentElement = xml.getElementsByTagName(type)[0],
					tags = xml.documentElement.getElementsByTagName('tag'),
					result = {

						'version': parseInt( parentElement.getAttribute('version') ),
						'tags': {},
						'xml': xml
					};


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

			if ( !this._radio.reqres.request('var', 'isLogged') ) {

				return false;
			}

			e.preventDefault();

			var self = this,
			dataFromOSM = this.options.dataFromOSM,
			newTags = {};


			this.ui.fields
			.find('input')
			.each(function (i, input) {

				var tag = $(input).data('tag');

				newTags[tag] = input.value;
			});


			this.getRemoteEntityData( dataFromOSM.id, dataFromOSM.type, function (remoteData) {

				var value, key,
				parentElement = remoteData.xml.getElementsByTagName(dataFromOSM.type)[0],
				tags = remoteData.xml.documentElement.getElementsByTagName('tag'),
				remoteTags = {};

				for (var i in tags) {

					if ( tags[i].getAttribute ) {

						remoteTags[ tags[i].getAttribute('k') ] = tags[i];
					}
				}

				for (key in newTags) {

					value = newTags[key];

					if ( !value ) {

						if ( typeof remoteTags[key] != 'undefined' ) {

							parentElement.removeChild( remoteTags[key] );

							delete self.options.dataFromOSM.tags[key];
						}

						continue;
					}

					if ( remoteTags[key] ) {

						remoteTags[key].setAttribute('v', value);
					}
					else {

						var newTag = remoteData.xml.createElement('tag');

						newTag.setAttribute('k', key);
						newTag.setAttribute('v', value);

						parentElement.appendChild(newTag);
					}

					self.options.dataFromOSM.tags[key] = value;
				}

				self.getChangesetId(function (changesetId) {

					self.sendXml( remoteData.xml, changesetId );
				});
			});
		},

		getChangesetId: function ( callback ) {

			var self = this,
			changesetId = sessionStorage.getItem('changesetId'),
			xmlChangeset = '<osm><changeset><tag k="created_by" v="Rudomap"/><tag k="comment" v="Test from Rudomap (developpement in progress)"/></changeset></osm>';

			if ( changesetId ) {

				this._auth.xhr({

					'method': 'GET',
					'path': '/api/0.6/changeset/'+ changesetId,
					'options': { 'header': { 'Content-Type': 'text/xml' } }
				},
				function(err, xml) {

					if (err) {

						sessionStorage.removeItem('changesetId');

						self.getChangesetId( callback );

						return;
					}

					callback(changesetId);
				});
			}
			else {

				this._auth.xhr({

					'method': 'PUT',
					'path': '/api/0.6/changeset/create',
					'options': { 'header': { 'Content-Type': 'text/xml' } },
					'content': xmlChangeset
				},
				function(err, changesetId) {

					if (err) {

						console.log('ERROR on put changeset: ' + err.response);
						return;
					}

					sessionStorage.setItem('changesetId', changesetId);

					callback(changesetId);
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
			parentElement.removeAttribute('user', this._user.get('displayName'));

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
			});

			this.close();
		},

		onReset: function () {

			this.close();
		},
	});
});
