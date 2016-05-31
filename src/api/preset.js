
import { ObjectID } from 'mongodb';
import PresetModel from '../public/js/model/preset';


let options = {
    'CONST': undefined,
    'database': undefined,
};


function setOptions (hash) {
    options = hash;
}


class Api {

    post (req, res) {

        if ( !req.session.user || !req.session.themes ) {

            res.sendStatus(401);

            return true;
        }

        if ( !req.body.themeId || req.session.themes.indexOf( req.body.themeId ) === -1 ) {

            res.sendStatus(401);

            return true;
        }

        let collection = options.database.collection('preset'),
        model = new PresetModel(req.body);

        if ( !model.isValid() ) {

            res.sendStatus(400);

            return true;
        }

        collection.insertOne(req.body, {'safe': true}, (err, results) => {

            if(err) {

                res.sendStatus(500);

                return true;
            }

            let result = results.ops[0];
            result._id = result._id.toString();

            res.send(result);
        });
    }


    get (req, res) {

        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {

            res.sendStatus(400);

            return true;
        }

        let collection = options.database.collection('preset');

        collection.find({

            '_id': new ObjectID(req.params._id)
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


    getAll (req, res) {

        let collection = options.database.collection('preset');

        if ( req.params.themeId ) {

            api.findFromThemeId(req.params.themeId)
            .then((presets) => {

                res.send(presets);
            })
            .catch((errorCode) => {

                res.sendStatus(errorCode);
            });

            return true;
        }

        collection.find()
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

            res.send(results);
        });
    }


    findFromThemeId (themeId) {

        return new Promise((resolve, reject) => {

            let collection = options.database.collection('preset');

            if ( !themeId || !options.CONST.pattern.mongoId.test( themeId ) ) {

                reject(400);
                return;
            }

            collection.find({

                'themeId': themeId
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
    }


    put (req, res) {

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


        let new_json = req.body,
        collection = options.database.collection('preset'),
        model = new PresetModel(new_json);

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
    }



    delete (req, res) {

        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {

            res.sendStatus(400);

            return true;
        }

        if ( !req.session.user || !req.session.themes ) {

            res.sendStatus(401);

            return true;
        }


        let collection = options.database.collection('preset');

        collection.findOne({

            '_id': new ObjectID(req.params._id)
        },
        (err, preset) => {

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
        });
    }
}



export default {
    setOptions,
    'api': new Api()
};
