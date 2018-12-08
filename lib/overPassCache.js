import config from 'config';
import path from 'path';
import fs from 'fs-extra';
import osmtogeojson from 'osmtogeojson';
import request from 'request';
import isEqual from 'lodash.isequal';
import logger from '../lib/logger';
import SERVER_CONST from '../const';
import PUBLIC_CONST from '../public/js/const';
import OverPassHelper from '../public/js/helper/overPass';
import GeoUtils from '../public/js/core/geoUtils';
import LayerModel from '../public/js/model/layer';

const CONST = { ...SERVER_CONST, ...PUBLIC_CONST };

export default class OverPassCache {
  constructor(db) {
    this._db = db;
    this._tooManyRequestsTriesInARow = 0;
  }

  process(theme, layer, next, retry, setSuccess, setError) {
    logger.debug('process');

    if (layer.type !== CONST.layerType.overpass) {
      return next();
    }

    if (layer.cache === false) {
      return next();
    }

    logger.info('Next request');
    logger.info('Theme fragment:', theme.fragment);
    logger.info('Layer uuid:', layer.uuid);

    const layerModel = new LayerModel(layer);
    const bounds = GeoUtils.zoomLatLngWidthHeightToBbox(
      theme.zoomLevel,
      theme.center.lat,
      theme.center.lng,
      3840,
      2160
    );

    const url = OverPassHelper.buildUrlForCache(
      config.get('client.overPassEndPoint'),
      layerModel.get('overpassRequest'),
      config.get('client.overPassCacheFileSize'),
      bounds
    );

    OverPassCache._retrieveData(url)
      .then(data => {
        let overPassGeoJson = osmtogeojson(data);
        const fragment = theme.fragment;
        const layerUuid = layerModel.get('uuid');

        if (OverPassCache.isCacheArchiveEnabled(layerModel)) {
          OverPassCache._findAndSaveNewFeatures(
            fragment,
            layerUuid,
            overPassGeoJson
          );

          const oldGeoJson = OverPassCache._readOldCacheFile(
            fragment,
            layerUuid
          );
          const modifiedFeatures =
            OverPassCache._readStateCacheFile(
              fragment,
              layerUuid,
              'modified'
            ) || [];
          const deletedFeatures =
            OverPassCache._readStateCacheFile(fragment, layerUuid, 'deleted') ||
            [];
          const archivedFeatures =
            OverPassCache._readStateCacheFile(
              fragment,
              layerUuid,
              'archived'
            ) || [];

          const modifiedFeaturesIds = modifiedFeatures.map(
            feature => feature.id
          );
          const deletedFeaturesIds = deletedFeatures.map(feature => feature.id);
          const archivedFeaturesIds = archivedFeatures.map(
            feature => feature.id
          );

          overPassGeoJson.features = overPassGeoJson.features.map(feature => {
            if (archivedFeaturesIds.indexOf(feature.id) > -1) {
              return archivedFeatures.find(f => f.id === feature.id);
            }

            if (deletedFeaturesIds.indexOf(feature.id) > -1) {
              return deletedFeatures.find(f => f.id === feature.id);
            }

            if (oldGeoJson && modifiedFeaturesIds.indexOf(feature.id) > -1) {
              return oldGeoJson.features.find(f => f.id === feature.id);
            }

            return feature;
          });
        }

        OverPassCache._saveCacheFile(
          theme.fragment,
          layerModel.get('uuid'),
          overPassGeoJson
        )
          .then(savedFilePath =>
            setSuccess(theme, layer, bounds, savedFilePath)
          )
          .then(next)
          .catch(next);
      })
      .catch(reason => {
        const { status, body } = reason;

        if (status === 429) {
          this._tooManyRequestsTriesInARow += 1;
          const maxTries = CONST.overPassCron.tooManyRequestsTriesInARow;

          logger.warn(
            `OverPass says: Too many requests... (${
              this._tooManyRequestsTriesInARow
            })`
          );

          if (this._tooManyRequestsTriesInARow < maxTries) {
            logger.info('Retrying in a few seconds');
            return retry(theme, layer);
          }

          logger.error('Impossible to finish the update of the OverPass cache');
          logger.error(
            `OverPass said « Too many requests » ${
              this._tooManyRequestsTriesInARow
            } times`
          );

          this._db.close();

          return process.exit(1);
        }

        this._tooManyRequestsTriesInARow = 0;

        if (status === 400) {
          logger.warn('OverPass says: Bad request');

          return OverPassCache._deleteCacheFile(
            theme.fragment,
            layerModel.get('uuid')
          )
            .then(setError(theme, layer, CONST.overPassCacheError.badRequest))
            .then(next)
            .catch(next);
        } else if (status === 524) {
          logger.warn('Request timed out');

          return OverPassCache._deleteCacheFile(
            theme.fragment,
            layerModel.get('uuid')
          )
            .then(setError(theme, layer, CONST.overPassCacheError.timeout))
            .then(next)
            .catch(next);
        }

        if (status !== 200) {
          logger.warn('Unknown error, next!');
          logger.warn(reason);

          return OverPassCache._deleteCacheFile(
            theme.fragment,
            layerModel.get('uuid')
          )
            .then(setError(theme, layer, CONST.overPassCacheError.unknown))
            .then(next)
            .catch(next);
        }

        let error;
        const overPassJson = JSON.parse(body);

        if (overPassJson.remark.indexOf('Query timed out') > -1) {
          logger.warn('OverPass says: Timeout');
          error = CONST.overPassCacheError.timeout;
        } else if (
          overPassJson.remark.indexOf('Query ran out of memory') > -1
        ) {
          logger.warn('OverPass says: Out of memory');
          error = CONST.overPassCacheError.memory;
        }

        return OverPassCache._deleteCacheFile(
          theme.fragment,
          layerModel.get('uuid')
        )
          .then(setError(theme, layer, error))
          .then(next)
          .catch(next);
      });

    return true;
  }

