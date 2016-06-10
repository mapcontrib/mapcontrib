
import { ObjectID } from 'mongodb';



function dummyPromiseCallback (resolve, reject, err) {
    if (err) {
        reject(err);
        throw err;
    }

    resolve();
}


let init = {
    '_db': undefined,
    '_themeCollection': undefined,
    '_poiLayerCollection': undefined,
    '_userCollection': undefined,
};


init.setDatabase = function (db) {
    init._db = db;
};


init.isDone = function () {
    return new Promise( function (resolve, reject) {
        init._db.listCollections({'name': 'theme'})
        .toArray(function(err, items) {
            if (err) {
                reject(err);
            }

            if (items.length === 0) {
                reject();
            }

            resolve();
        });
    });
};


init.start = function () {
    console.log('Database initialization...');

    return new Promise( function (rootResolve, rootReject) {
        return init._cleanDatabase(rootResolve, rootReject);
    } );
};

init._cleanDatabase = function (rootResolve, rootReject) {
    var dropPromises = [];

    dropPromises.push(
        new Promise( function (resolve, reject) {
            init._db.dropCollection('theme', function (err) {
                resolve();
            });
        })
    );

    dropPromises.push(
        new Promise( function (resolve, reject) {
            init._db.dropCollection('poiLayer', function (err) {
                resolve();
            });
        })
    );

    return Promise.all(dropPromises)
    .then(function () {
        console.log('Database cleaned');
        return init._fillDatabase(rootResolve, rootReject);
    })
    .catch(function (err) {
        throw err;
    });
};

init._fillDatabase = function (rootResolve, rootReject) {
    var insertPromises = [
        new Promise( function (resolve, reject) {
            init._db.createCollection('theme', function (err, collection) {
                init._themeCollection = collection;

                init._themeCollection.insertOne({
                        '_id' : new ObjectID('5249c43c6e789470197b5973'),
                        'name': 'MapContrib',
                        'description': 'Ceci est une description :)',
                        'fragment': 's8c2d4',
                        'color': 'blue',
                        'tiles': [

                            'osmFr',
                            'mapboxStreetsSatellite',
                            'osmRoads',
                            'transport',
                            'hot',
                            'openCycleMap',
                            'watercolor',
                            'osmMonochrome',
                            'hydda',
                            'openTopoMap',
                            'openRiverboatMap'
                        ],
                        'zoomLevel': 12,
                        'center': {
                            'lat': 44.82921,
                            'lng': -0.5834,
                        },
                    },
                    {'safe': true},
                    dummyPromiseCallback.bind(this, resolve, reject)
                );
            });
        }),
        new Promise( function (resolve, reject) {
            init._db.createCollection('poiLayer', function (err, collection) {
                init._poiLayerCollection = collection;

                init._poiLayerCollection.insertMany([
                        {
                            '_id' : new ObjectID('5249c43c6e789470197b5974'),
                            'themeId': '5249c43c6e789470197b5973',
                            'name': 'Déchèteries',
                            'description': 'Déchèteries, centres de tri, etc.',
                            'overpassRequest': "(node['amenity'='recycling']['recycling_type'='centre']({{bbox}});relation['amenity'='recycling']['recycling_type'='centre']({{bbox}});way['amenity'='recycling']['recycling_type'='centre']({{bbox}}));out body center;>;out skel;",
                            'minZoom': 14,
                            'popupContent': '# Nom : {name}\n\n_Amenity :_ {amenity}',
                            'order': 0,
                            'markerShape': 'marker1',
                            'markerColor': 'green',
                            'markerIcon': 'recycle',
                        },
                        {
                            '_id' : new ObjectID('5249c43c6e789470197b5975'),
                            'themeId': '5249c43c6e789470197b5973',
                            'name': 'Poubelles',
                            'description': 'Poubelles de toutes sortes',
                            'overpassRequest': "(node['amenity'='waste_basket']({{bbox}});relation['amenity'='waste_basket']({{bbox}});way['amenity'='waste_basket']({{bbox}}));out body center;>;out skel;",
                            'minZoom': 14,
                            'popupContent': '# Nom : {name}\n\n_Amenity :_ {amenity}',
                            'order': 1,
                            'markerShape': 'marker1',
                            'markerColor': 'yellow',
                            'markerIcon': 'trash',
                        }
                    ],
                    {'safe': true},
                    dummyPromiseCallback.bind(this, resolve, reject)
                );
            });
        }),
        new Promise( function (resolve, reject) {
            init._db.createCollection('user', function (err, collection) {
                init._userCollection = collection;

                resolve();
            });
        }),
    ];

    return Promise.all(insertPromises)
    .then(function () {
        console.log('Database fulfilled');
        return init._createIndexes(rootResolve, rootReject);
    })
    .catch(function (err) {
        throw err;
    });
};

init._createIndexes = function (rootResolve, rootReject) {
    var indexesPromises = [
        new Promise( function (resolve, reject) {
            init._userCollection.createIndex(
                { 'osmId': 1 },
                { 'unique': true },
                dummyPromiseCallback.bind(this, resolve, reject)
            );
        }),
        new Promise( function (resolve, reject) {
            init._themeCollection.createIndex(
                { 'fragment': 1 },
                { 'unique': true },
                dummyPromiseCallback.bind(this, resolve, reject)
            );
        }),
        new Promise( function (resolve, reject) {
            init._poiLayerCollection.createIndex(
                { 'themeId': 1 },
                dummyPromiseCallback.bind(this, resolve, reject)
            );
        }),
    ];

    return Promise.all(indexesPromises)
    .then(function () {
        console.log('Collections\' indexes created');
        return rootResolve();
    })
    .catch(function (err) {
        return rootReject(err);
    });
};


export default {
    'setDatabase': init.setDatabase,
    'isDone': init.isDone,
    'start': init.start,
};
