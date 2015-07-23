

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

			var self = this;

			this._radio = Backbone.Wreqr.radio.channel('global');

			if ( !this._radio.reqres.request('var', 'isLogged') ) {

				return false;
			}
		},

		open: function () {

			this._radio.vent.trigger('column:closeAll');

			this.triggerMethod('open');
		},

		close: function () {

			this.triggerMethod('close');
		},

		onRender: function () {

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
			newTags = {},
			nodeId = this.options.dataFromOSM.id;


			this.ui.fields
			.find('input')
			.each(function (i, input) {

				var tag = $(input).data('tag');

				newTags[tag] = input.value;
			});


			$.ajax({

				'method': 'GET',
				'dataType': 'xml',
				'url': 'https://api.openstreetmap.org/api/0.6/node/'+ nodeId,
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
					}

					self.onNodeXmlReceived( nodeXml );
				},
				'error': function (jqXHR, textStatus, error) {

					console.error('FIXME');
				},
			});
		},

		onNodeXmlReceived: function (nodeXml) {

			var self = this,
			nodeId = this.options.dataFromOSM.id,
			user = this._radio.reqres.request('model', 'user'),
			auth = osmAuth({

				'oauth_consumer_key': settings.oauthConsumerKey,
				'oauth_secret': settings.oauthSecret,
				'oauth_token': user.get('token'),
				'oauth_token_secret': user.get('tokenSecret'),
			}),
			xmlChangeset = '<osm><changeset><tag k="created_by" v="Rudomap"/><tag k="comment" v="Test from Rudomap (developpement in progress)"/></changeset></osm>';


			auth.xhr({

				'method': 'PUT',
				'path': '/api/0.6/changeset/create',
				'options': { 'header': { 'Content-Type': 'text/xml' } },
				'content': xmlChangeset
			},
			function(err, res) {

				if (err) {

					console.log('ERROR on put changeset: ' + err.response);
					return;
				}

				var data,
				changesetId = res,
				node = nodeXml.documentElement.getElementsByTagName('node')[0],
				serializer = new XMLSerializer();

				node.setAttribute('changeset', changesetId);

				data = serializer.serializeToString(nodeXml);


				auth.xhr({

					'method': 'PUT',
					'path': '/api/0.6/node/'+ nodeId,
					'options': { 'header': { 'Content-Type': 'text/xml' } },
					'content': data,
				},
				function(err, res) {

					if (err) {

						console.log('ERROR on put node/way : '+ err.response);
						return;
					}

					auth.xhr({

						'method': 'PUT',
						'path': '/api/0.6/changeset/'+ changesetId +'/close',
					},
					function(err, res) {

						if (err) {

							console.log('ERROR on put changeset/close : '+ err.response);
							return;
						}
						else {

							console.log("Successfully modification of an OSM object !");
						}
					});
				});
			});


			this.close();
		},

		onReset: function () {

			this.close();
		},
	});
});
