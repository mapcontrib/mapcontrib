
import crypto from 'crypto';
import { ObjectID } from 'mongodb';
import ThemeModel from '../public/js/model/theme';


let options = {
    'CONST': undefined,
    'database': undefined,
};


function setOptions (hash) {
    options = hash;
}


class Api {

    post (req, res) {

        let collection = options.database.collection('theme'),
        model = new ThemeModel(req.body);

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

            api.getNewFragment(result, req, res);
        });
    }

    getNewFragment (theme, req, res) {

        let fragment,
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
        .toArray((err, results) => {

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
                (err, results, ert) => {

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
    }


    get (req, res) {

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


    getAll (req, res) {

        let collection = options.database.collection('theme');

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
    }


    findFromFragment (fragment) {

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
    }


    findFromOwnerId (ownerId) {

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
    }


    put (req, res) {

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
    }



    delete (req, res) {

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
    }


    isThemeOwner (req, res, themeId) {

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
    'api': new Api()
};
