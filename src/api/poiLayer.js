
var mongo = require('mongodb'),
requirejs = require('requirejs'),
PoiLayerModel = requirejs('model/poiLayer'),
options = {

	'CONST': undefined,
	'database': undefined,
},

setOptions = function (hash) {

	options = hash;
},

api = {

	post: function (req, res) {

		var collection = options.database.collection('poiLayer'),
		model = new PoiLayerModel(req.body);

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

		if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {

			res.sendStatus(400);

			return true;
		}

		var collection = options.database.collection('poiLayer');

		collection.find({

			'_id': new mongo.ObjectID(req.params._id)
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

			res.send(result);
		});
	},


	getAll: function (req, res) {

		var collection = options.database.collection('poiLayer'),
		query = {};

		if ( req.params.profileId && options.CONST.pattern.mongoId.test( req.params.profileId ) ) {

			query.profileId = req.params.profileId;
		}

		collection.find( query )
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

		if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {

			res.sendStatus(400);

			return true;
		}


		var new_json = req.body,
		collection = options.database.collection('poiLayer'),
		model = new PoiLayerModel(new_json);

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

		if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {

			res.sendStatus(400);

			return true;
		}


		var collection = options.database.collection('poiLayer');

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
	}
};



module.exports = {

	'setOptions': setOptions,
	'api': api,
};
