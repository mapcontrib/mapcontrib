
import Backbone from 'backbone';
import { ObjectID } from 'mongodb';
import NonOsmDataModel from '../public/js/model/nonOsmData';


let options = {
    'CONST': undefined,
    'database': undefined,
    'fileApi': undefined,
};


function setOptions (hash) {
    options = hash;
}



class Api {
    static post (req, res) {
        if (!req.session.user) {
            res.sendStatus(401);
        }

        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {
            return res.sendStatus(400);
        }

        const collection = options.database.collection('nonOsmData');
        const new_json = req.body;
        const model = new ThemeModel(new_json);

        if ( !model.isValid() ) {
            return res.sendStatus(400);
        }

        delete(new_json._id);


        collection.insertOne(
            model.toJSON(),
            {'safe': true},
            (err, results) => {
                if(err) {
                    return res.sendStatus(500);
                }

                const result = results.ops[0];
                result._id = result._id.toString();

                res.send(result);
            }
        );
    }

    static get (req, res) {
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
    }


    static getAll (req, res) {
        let collection = options.database.collection('theme');
        let filters = {};

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

                let searchFields = [];

                for (let theme of results) {
                    let layerfields = [];

                    for (let layer of theme.layers) {
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

                let searchResults = [];
                let sifter = new Sifter(searchFields);
                let sifterResults = sifter.search(
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

                for (let result of sifterResults.items) {
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
            const collection = options.database.collection('nonOsmData');

            if ( !fragment || !options.CONST.pattern.fragment.test( fragment ) ) {
                reject(400);
                return;
            }

            collection.find({
                'themeFragment': fragment
            })
            .toArray((err, results) => {
                if(err) {
                    return reject(500);
                }

                for (const result of results) {
                    result._id = result._id.toString();
                }

                resolve(results);
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

            options.fileApi.cleanThemeFiles(model);

            res.send({});
        });
    }
}



export default {
    setOptions,
    Api
};
