
import { ObjectID } from 'mongodb';
import UserModel from '../public/js/model/user';


let options = {
    'CONST': undefined,
    'database': undefined,
};


function setOptions (hash) {
    options = hash;
}


let api = {
    post: function (req, res) {
        let collection = options.database.collection('user'),
        model = new UserModel(req.body);

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
    },


    get: function (req, res) {
        api.findFromId(req, res, req.params._id, (user) => {
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

        let collection = options.database.collection('user');

        collection.find({
            '_id': new ObjectID(_id)
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

            callback(result);
        });
    },


    getAll: function (req, res) {
        let collection = options.database.collection('user');

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


        let new_json = req.body,
        collection = options.database.collection('user'),
        model = new UserModel(new_json);

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
        if (req.user !== req.params._id) {
            res.sendStatus(401);

            return true;
        }

        if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {
            res.sendStatus(400);

            return true;
        }


        let collection = options.database.collection('user');

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

    logout: function (req, res) {
        req.logout();

        delete req.session.user;
        delete req.session.themes;

        res.status(200).send('OK');
    }
};



export default {
    setOptions,
    api
};
