
var crypto = require('crypto'),
ObjectID = require('mongodb').ObjectID,
Promise = require('es6-promise').Promise,
ThemeModel = require('../public/js/model/theme'),
options = {

    'CONST': undefined,
    'database': undefined,
},

setOptions = function (hash) {

    options = hash;
},

api = {

    post: function (req, res) {

        var collection = options.database.collection('theme'),
        model = new ThemeModel(req.body);

        if ( !model.isValid() ) {

            res.sendStatus(400);

            return true;
        }


        collection.insertOne(req.body, {'safe': true}, function (err, results) {

            if(err) {

                res.sendStatus(500);

                return true;
            }

            var result = results.ops[0];

            api.getNewFragment(result, req, res);
        });
    },

    getNewFragment: function (theme, req, res) {

        var fragment,
        collection = options.database.collection('theme'),
        shasum = crypto.createHash('sha1');

        shasum.update( [

            theme._id.toString(),
            new Date().getTime().toString()
        ].join('') );

        fragment = shasum.digest('hex').substr(0, 6);

        collection.find({

            'fragment': fragment
        })
        .toArray(function (err, results) {

            if(err) {
                res.sendStatus(500);
                return true;
            }

            if (results.length === 0) {

                theme.fragment = fragment;

                collection.updateOne({
                    '_id': theme._id
                },
                {
                    '$set': { 'fragment': fragment }
                },
                {'safe': true},
                function (err, results, ert) {

                    if(err) {
                        res.sendStatus(500);
                        return true;
                    }

                    theme._id = theme._id.toString();

                    res.send(theme);
                });
            }
            else {
                api.getNewFragment(theme, req, res);
            }
        });
    },


    get: function (req, res) {

        if ( !req.params._id || !options.CONST.pattern.mongoId.test( req.params._id ) ) {

            res.sendStatus(400);

            return true;
        }

        var collection = options.database.collection('theme');

        collection.find({

            '_id':  new ObjectID(req.params._id)
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

        var collection = options.database.collection('theme');

        if ( req.query.fragment ) {

            api.findFromFragment(req.query.fragment)
            .then(function (theme) {

                res.send(theme);
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

            if ( req.query.fragment ) {

                if (results.length === 0) {

                    res.sendStatus(404);

                    return true;
                }

                res.send(results[0]);

                return true;
            }

            res.send(results);
        });
    },


    findFromFragment: function (fragment) {

        return new Promise(function (resolve, reject) {

            var collection = options.database.collection('theme');

            if ( !fragment || !options.CONST.pattern.fragment.test( fragment ) ) {

                reject(400);
                return;
            }

            collection.find({

                'fragment': fragment
            })
            .toArray(function (err, results) {

                if(err) {

                    reject(500);
                    return;
                }

                if (results.length === 0) {

                    reject(404);
                    return;
                }

                var result = results[0];
                result._id = result._id.toString();

                resolve(result);
            });
        });
    },


    findFromOwnerId: function (ownerId) {

        return new Promise(function (resolve, reject) {

            var collection = options.database.collection('theme');

            if ( !ownerId || !options.CONST.pattern.mongoId.test( ownerId ) ) {

                reject(400);
                return;
            }

            collection.find({
                $or: [
                    { 'owners': ownerId },
                    { 'owners': '*' }
                ]
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

        if ( !api.isThemeOwner(req, res, req.params._id) ) {

            res.sendStatus(401);

            return true;
        }


        var new_json = req.body,
        collection = options.database.collection('theme'),
        model = new ThemeModel(new_json);

        if ( !model.isValid() ) {

            res.sendStatus(400);

            return true;
        }

        delete(new_json._id);

        collection.updateOne({

            '_id': new ObjectID(req.params._id)
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

        if ( !api.isThemeOwner(req, res, req.params._id) ) {

            res.sendStatus(401);

            return true;
        }


        var collection = options.database.collection('theme');

        collection.remove({

            '_id': new ObjectID(req.params._id)
        },
        {'safe': true},
        function (err) {

            if(err) {

                res.sendStatus(500);

                return true;
            }

            res.send({});
        });
    },


    isThemeOwner: function (req, res, themeId) {

        if ( !req.session.user || !req.session.themes ) {

            return false;
        }

        if ( req.session.themes.indexOf( themeId ) === -1 ) {

            return false;
        }

        return true;
    },
};



module.exports = {

    'setOptions': setOptions,
    'api': api,
};
