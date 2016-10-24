
import config from 'config';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import osmtogeojson from 'osmtogeojson';
import { XMLHttpRequest } from 'xmlhttprequest';
import logger from '../lib/logger';
import SERVER_CONST from '../const';
import PUBLIC_CONST from '../public/js/const';
import OverPassHelper from '../public/js/helper/overPass';
import GeoUtils from '../public/js/core/geoUtils.js';


const CONST = { ...SERVER_CONST, ...PUBLIC_CONST };


export default class OverPassCache {
    constructor(db) {
        this._db = db;
    }

    static process(theme, layer, next, retry, setSuccess, setError, setDeletedFeatures) {
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

        const bounds = GeoUtils.zoomLatLngWidthHeightToBbox(
            theme.zoomLevel,
            theme.center.lat,
            theme.center.lng,
            3840,
            2160
        );

        const url = OverPassHelper.buildUrlForCache(
            config.get('client.overPassEndPoint'),
            layer.overpassRequest,
            config.get('client.overPassCacheFileSize'),
            bounds
        );

        OverPassCache._retrieveData(url)
        .then((data) => {
            const promises = [
                OverPassCache._saveCacheFile(
                    theme.fragment,
                    layer.uuid,
                    data
                ),
            ];

            if ( config.get('client.overPassCacheDeleteArchiveEnabled') ) {
                promises.push(
                    OverPassCache._findDeletedFeatures(
                        theme.fragment,
                        layer.uuid,
                        data
                    )
                );
            }

            Promise.all(promises)
            .then((results) => {
                const savedFilePath = results[0];
                setSuccess(theme, layer, bounds, savedFilePath);

                if ( config.get('client.overPassCacheDeleteArchiveEnabled') ) {
                    const deletedFeatures = results[1];
                    setDeletedFeatures(theme, layer, deletedFeatures);
                }
            })
            .then( next );
        })
        .catch((xhr) => {
            if (xhr.status === 429) {
                logger.info('OverPass says: Too many requests... Retrying in a few seconds');
                return retry(theme, layer);
            }

            if (xhr.status === 400) {
                logger.debug('OverPass says: Bad request');

                return OverPassCache._deleteCacheFile(
                    theme.fragment,
                    layer.uuid
                )
                .then( setError(theme, layer, CONST.overPassCacheError.badRequest) )
                .then( next );
            }

            if (xhr.status !== 200) {
                logger.debug('Unknown error, next!');

                return OverPassCache._deleteCacheFile(
                    theme.fragment,
                    layer.uuid
                )
                .then( setError(theme, layer, CONST.overPassCacheError.unknown) )
                .then( next );
            }

            let error;
            const overPassJson = JSON.parse(xhr.responseText);

            if ( overPassJson.remark.indexOf('Query timed out') > -1 ) {
                logger.debug('OverPass says: Timeout');
                error = CONST.overPassCacheError.timeout;
            }
            else if ( overPassJson.remark.indexOf('Query run out of memory') > -1 ) {
                logger.debug('OverPass says: Out of memory');
                error = CONST.overPassCacheError.memory;
            }

            return OverPassCache._deleteCacheFile(
                theme.fragment,
                layer.uuid
            )
            .then( setError(theme, layer, error) )
            .then( next );
        });

        return true;
    }

    static _retrieveData(url) {
        logger.debug('_retrieveData');

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.send(null);

            if (xhr.status === 200) {
                const overPassJson = JSON.parse(xhr.responseText);

                if (overPassJson.remark) {
                    return reject(xhr);
                }

                return resolve(overPassJson);
            }

            return reject(xhr);
        });
    }

    static _buildDirectories(themeFragment, layerUuid) {
        logger.debug('_buildDirectories');

        const publicDirectory = path.resolve(__dirname, '..', 'public');
        const publicCacheDirectory = `files/theme/${themeFragment}/overPassCache/`;
        const cacheDirectory = path.resolve( publicDirectory, publicCacheDirectory );
        const filePath = path.join( publicCacheDirectory, `${layerUuid}.geojson` );

        if ( !fs.existsSync( cacheDirectory ) ) {
            mkdirp.sync(cacheDirectory);
        }

        return {
            publicDirectory,
            publicCacheDirectory,
            cacheDirectory,
            filePath,
        };
    }

    static _saveCacheFile(themeFragment, layerUuid, overPassResult) {
        logger.debug('_saveCacheFile');

        return new Promise((resolve) => {
            const overPassGeoJson = osmtogeojson(overPassResult);
            const {
                publicDirectory,
                filePath,
            } = OverPassCache._buildDirectories(themeFragment, layerUuid);

            fs.writeFile(
                path.resolve( publicDirectory, filePath ),
                JSON.stringify( overPassGeoJson ),
                () => {
                    resolve(`/${filePath}`);
                }
            );
        });
    }

    static _findDeletedFeatures(themeFragment, layerUuid, overPassResult) {
        logger.debug('_findDeletedFeatures');

        return new Promise((resolve) => {
            const overPassGeoJson = osmtogeojson(overPassResult);
            const {
                publicDirectory,
                filePath,
            } = OverPassCache._buildDirectories(themeFragment, layerUuid);

            fs.readFile(
                path.resolve( publicDirectory, filePath ),
                (err, data) => {
                    const oldGeoJson = JSON.parse(data);
                    const differences = OverPassCache._extractDeletedFeatures(
                        oldGeoJson,
                        overPassGeoJson
                    );

                    resolve(differences);
                }
            );
        });
    }

    static _extractDeletedFeatures(oldGeoJson, overPassGeoJson) {
        const deletedFeatures = [];
        const newFeaturesId = overPassGeoJson.features.map(feature => feature.id);

        for (const oldFeature of oldGeoJson.features) {
            if (newFeaturesId.indexOf(oldFeature.id) === -1) {
                deletedFeatures.push(oldFeature);
            }
        }

        return deletedFeatures;
    }

    static _deleteCacheFile(themeFragment, layerUuid) {
        logger.debug('_deleteCacheFile');

        return new Promise((resolve) => {
            const {
                publicDirectory,
                filePath,
            } = OverPassCache._buildDirectories(themeFragment, layerUuid);

            fs.unlink(
                path.resolve( publicDirectory, filePath ),
                () => {
                    resolve();
                }
            );
        });
    }
}
