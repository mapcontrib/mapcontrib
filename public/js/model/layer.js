import Backbone from 'backbone';
import 'backbone-relational';
import Wreqr from 'backbone.wreqr';
import CONST from '../const';
import { uuid } from '../core/utils';

export default Backbone.RelationalModel.extend({
  defaults() {
    return {
      creationDate: new Date().toISOString(),
      modificationDate: new Date().toISOString(),
      uuid: undefined,
      type: CONST.layerType.overpass,
      name: undefined,
      description: undefined,
      visible: true,
      minZoom: 14,
      popupContent: undefined,
      order: undefined,

      // Point based layer specific
      rootLayerType: CONST.rootLayerType.markerCluster,
      markerShape: 'marker2',
      markerColor: 'green',
      markerIconType: CONST.map.markerIconType.library,
      markerIcon: undefined,
      markerIconUrl: undefined,
      heatMinOpacity: 0.05,
      heatMaxZoom: 18,
      heatMax: 1.0,
      heatBlur: 15,
      heatRadius: 25,

      // Shape files based layer specific
      fileUri: undefined,

      // Overpass type specific
      overpassRequest: undefined,
      cache: false,
      cacheUpdateSuccess: undefined,
      cacheUpdateSuccessDate: undefined,
      cacheUpdateDate: undefined,
      cacheUpdateError: undefined,
      cacheBounds: undefined,
      cacheArchive: false,
      cacheDeletedFeatures: [],

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

  localizedAttributes: ['name', 'description', 'popupContent'],

  // GeoJSON objects displayed on the map
  _geoJsonObjects: {},

  initialize() {
    this._radio = Wreqr.radio.channel('global');

    if (!this.get('uuid')) {
      this.set('uuid', uuid());
    }
  },

  updateModificationDate() {
    this.set('modificationDate', new Date().toISOString());
  },

  /**
     * Tells if the layer is visible.
     *
     * @author Guillaume AMAT
     * @return boolean
     */
  isVisible() {
    const isOwner = this._radio.reqres.request('user:isOwner');

    if (isOwner) {
      return true;
    }

    return this.get('visible');
  },

  /**
     * Merges the objects with the current displayed GeoJSON objects.
     *
     * @author Guillaume AMAT
     * @param {object} objects - GeoJSON objects
     */
  addObjects(objects) {
    this._geoJsonObjects = {
      ...this._geoJsonObjects,
      ...objects
    };
  },

  getObjects() {
    return this._geoJsonObjects;
  },

  getArchivedDeletedPois() {
    return this.get('cacheDeletedFeatures').filter(
      feature => feature.isArchived === true
    );
  },

  getWaitingDeletedPois() {
    return this.get('cacheDeletedFeatures').filter(
      feature => feature.isArchived !== true
    );
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
