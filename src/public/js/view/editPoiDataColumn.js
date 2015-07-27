

define([

	'underscore',
	'backbone',
	'marionette',
	'bootstrap',
	'templates',
	'settings',
	'osm-auth',
],
function (

	_,
	Backbone,
	Marionette,
	Bootstrap,
	templates,
	settings,
	osmAuth
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

			var self = this,
			user = this._radio.reqres.request('model', 'user');

			this._auth = osmAuth({

				'oauth_consumer_key': settings.oauthConsumerKey,
				'oauth_secret': settings.oauthSecret,
				'oauth_token': user.get('token'),
				'oauth_token_secret': user.get('tokenSecret'),
			});
		},

		open: function () {

			this._radio.vent.trigger('column:closeAll');

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

			var tag,
			self = this,
			html = '',
			dataFromOSM = this.options.dataFromOSM,
			poiLayerModel = this.options.poiLayerModel,
			popupContent = poiLayerModel.get('popupContent'),
			re = new RegExp('{(.*?)}', 'g'),
			tags = popupContent.match(re);

			for (var i in tags) {

				tag = tags[i].replace( /\{(.*?)\}/g, '$1' );

				html += this.templateField({

					'tag': tag,
					'value': dataFromOSM.tags[tag],
				});
			}

			this.ui.fields.html( html );
		},

		onSubmit: function (e) {

			if ( !this._radio.reqres.request('var', 'isLogged') ) {

				return false;
			}

			e.preventDefault();

			var self = this,
			newTags = {};


			this.ui.fields
			.find('input')
			.each(function (i, input) {

				var tag = $(input).data('tag');

				newTags[tag] = input.value;
			});


			$.ajax({

				'method': 'GET',
				'dataType': 'xml',
				'url': 'https://api.openstreetmap.org/api/0.6/node/'+ this.options.dataFromOSM.id,
				'success': function (nodeXml, jqXHR, textStatus) {

					var oldTags = {},
					parentNode = nodeXml.getElementsByTagName('node')[0],
					tags = nodeXml.documentElement.getElementsByTagName('tag');

					for (var j in tags) {

						if ( !tags[j].getAttribute ) {

							continue;
						}

						oldTags[ tags[j].getAttribute('k') ] = tags[j];
					}

					for (var k in newTags) {

						if ( !newTags[k] ) {

							if ( oldTags[k] ) {

								parentNode.removeChild( oldTags[k] );

								delete self.options.dataFromOSM.tags[k];
							}

							continue;
						}

						if ( oldTags[k] ) {

							oldTags[k].setAttribute('v', newTags[k]);
						}
						else {

							var newTag = nodeXml.createElement('tag');

							newTag.setAttribute('k', k);
							newTag.setAttribute('v', newTags[k]);

							parentNode.appendChild(newTag);
						}

						self.options.dataFromOSM.tags[k] = newTags[k];
					}

					self.sendNewXml( nodeXml );
				},
				'error': function (jqXHR, textStatus, error) {

					console.error('FIXME');
				},
			});
		},

		sendNewXml: function (nodeXml) {

			var self = this,
			changesetId = sessionStorage.getItem('changesetId'),
			xmlChangeset = '<osm><changeset><tag k="created_by" v="Rudomap"/><tag k="comment" v="Test from Rudomap (developpement in progress)"/></changeset></osm>';

			if ( changesetId ) {

				this.sendXml(nodeXml, changesetId);
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

					self.sendXml(nodeXml, changesetId);
				});
			}
		},

		sendXml: function (nodeXml, changesetId) {

			var data,
			self = this,
			node = nodeXml.documentElement.getElementsByTagName('node')[0],
			serializer = new XMLSerializer();

			node.setAttribute('changeset', changesetId);

			data = serializer.serializeToString(nodeXml);


			this._auth.xhr({

				'method': 'PUT',
				'path': '/api/0.6/node/'+ this.options.dataFromOSM.id,
				'options': { 'header': { 'Content-Type': 'text/xml' } },
				'content': data,
			},
			function(err, res) {

				if (err) {

					console.log('ERROR on put node/way : '+ err.response);
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
