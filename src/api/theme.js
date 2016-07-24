
import crypto from 'crypto';
import Backbone from 'backbone';
import Sifter from 'sifter';
import { ObjectID } from 'mongodb';
import ThemeModel from '../public/js/model/theme';


let options = {
    'CONST': undefined,
    'database': undefined,
    'fileApi': undefined,
};


function setOptions (hash) {
    options = hash;
}

function addThemeInUserSession (session, theme) {
    theme._id = theme._id.toString();

    if (!session.themes) {
        session.themes = [];
    }

    session.themes.push( theme._id );
    return true;
}


class Api {
    static post (req, res) {
        if (!req.session.user) {
            res.sendStatus(401);
        }

        Api.createTheme( req.session, req.session.user._id.toString() )
        .then(result => {
            result._id = result._id.toString();
            res.send(result);
        })
        .catch(errorCode => {
            res.sendStatus(errorCode);
        });
    }

    static createTheme (session, userId) {
        Backbone.Relational.store.reset();

        const collection = options.database.collection('theme');
        const model = new ThemeModel({
            'userId': userId,
            'owners': [ userId ]
        });

        return new Promise((resolve, reject) => {
            Api.getNewFragment()
            .then(fragment => {
                model.set('fragment', fragment);

                collection.insertOne(
                    model.toJSON(),
                    {'safe': true},
                    (err, results) => {
                        if(err) {
                            return reject(500);
                        }

                        const result = results.ops[0];

                        addThemeInUserSession(session, result);

                        resolve(result);
                    }
                );
            });
        });
    }

    static getNewFragment () {
        const collection = options.database.collection('theme');
        const shasum = crypto.createHash('sha1');

        shasum.update([
            new Date().getTime().toString()
        ].join('') );

        const fragment = shasum.digest('hex').substr(0, 6);

        return new Promise((resolve, reject) => {
            collection.find({
                'fragment': fragment
            })
            .toArray((err, results) => {
                if(err) {
                    return reject(500);
                }

                if (results.length === 0) {
                    resolve(fragment);
                }
                else {
                    return Api.getNewFragment();
                }
            });
        });
    }


    static get (req, res) {
        if ( !req.params._id || !options.CONST.pattern.mongoId.test( req.params._id ) ) {
            res.sendStatus(400);

            return true;
        }

        const collection = options.database.collection('theme');

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

            const result = results[0];
            result._id = result._id.toString();

            res.send(result);
        });
    }


    static getAll (req, res) {
        const collection = options.database.collection('theme');
        const filters = {};

        if (req.query.hasLayer) {
            filters.layers = {
                '$exists': true,
                '$not': {
                    '$size': 0
                }
            };
        }

        if ( req.query.fragment ) {
            Api.findFromFragment(req.query.fragment)
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

            if ( req.query.q ) {
                if (req.query.q.length < 3) {
                    res.status(400).send('Query too short');
                    return;
                }

                const searchFields = [];

                for (const theme of results) {
                    const layerfields = [];

                    for (const layer of theme.layers) {
                        layerfields.push([
                            layer.name,
                            layer.description,
                            layer.overpassRequest
                        ].join(' '));
                    }

                    searchFields.push({
                        'name': theme.name,
                        'description': theme.description,
                        'fragment': theme.fragment,
                        'layers': layerfields.join(' '),
                    });
                }

                const searchResults = [];
                const sifter = new Sifter(searchFields);
                const sifterResults = sifter.search(
                    req.query.q,
                    {
                        'fields': [
                            'name',
                            'description',
                            'fragment',
                            'layers',
                        ],
                        'limit': 30
                    }
                );

                for (const result of sifterResults.items) {
                    searchResults.push(
                        results[ result.id ]
                    );
                }

                res.send(searchResults);
            }
            else {
                res.send(results);
            }
        });
    }


    static findFromFragment (fragment) {
        return new Promise((resolve, reject) => {
            const collection = options.database.collection('theme');

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

                const result = results[0];
                result._id = result._id.toString();

                resolve(result);
            });
        });
    }


    static findFromOwnerId (ownerId) {
        return new Promise((resolve, reject) => {
            const collection = options.database.collection('theme');

            if ( !ownerId || !options.CONST.pattern.mongoId.test( ownerId ) ) {
                reject(400);
                return;
            }

            collection.find({
                '$or': [
                    {
                        'owners': {
                            '$elemMatch': {
                                '$eq': ownerId
                            }
                        }
                    },
                    {
                        'owners': {
                            '$elemMatch': {
                                '$eq': '*'
                            }
                        }
                    },
                ]
            })
            .toArray((err, results) => {
                if(err) {
                    reject(500);
                    return;
                }

                resolve(
                    results.map(result => {
                        result._id = result._id.toString();
                        return result;
                    })
                );
            });
        });
    }


    static put (req, res) {
        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {
            res.sendStatus(400);

            return true;
        }

        if ( !Api.isThemeOwner(req, res, req.params._id) ) {
            res.sendStatus(401);

            return true;
        }

        Backbone.Relational.store.reset();

        const new_json = req.body,
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

            options.fileApi.cleanThemeFiles(model);

            res.send({});
        });
    }



    static delete (req, res) {
        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {
            res.sendStatus(400);

            return true;
        }

        if ( !Api.isThemeOwner(req, res, req.params._id) ) {
            res.sendStatus(401);

            return true;
        }


        const collection = options.database.collection('theme');

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
    }


    static isThemeOwner (req, res, themeId) {
        if ( !req.session.user || !req.session.themes ) {
            return false;
        }

        if ( req.session.themes.indexOf( themeId ) === -1 ) {
            return false;
        }

        return true;
    }
}



export default {
    setOptions,
    Api
};
