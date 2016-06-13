
import crypto from 'crypto';
import Diacritics from 'diacritic';
import { ObjectID } from 'mongodb';
import ThemeModel from '../public/js/model/theme';


let options = {
    'CONST': undefined,
    'database': undefined,
};


function setOptions (hash) {
    options = hash;
}


let api = {
    post (req, res) {
        let collection = options.database.collection('theme'),
        model = new ThemeModel(req.body);

        if ( !model.isValid() ) {
            res.sendStatus(400);

            return true;
        }

        api.getNewFragment(res)
        .then((fragment) => {
            model.set('fragment', fragment);

            collection.insertOne(
                model.toJSON(),
                {'safe': true},
                (err, results) => {
                if(err) {
                    res.sendStatus(500);

                    return true;
                }

                let result = results.ops[0];
                result._id = result._id.toString();

                res.send(result);
            });
        });
    },

    getNewFragment: function (res) {
        let collection = options.database.collection('theme'),
        shasum = crypto.createHash('sha1');

        shasum.update([
            new Date().getTime().toString()
        ].join('') );

        let fragment = shasum.digest('hex').substr(0, 6);

        return new Promise((resolve, reject) => {
            collection.find({
                'fragment': fragment
            })
            .toArray((err, results) => {
                if(err) {
                    res.sendStatus(500);
                    return true;
                }

                if (results.length === 0) {
                    resolve(fragment);
                }
                else {
                    return api.getNewFragment(res);
                }
            });
        });
    },


    get: function (req, res) {
        if ( !req.params._id || !options.CONST.pattern.mongoId.test( req.params._id ) ) {
            res.sendStatus(400);

            return true;
        }

        let collection = options.database.collection('theme');

        collection.find({
            '_id':  new ObjectID(req.params._id)
        })
        .toArray((err, results) => {
            if(err) {
                res.sendStatus(500);

                return true;
            }

            if (results.length === 0) {
                res.sendStatus(404);

                return true;
            }

            let result = results[0];
            result._id = result._id.toString();

            res.send(result);
        });
    },


    getAll: function (req, res) {
        let collection = options.database.collection('theme');
        let filters = {};

        if (req.get('hasLayer')) {
            filters.layers = {
                '$exists': true,
                '$not': {
                    '$size': 0
                }
            };
        }

        if ( req.query.fragment ) {
            api.findFromFragment(req.query.fragment)
            .then((theme) => {
                res.send(theme);
            })
            .catch((errorCode) => {
                res.sendStatus(errorCode);
            });

            return true;
        }


        collection.find(
            filters
        )
        .toArray((err, results) => {
            if(err) {
                res.sendStatus(500);

                return true;
            }

            if (results.length > 0) {
                results.forEach((result) => {
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
            else if ( req.query.q ) {
                if (req.query.q.length < 3) {
                    res.status(400).send('Query too short');
                    return;
                }

                let query = Diacritics.clean(req.query.q);
                let re = new RegExp(`${query}`, 'i');
                let filteredResults = [];

                for (let theme of results) {
                    let layerSearchableStrings = [];

                    if (theme.layers) {
                        for (let layer of theme.layers) {
                            layerSearchableStrings.push(
                                [
                                    layer.name,
                                    layer.description,
                                    layer.overpassRequest
                                ].join(' ')
                            );
                        }
                    }

                    let searchableString = [
                            theme.name,
                            theme.description,
                            theme.fragment,
                            layerSearchableStrings.join(' ')
                    ].join(' ');

                    searchableString = Diacritics.clean(searchableString);

                    if ( re.test(searchableString) ) {
                        filteredResults.push(theme);
                    }
                }

                res.send(filteredResults);
            }
            else {
                res.send(results);
            }
        });
    },


    findFromFragment: function (fragment) {
        return new Promise((resolve, reject) => {
            let collection = options.database.collection('theme');

            if ( !fragment || !options.CONST.pattern.fragment.test( fragment ) ) {
                reject(400);
                return;
            }

            collection.find({
                'fragment': fragment
            })
            .toArray((err, results) => {
                if(err) {
                    reject(500);
                    return;
                }

                if (results.length === 0) {
                    reject(404);
                    return;
                }

                let result = results[0];
                result._id = result._id.toString();

                resolve(result);
            });
        });
    },


    findFromOwnerId: function (ownerId) {
        return new Promise((resolve, reject) => {
            let collection = options.database.collection('theme');

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
            .toArray((err, results) => {
                if(err) {
                    reject(500);
                    return;
                }

                if (results.length > 0) {
                    results.forEach((result) => {
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


        let new_json = req.body,
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
        (err) => {
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


        let collection = options.database.collection('theme');

        collection.remove({
            '_id': new ObjectID(req.params._id)
        },
        {'safe': true},
        (err) => {
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
    }
};



export default {
    setOptions,
    api
};
