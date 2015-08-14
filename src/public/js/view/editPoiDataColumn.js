

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
			'footerButtons': '.sticky-footer button',
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

			this._unresolvedConflicts = 0;

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
						'remoteValue': '',
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
						'remoteValue': '',
					});
				}

				if ( html ) {

					self.ui.fields.append( '<hr>' + html );
				}

				self.ui.footer.removeClass('hide');

				document.l10n.localizeNode( self.ui.fields[0] );
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

					document.l10n.getSync('editPoiDataColumn_remoteValue', {

						'remoteValue': remoteValue ? remoteValue : '<em>'+ document.l10n.getSync('empty') +'</em>'
					})
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

					var isOpened = xml.getElementsByTagName('changeset')[0].getAttribute('open');

					if (isOpened === "false") {

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