  static _retrieveData(uri) {
    logger.debug('_retrieveData');

    const timeout = parseInt(config.get('client.overPassTimeout'), 10);

    return new Promise((resolve, reject) => {
      request(
        {
          method: 'GET',
          gzip: true,
          uri,
          timeout
        },
        (error, response, body) => {
          try {
            if (error) {
              if (error.code && error.code === 'ETIMEDOUT') {
                reject({
                  status: 524,
                  body
                });
                return;
              }

              if (!response || !response.statusCode) {
                reject({
                  status: null,
                  body
                });
                return;
              }
            }

            if (response.statusCode !== 200) {
              reject({
                status: response.statusCode,
                body
              });
              return;
            }

            const overPassJson = JSON.parse(body);

            if (overPassJson.remark) {
              reject({
                status: response.statusCode,
                body
              });
              return;
            }

            resolve(overPassJson);
            return;
          } catch (e) {
            logger.error('erreur catch', e);
          }
        }
      );
    });
  }

  static _buildDirectories(
    themeFragment,
    layerUuid,
    extension = 'geojson',
    suffix
  ) {
    logger.debug('_buildDirectories');

    const publicDirectory = path.resolve(__dirname, '..', 'public');
    const publicCacheDirectory = `files/theme/${themeFragment}/overPassCache/`;
    const cacheDirectory = path.resolve(publicDirectory, publicCacheDirectory);
    let filePath = path.join(publicCacheDirectory, `${layerUuid}.${extension}`);

    if (suffix) {
      filePath = path.join(
        publicCacheDirectory,
        `${layerUuid}-${suffix}.${extension}`
      );
    }

    fs.mkdirpSync(cacheDirectory);

    return {
      publicDirectory,
      publicCacheDirectory,
      cacheDirectory,
      filePath
    };
  }

  static _saveCacheFile(themeFragment, layerUuid, overPassGeoJson) {
    logger.debug('_saveCacheFile');

    return new Promise(resolve => {
      const { publicDirectory, filePath } = OverPassCache._buildDirectories(
        themeFragment,
        layerUuid
      );

      fs.writeFile(
        path.resolve(publicDirectory, filePath),
        JSON.stringify(overPassGeoJson),
        () => {
          resolve(`/${filePath}`);
        }
      );
    });
  }

  static _saveArchivedFeatures(themeFragment, layerUuid, archivedFeatures) {
    logger.debug('_saveArchivedFeatures');

    let newContent = [];
    const { publicDirectory, filePath } = OverPassCache._buildDirectories(
      themeFragment,
      layerUuid,
      'json',
      'archived'
    );

    try {
      const currentFileContent = JSON.parse(
        fs.readFileSync(path.resolve(publicDirectory, filePath))
      );
      const archivedFeaturesIds = archivedFeatures.map(feature => feature.id);
      newContent = currentFileContent.filter(
        feature => archivedFeaturesIds.indexOf(feature.id) === -1
      );
    } catch (error) {
      // FIXME
    }

    newContent.push(...archivedFeatures);

    fs.writeFileSync(
      path.resolve(publicDirectory, filePath),
      JSON.stringify(newContent)
    );
  }

