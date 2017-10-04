import Backbone from 'backbone';
import 'backbone-relational';
import CONST from '../const';

import ThemeCore from 'core/theme';

import LayerCollection from '../collection/layer';
import PresetCollection from '../collection/preset';
import PresetCategoryCollection from '../collection/presetCategory';
import TagCollection from '../collection/tag';

import Layer from './layer';
import Preset from './preset';
import PresetCategory from './presetCategory';
import Tag from './tag';

export default Backbone.RelationalModel.extend({
  idAttribute: '_id',

  urlRoot: `${CONST.apiPath}/theme`,

  relations: [
    {
      type: Backbone.HasMany,
      key: 'layers',
      relatedModel: Layer,
      collectionType: LayerCollection
    },
    {
      type: Backbone.HasMany,
      key: 'presets',
      relatedModel: Preset,
      collectionType: PresetCollection
    },
    {
      type: Backbone.HasMany,
      key: 'presetCategories',
      relatedModel: PresetCategory,
      collectionType: PresetCategoryCollection
    },
    {
      type: Backbone.HasMany,
      key: 'tags',
      relatedModel: Tag,
      collectionType: TagCollection
    }
  ],

  defaults() {
    return {
      creationDate: new Date().toISOString(),
      modificationDate: new Date().toISOString(),
      userId: undefined,
      fragment: undefined,
      name: 'MapContrib',
      description: '',
      color: 'blue',
      tiles: ['osm', 'mapboxStreetsSatellite', 'watercolor', 'osmMonochrome'],
      zoomLevel: 3,
      autoCenter: false,
      center: {
        lat: 33.57,
        lng: 1.58
      },
      owners: [],
      osmOwners: [],
      geocoder: undefined,
      infoDisplay: CONST.infoDisplay.column,
      analyticScript: '',

      locales: {
        /*
                fr: {
                    name: '',
                    description: '',
                }
            */
      }
    };
  },

  localizedAttributes: ['name', 'description'],

  initialize() {
    if (!this.get('geocoder')) {
      if (typeof window !== 'undefined' && typeof MAPCONTRIB !== 'undefined') {
        this.set('geocoder', CONST.geocoder[MAPCONTRIB.config.defaultGeocoder]);
      }
    }

    this.listenTo(
      this.get('presetCategories'),
      'destroy',
      this._onPresetCategoryDestroy
    );
  },

  _onPresetCategoryDestroy(model) {
    const modelsToDestroy = [
      ...this.get('presets').where({ parentUuid: model.get('uuid') }),
      ...this.get('presetCategories').where({ parentUuid: model.get('uuid') })
    ];

    for (const modelToDestroy of modelsToDestroy) {
      modelToDestroy.destroy();
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
    const userId = userModel.get('_id');
    const osmId = userModel.get('osmId');

    if (!userId && !osmId) {
      return false;
    }

    return ThemeCore.isThemeOwner(this.toJSON(), userId, osmId);
  },

  getLocaleCompletion(localeCode) {
    const locale = this.get('locales')[localeCode];
    const data = {
      items: this.localizedAttributes.length,
      completed: 0
    };

    if (!locale) {
      return data;
    }

    for (const attribute of this.localizedAttributes) {
      if (locale[attribute]) {
        data.completed += 1;
      }
    }

    return data;
  }
});
