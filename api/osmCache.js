
import { ObjectID } from 'mongodb';
import logger from '../lib/logger';
import OsmCacheModel from '../public/js/model/osmCache';


let options = {
    CONST: undefined,
    database: undefined,
    fileApi: undefined,
};


function setOptions(hash) {
    options = hash;
}


class Api {
    static post(req, res) {
        const collection = options.database.collection('osmCache');
        const newJson = req.body;
        const model = new OsmCacheModel(newJson);

        if ( !model.isValid() ) {
            return res.sendStatus(400);
        }

        delete (newJson._id);


        collection.insertOne(
            model.toJSON(),
            { safe: true },
            (err, results) => {
                if (err) {
                    logger.error(err);
                    return res.sendStatus(500);
                }

                const result = results.ops[0];
                result._id = result._id.toString();

                return res.send(result);
            }
        );

        return true;
    }

    static get(req, res) {
        if ( !req.params._id || !options.CONST.pattern.mongoId.test( req.params._id ) ) {
            res.sendStatus(400);

            return true;
        }

        const collection = options.database.collection('osmCache');

        collection.find({
            _id: new ObjectID(req.params._id),
        })
        .toArray((err, results) => {
            if (err) {
                logger.error(err);
                res.sendStatus(500);

                return true;
            }

            if (results.length === 0) {
                res.sendStatus(404);

                return true;
            }

            const result = results[0];
            result._id = result._id.toString();

            return res.send(result);
        });

        return true;
    }


    static getAll(req, res) {
        const collection = options.database.collection('osmCache');
        const filters = {};

        if ( req.query.themeFragment ) {
            Api.findFromFragment(req.query.themeFragment)
            .then((models) => {
                res.send(models);
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
            if (err) {
                logger.error(err);
                res.sendStatus(500);

                return true;
            }

            return res.send(
                results.map((result) => {
                    result._id = result._id.toString();
                    return result;
                })
            );
        });

        return true;
    }


    static findFromFragment(fragment) {
        return new Promise((resolve, reject) => {
            const collection = options.database.collection('osmCache');

            if ( !fragment || !options.CONST.pattern.fragment.test( fragment ) ) {
                reject(400);
                return;
            }

            collection.find({
                themeFragment: fragment,
            })
            .toArray((err, results) => {
                if (err) {
                    logger.error(err);
                    return reject(500);
                }

                return resolve(
                    results.map((result) => {
                        result._id = result._id.toString();
                        return result;
                    })
                );
            });
        });
    }


    static put(req, res) {
        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {
            res.sendStatus(400);

            return true;
        }

        const newJson = req.body;
        const collection = options.database.collection('osmCache');
        const model = new OsmCacheModel(newJson);

        if ( !model.isValid() ) {
            res.sendStatus(400);

            return true;
        }

        delete (newJson._id);

        collection.updateOne({
            _id: new ObjectID(req.params._id),
        },
        newJson,
        { safe: true },
        (err) => {
            if (err) {
                logger.error(err);
                res.sendStatus(500);

                return true;
            }

            return res.send({});
        });

        return true;
    }


    static delete(req, res) {
        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {
            res.sendStatus(400);

            return true;
        }

        const collection = options.database.collection('osmCache');

        collection.removeOne({
            _id: new ObjectID(req.params._id),
        },
        { safe: true },
        (err) => {
            if (err) {
                logger.error(err);
                res.sendStatus(500);

                return true;
            }

            return res.send({});
        });

        return true;
    }
}


export default {
    setOptions,
    Api,
};