  static _saveDeletedFeatures(themeFragment, layerUuid, deletedFeatures) {
    logger.debug('_saveDeletedFeatures');

    let newContent = [];
    const { publicDirectory, filePath } = OverPassCache._buildDirectories(
      themeFragment,
      layerUuid,
      'json',
      'deleted'
    );

    try {
      const currentFileContent = JSON.parse(
        fs.readFileSync(path.resolve(publicDirectory, filePath))
      );
      const deletedFeaturesIds = deletedFeatures.map(feature => feature.id);
      newContent = currentFileContent.filter(
        feature => deletedFeaturesIds.indexOf(feature.id) === -1
      );
    } catch (error) {
      // FIXME
    }

    newContent.push(...deletedFeatures);

    fs.writeFileSync(
      path.resolve(publicDirectory, filePath),
      JSON.stringify(newContent)
    );
  }

  static _saveModifiedFeatures(themeFragment, layerUuid, modifiedFeatures) {
    logger.debug('_saveModifiedFeatures');

    let newContent = [];
    const { publicDirectory, filePath } = OverPassCache._buildDirectories(
      themeFragment,
      layerUuid,
      'json',
      'modified'
    );

    try {
      const currentFileContent = JSON.parse(
        fs.readFileSync(path.resolve(publicDirectory, filePath))
      );
      const modifiedFeaturesIds = modifiedFeatures.map(feature => feature.id);
      newContent = currentFileContent.filter(
        feature => modifiedFeaturesIds.indexOf(feature.id) === -1
      );
    } catch (error) {
      // FIXME
    }

    newContent.push(...modifiedFeatures);

    fs.writeFileSync(
      path.resolve(publicDirectory, filePath),
      JSON.stringify(newContent)
    );
  }

  static _removeFeatureFromCacheFile(themeFragment, layerUuid, featureId) {
    logger.debug('_removeFeatureFromCacheFile');

    let content = {};
    const { publicDirectory, filePath } = OverPassCache._buildDirectories(
      themeFragment,
      layerUuid
    );

    try {
      content = JSON.parse(
        fs.readFileSync(path.resolve(publicDirectory, filePath))
      );

      content.features = content.features.filter(
        feature => feature.id !== featureId
      );
    } catch (error) {
      // FIXME
    }

    fs.writeFileSync(
      path.resolve(publicDirectory, filePath),
      JSON.stringify(content)
    );
  }

  static _removeDeletedFeatureFromCacheFile(
    themeFragment,
    layerUuid,
    featureId
  ) {
    logger.debug('_removeDeletedFeatureFromCacheFile');

    let newContent = [];
    const { publicDirectory, filePath } = OverPassCache._buildDirectories(
      themeFragment,
      layerUuid,
      'json',
      'deleted'
    );

    try {
      const currentFileContent = JSON.parse(
        fs.readFileSync(path.resolve(publicDirectory, filePath))
      );

      newContent = currentFileContent.filter(
        feature => feature.id !== featureId
      );
    } catch (error) {
      // FIXME
    }

    fs.writeFileSync(
      path.resolve(publicDirectory, filePath),
      JSON.stringify(newContent)
    );
  }

  static _removeModifiedFeatureFromCacheFile(
    themeFragment,
    layerUuid,
    featureId
  ) {
    logger.debug('_removeModifiedFeatureFromCacheFile');

    let newContent = [];
    const { publicDirectory, filePath } = OverPassCache._buildDirectories(
      themeFragment,
      layerUuid,
      'json',
      'modified'
    );

    try {
      const currentFileContent = JSON.parse(
        fs.readFileSync(path.resolve(publicDirectory, filePath))
      );

      newContent = currentFileContent.filter(
        feature => feature.id !== featureId
      );
    } catch (error) {
      // FIXME
    }

    fs.writeFileSync(
      path.resolve(publicDirectory, filePath),
      JSON.stringify(newContent)
    );
  }

  static _mergeModifiedFeatureInCacheFile(themeFragment, layerUuid, featureId) {
    logger.debug('_mergeModifiedFeatureInCacheFile');

    let newContent = {};
    let mainCacheFileContent = {};
    let feature = {};
    const {
      publicDirectory,
      filePath: mainCacheFilePath
    } = OverPassCache._buildDirectories(themeFragment, layerUuid);

    const { filePath } = OverPassCache._buildDirectories(
      themeFragment,
      layerUuid,
      'json',
      'modified'
    );

    try {
      const currentFileContent = JSON.parse(
        fs.readFileSync(path.resolve(publicDirectory, filePath))
      );

      feature = currentFileContent.find(feature => feature.id === featureId);
      newContent = currentFileContent.filter(
        feature => feature.id !== featureId
      );
    } catch (error) {
      // FIXME
    }

    fs.writeFileSync(
      path.resolve(publicDirectory, filePath),
      JSON.stringify(newContent)
    );

    try {
      mainCacheFileContent = JSON.parse(
        fs.readFileSync(path.resolve(publicDirectory, mainCacheFilePath))
      );
      mainCacheFileContent.features = mainCacheFileContent.features.filter(
        feature => feature.id !== featureId
      );

      mainCacheFileContent.features.push(feature);
    } catch (error) {
      // FIXME
    }

    fs.writeFileSync(
      path.resolve(publicDirectory, mainCacheFilePath),
      JSON.stringify(mainCacheFileContent)
    );
  }

