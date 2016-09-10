
import Backbone from 'backbone';
import 'backbone-relational';
import Diacritics from 'diacritic';
import CONST from 'const';

import LayerCollection from '../collection/layer';
import PresetCollection from '../collection/preset';
import TagCollection from '../collection/tag';

import Layer from './layer';
import Preset from './preset';
import Tag from './tag';


export default Backbone.RelationalModel.extend({
    idAttribute: '_id',

    urlRoot: CONST.apiPath + 'theme',

    relations: [
        {
            'type': Backbone.HasMany,
            'key': 'layers',
            'relatedModel': Layer,
            'collectionType': LayerCollection,
        },
        {
            'type': Backbone.HasMany,
            'key': 'presets',
            'relatedModel': Preset,
            'collectionType': PresetCollection,
        },
        {
            'type': Backbone.HasMany,
            'key': 'tags',
            'relatedModel': Tag,
            'collectionType': TagCollection,
        },
    ],

    defaults() {
        return {
            'creationDate': new Date().toISOString(),
            'modificationDate': new Date().toISOString(),
            'userId': undefined,
            'name': 'MapContrib',
            'description': '',
            'color': 'blue',
            'tiles': ['osmFr'],
            'zoomLevel': 3,
            'autoCenter': false,
            'center': {
                'lat': 33.57,
                'lng': 1.58,
            },
            'owners': [],
            'geocoder': undefined,
            'infoDisplay': CONST.infoDisplay.popup,
            'analyticScript': '',
        };
    },

    initialize() {
        if (!this.get('geocoder')) {
            if (typeof window !== 'undefined' && typeof MAPCONTRIB !== 'undefined') {
                this.set(
                    'geocoder',
                    CONST.geocoder[ MAPCONTRIB.config.defaultGeocoder ]
                );
            }
        }
    },

    updateModificationDate() {
        this.set('modificationDate', new Date().toISOString());
    },

    /**
     * Check if a user is owner of this theme.
     *
     * @author Guillaume AMAT
     * @access public
     * @param {object} userModel - A user model
     * @return boolean
     */
    isOwner(userModel) {
        let userId = userModel.get('_id');

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
    buildWebLinkName() {
        let name = this.get('name') || '';

        name = Diacritics.clean(name);
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
    buildPath() {
        const basePath = `/t/${this.get('fragment')}`;
        const webName = this.buildWebLinkName();

        if (webName) {
            return `${basePath}-${webName}`;
        }
        else {
            return basePath;
        }
    }
});
