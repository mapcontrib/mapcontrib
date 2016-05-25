
var _ = require('underscore');
var Backbone = require('backbone');
var settings = require('../settings');


module.exports = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: settings.apiPath + 'theme',

    defaults: {
        'userId': undefined,
        'name': 'MapContrib',
        'description': '',
        'color': 'blue',
        'tiles': ['osmFr'],
        'zoomLevel': 3,
        'center': {

            'lat': 33.57,
            'lng': 1.58,
        },
        'owners': [],
    },

    /**
     * Check if a user is owner of this theme.
     *
     * @author Guillaume AMAT
     * @access public
     * @param {object} userModel - A user model
     * @return boolean
     */
    isOwner: function (userModel) {
        var userId = userModel.get('_id');

        if ( !userId ) {
            return false;
        }

        if ( this.get('userId') === userId ) {
            return true;
        }

        if ( this.get('owners').indexOf( userId ) > -1 ) {
            return true;
        }

        if ( this.get('owners').indexOf('*') > -1 ) {
            return true;
        }

        return false;
    },

    /**
     * Returns a URL-friendly name of the theme.
     *
     * @author Guillaume AMAT
     * @access public
     * @return string
     */
    buildWebLinkName: function () {
        var name = this.get('name') || '';

        name = name.replace(/-/g, '_');
        name = name.replace(/ /g, '_');
        name = name.replace(/_{2,}/g, '_');
        name = name.replace(/[^a-zA-Z0-9\_]/g, '');

        return name;
    },

    /**
     * Returns the theme path.
     *
     * @author Guillaume AMAT
     * @access public
     * @return string
     */
    buildPath: function () {
        return '/t/' +
        this.get('fragment') +
        '-' +
        this.buildWebLinkName();
    }
});