  static _archiveFeatureInCacheFile(
    themeFragment,
    layerUuid,
    featureId,
    originCacheFile
  ) {
    logger.debug('_archiveFeatureInCacheFile');

    let newContent = [];
    const {
      publicDirectory,
      filePath: originCacheFilePath
    } = OverPassCache._buildDirectories(
      themeFragment,
      layerUuid,
      'json',
      originCacheFile
    );

    const { filePath } = OverPassCache._buildDirectories(
      themeFragment,
      layerUuid,
      'json',
      'archived'
    );

    try {
      const currentFileContent = JSON.parse(
        fs.readFileSync(path.resolve(publicDirectory, filePath))
      );

      newContent = currentFileContent.filter(
        feature => feature.id !== featureId
      );
    } catch (error) {
      // FIXME
    }

    try {
      const originCacheFeatures = JSON.parse(
        fs.readFileSync(path.resolve(publicDirectory, originCacheFilePath))
      );
      const featureToArchive = originCacheFeatures.find(
        feature => feature.id === featureId
      );

      if (featureToArchive) {
        newContent.push(featureToArchive);
      }
    } catch (error) {
      // FIXME
    }

    fs.writeFileSync(
      path.resolve(publicDirectory, filePath),
      JSON.stringify(newContent)
    );
  }

  static _readOldCacheFile(themeFragment, layerUuid) {
    const { publicDirectory, filePath } = OverPassCache._buildDirectories(
      themeFragment,
      layerUuid
    );

    let data;

    try {
      data = fs.readFileSync(path.resolve(publicDirectory, filePath));
    } catch (e) {
      return false;
    }

    if (!data) {
      return false;
    }

    return JSON.parse(data);
  }

  static _readStateCacheFile(themeFragment, layerUuid, type) {
    const { publicDirectory, filePath } = OverPassCache._buildDirectories(
      themeFragment,
      layerUuid,
      'json',
      type
    );

    let data;

    try {
      data = fs.readFileSync(path.resolve(publicDirectory, filePath));
    } catch (e) {
      return false;
    }

    if (!data) {
      return false;
    }

    return JSON.parse(data);
  }

  static _findAndSaveNewFeatures(themeFragment, layerUuid, overPassGeoJson) {
    logger.debug('_findAndSaveNewFeatures');

    const oldGeoJson = OverPassCache._readOldCacheFile(
      themeFragment,
      layerUuid
    );

    if (!oldGeoJson) {
      return [];
    }

    const deletedFeatures = OverPassCache._extractDeletedFeatures(
      oldGeoJson,
      overPassGeoJson
    );
    const modifiedFeatures = OverPassCache._extractModifiedFeatures(
      oldGeoJson,
      overPassGeoJson
    );

    OverPassCache._saveDeletedFeatures(
      themeFragment,
      layerUuid,
      deletedFeatures
    );
    OverPassCache._saveModifiedFeatures(
      themeFragment,
      layerUuid,
      modifiedFeatures
    );
  }

  static _extractDeletedFeatures(oldGeoJson, overPassGeoJson) {
    const newFeaturesId = overPassGeoJson.features.map(feature => feature.id);
    const deletedFeatures = oldGeoJson.features.filter(
      oldFeature => newFeaturesId.indexOf(oldFeature.id) === -1
    );

    return deletedFeatures;
  }

  static _extractModifiedFeatures(oldGeoJson, overPassGeoJson) {
    const oldFeaturesId = oldGeoJson.features.map(feature => feature.id);
    const modifiedFeatures = overPassGeoJson.features
      .filter(newFeature => oldFeaturesId.indexOf(newFeature.id) > -1)
      .filter(newFeature => {
        const oldFeature = oldGeoJson.features.find(
          ({ id }) => id === newFeature.id
        );

        if (oldFeature) {
          return !isEqual(
            newFeature.properties.tags,
            oldFeature.properties.tags
          );
        }

        return false;
      });

    return modifiedFeatures;
  }

  static _deleteCacheFile(themeFragment, layerUuid) {
    logger.debug('_deleteCacheFile');

    return new Promise(resolve => {
      const { publicDirectory, filePath } = OverPassCache._buildDirectories(
        themeFragment,
        layerUuid
      );

      fs.unlink(path.resolve(publicDirectory, filePath), () => {
        resolve();
      });
    });
  }

  static isCacheArchiveEnabled(layerModel) {
    if (
      config.get('client.overPassCacheArchiveEnabled') &&
      layerModel.get('cacheArchive')
    ) {
      return true;
    }

    return false;
  }
}
