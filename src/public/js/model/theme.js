

define([

    'underscore',
    'backbone',
    '../settings',
],
function (

    _,
    Backbone,
    settings
) {

    'use strict';

    return Backbone.Model.extend({

        idAttribute: '_id',

        urlRoot: settings.apiPath + 'theme',

        defaults: {

            'userId': undefined,
            'name': undefined,
            'description': undefined,
            'color': 'blue',
            'tiles': ['osm'],
            'zoomLevel': undefined,
            'center': {

                'lat': undefined,
                'lng': undefined,
            },
            'owners': [],
        },

        /**
         * Check if a user is owner of this theme.
         *
         * @author Guillaume AMAT
         * @param userModel - A user model
         * @return boolean
         */
        isOwner: function (userModel) {

            var userId = userModel.get('_id');

            if ( this.get('owners').indexOf( userId ) > -1 ) {

                return true;
            }

            if ( this.get('owners').indexOf('*') > -1 ) {

                return true;
            }

            return false;
        }
    });
});
