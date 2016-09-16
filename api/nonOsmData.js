
import Backbone from 'backbone';
import { ObjectID } from 'mongodb';
import NonOsmDataModel from '../public/js/model/nonOsmData';


let options = {
    CONST: undefined,
    database: undefined,
    fileApi: undefined,
};


function setOptions (hash) {
    options = hash;
}



class Api {
    static post (req, res) {
        const collection = options.database.collection('nonOsmData');
        const new_json = req.body;
        const model = new NonOsmDataModel(new_json);

        if ( !model.isValid() ) {
            return res.sendStatus(400);
        }

        delete(new_json._id);


        collection.insertOne(
            model.toJSON(),
            {safe: true},
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

        const collection = options.database.collection('nonOsmData');

        collection.find({
            _id:  new ObjectID(req.params._id)
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
        const collection = options.database.collection('nonOsmData');
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
            if(err) {
                res.sendStatus(500);

                return true;
            }

            res.send(
                results.map(result => {
                    result._id = result._id.toString();
                    return result;
                })
            );
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
                themeFragment: fragment
            })
            .toArray((err, results) => {
                if(err) {
                    return reject(500);
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

        const new_json = req.body;
        const collection = options.database.collection('nonOsmData');
        const model = new NonOsmDataModel(new_json);

        if ( !model.isValid() ) {
            res.sendStatus(400);

            return true;
        }

        delete(new_json._id);

        collection.updateOne({
            _id: new ObjectID(req.params._id)
        },
        new_json,
        {safe: true},
        (err) => {
            if(err) {
                res.sendStatus(500);

                return true;
            }

            res.send({});
        });
    }
}



export default {
    setOptions,
    Api
};
