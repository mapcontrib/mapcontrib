
import { ObjectID } from 'mongodb';
import UserModel from '../public/js/model/user';


let options = {
    CONST: undefined,
    database: undefined,
};


function setOptions(hash) {
    options = hash;
}


class Api {
    static post(req, res) {
        const collection = options.database.collection('user');
        const model = new UserModel(req.body);

        if ( !model.isValid() ) {
            res.sendStatus(400);

            return true;
        }

        collection.insertOne(req.body, { safe: true }, (err, results) => {
            if (err) {
                res.sendStatus(500);

                return true;
            }

            const result = results.ops[0];
            result._id = result._id.toString();

            return res.send(result);
        });

        return true;
    }


    static get(req, res) {
        Api.findFromId(req, res, req.params._id, (user) => {
            res.send(user);
        });
    }


    static findFromId(req, res, _id, callback) {
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

        const collection = options.database.collection('user');

        collection.find({
            _id: new ObjectID(_id),
        })
        .toArray((err, results) => {
            if (err) {
                res.sendStatus(500);

                return true;
            }

            if (results.length === 0) {
                res.sendStatus(404);

                return true;
            }

            const result = results[0];
            result._id = result._id.toString();

            return callback(result);
        });

        return true;
    }


    static getAll(req, res) {
        const collection = options.database.collection('user');

        collection.find()
        .toArray((err, results) => {
            if (err) {
                res.sendStatus(500);

                return true;
            }

            if (results.length > 0) {
                results.forEach((result) => {
                    result._id = result._id.toString();
                });
            }

            return res.send(results);
        });
    }


    static put(req, res) {
        if (req.user !== req.params._id) {
            res.sendStatus(401);

            return true;
        }

        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {
            res.sendStatus(400);

            return true;
        }


        const newJson = req.body;
        const collection = options.database.collection('user');
        const model = new UserModel(newJson);

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
                res.sendStatus(500);

                return true;
            }

            return res.send({});
        });

        return true;
    }


    static delete(req, res) {
        if (req.user !== req.params._id) {
            res.sendStatus(401);

            return true;
        }

        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {
            res.sendStatus(400);

            return true;
        }


        const collection = options.database.collection('user');

        collection.remove({
            _id: new ObjectID(req.params._id),
        },
        { safe: true },
        (err) => {
            if (err) {
                res.sendStatus(500);

                return true;
            }

            return res.send({});
        });

        return true;
    }

    static logout(req, res) {
        req.logout();

        req.session.destroy((err) => {
            if (err) {
                return res.sendStatus(500);
            }

            return res.status(200).send('OK');
        });
    }
}


export default {
    setOptions,
    Api,
};
