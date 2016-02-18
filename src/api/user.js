
var mongo = require('mongodb'),
requirejs = require('requirejs'),
UserModel = requirejs('model/user'),
options = {

    'CONST': undefined,
    'database': undefined,
},

setOptions = function (hash) {

    options = hash;
},

api = {

    post: function (req, res) {

        var collection = options.database.collection('user'),
        model = new UserModel(req.body);

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

        api.findFromId(req, res, req.params._id, function (user) {

            res.send(user);
        });
    },


    findFromId: function (req, res, _id, callback) {

        if ( _id === 'me' ) {

            _id = req.user;
        }
        else if ( req.user !== _id ) {

            res.sendStatus(401);

            return true;
        }
        else if ( !options.CONST.pattern.mongoId.test( _id ) ) {

            res.sendStatus(400);

            return true;
        }

        var collection = options.database.collection('user');

        collection.find({

            '_id': new mongo.ObjectID(_id)
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

            callback(result);
        });
    },


    getAll: function (req, res) {

        var collection = options.database.collection('user');

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


    put: function (req, res) {

        if (req.user !== req.params._id) {

            res.sendStatus(401);

            return true;
        }

        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {

            res.sendStatus(400);

            return true;
        }


        var new_json = req.body,
        collection = options.database.collection('user'),
        model = new UserModel(new_json);

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

        if (req.user !== req.params._id) {

            res.sendStatus(401);

            return true;
        }

        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {

            res.sendStatus(400);

            return true;
        }


        var collection = options.database.collection('user');

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
    },

    logout: function (req, res) {

        req.logout();

        delete req.session.user;
        delete req.session.themes;

        res.sendStatus(200);
    },
};



module.exports = {

    'setOptions': setOptions,
    'api': api,
};
