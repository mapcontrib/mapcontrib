
var mongo = require('mongodb'),
requirejs = require('requirejs'),
Promise = require('es6-promise').Promise,
PresetModel = require('../public/js/model/preset'),
options = {

    'CONST': undefined,
    'database': undefined,
},

setOptions = function (hash) {

    options = hash;
},

api = {

    post: function (req, res) {

        if ( !req.session.user || !req.session.themes ) {

            res.sendStatus(401);

            return true;
        }

        if ( !req.body.themeId || req.session.themes.indexOf( req.body.themeId ) === -1 ) {

            res.sendStatus(401);

            return true;
        }

        var collection = options.database.collection('preset'),
        model = new PresetModel(req.body);

        if ( !model.isValid() ) {

            res.sendStatus(400);

            return true;
        }

        collection.insert(req.body, {'safe': true}, function (err, results) {

            if(err) {

                res.sendStatus(500);

                return true;
            }

            var result = results[0];
            result._id = result._id.toString();

            res.send(result);
        });
    },


    get: function (req, res) {

        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {

            res.sendStatus(400);

            return true;
        }

        var collection = options.database.collection('preset');

        collection.find({

            '_id': new mongo.ObjectID(req.params._id)
        })
        .toArray(function (err, results) {

            if(err) {

                res.sendStatus(500);

                return true;
            }

            if (results.length === 0) {

                res.sendStatus(404);

                return true;
            }

            var result = results[0];
            result._id = result._id.toString();

            res.send(result);
        });
    },


    getAll: function (req, res) {

        var collection = options.database.collection('preset');

        if ( req.params.themeId ) {

            api.findFromThemeId(req.params.themeId)
            .then(function (presets) {

                res.send(presets);
            })
            .catch(function (errorCode) {

                res.sendStatus(errorCode);
            });

            return true;
        }

        collection.find()
        .toArray(function (err, results) {

            if(err) {

                res.sendStatus(500);

                return true;
            }

            if (results.length > 0) {

                results.forEach(function (result) {

                    result._id = result._id.toString();
                });
            }

            res.send(results);
        });
    },


    findFromThemeId: function (themeId) {

        return new Promise(function (resolve, reject) {

            var collection = options.database.collection('preset');

            if ( !themeId || !options.CONST.pattern.mongoId.test( themeId ) ) {

                reject(400);
                return;
            }

            collection.find({

                'themeId': themeId
            })
            .toArray(function (err, results) {

                if(err) {

                    reject(500);
                    return;
                }

                if (results.length > 0) {

                    results.forEach(function (result) {

                        result._id = result._id.toString();
                    });
                }

                resolve(results);
            });
        });
    },


    put: function (req, res) {

        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {

            res.sendStatus(400);

            return true;
        }

        if ( !req.session.user || !req.session.themes ) {

            res.sendStatus(401);

            return true;
        }

        if ( !req.body.themeId || req.session.themes.indexOf( req.body.themeId ) === -1 ) {

            res.sendStatus(401);

            return true;
        }


        var new_json = req.body,
        collection = options.database.collection('preset'),
        model = new PresetModel(new_json);

        if ( !model.isValid() ) {

            res.sendStatus(400);

            return true;
        }

        delete(new_json._id);

        collection.update({

            '_id': new mongo.ObjectID(req.params._id)
        },
        new_json,
        {'safe': true},
        function (err) {

            if(err) {

                res.sendStatus(500);

                return true;
            }

            res.send({});
        });
    },



    delete: function (req, res) {

        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {

            res.sendStatus(400);

            return true;
        }

        if ( !req.session.user || !req.session.themes ) {

            res.sendStatus(401);

            return true;
        }


        var collection = options.database.collection('preset');

        collection.findOne({

            '_id': new mongo.ObjectID(req.params._id)
        },
        function (err, preset) {

            if(err) {

                res.sendStatus(500);

                return true;
            }

            if ( !preset ) {

                res.sendStatus(400);

                return true;
            }

            if ( !preset.themeId || req.session.themes.indexOf( preset.themeId ) === -1 ) {

                res.sendStatus(401);

                return true;
            }

            collection.remove({

                '_id': new mongo.ObjectID(req.params._id)
            },
            {'safe': true},
            function (err) {

                if(err) {

                    res.sendStatus(500);

                    return true;
                }

                res.send({});
            });
        });
    },
};



module.exports = {

    'setOptions': setOptions,
    'api': api,
};
