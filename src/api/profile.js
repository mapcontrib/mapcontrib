
var crypto = require('crypto'),
mongo = require('mongodb'),
requirejs = require('requirejs'),
ProfileModel = requirejs('model/profile'),
options = {

	'CONST': undefined,
	'database': undefined,
},

setOptions = function (hash) {

	options = hash;
},

api = {

	post: function (req, res) {

		var self = this,
		collection = options.database.collection('profile'),
		model = new ProfileModel(req.body);

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

			self.getNewFragment(result, req, res);
		});
	},

	getNewFragment: function (profile, req, res) {

		var fragment,
		self = this,
		collection = options.database.collection('profile'),
		shasum = crypto.createHash('sha1');

		shasum.update( [

			profile._id.toString(),
			new Date().getTime().toString()
		].join('') );

		fragment = shasum.digest('hex').substr(0, 6);

		collection.find({

			'fragment': fragment
		})
		.toArray(function (err, results) {

			if(err) {

				res.sendStatus(500);

				return true;
			}

			if (results.length === 0) {

				profile.fragment = fragment;

				collection.update({

					'_id': profile._id
				},
				{
					'$set': { 'fragment': fragment }
				},
				{'safe': true},
				function (err) {

					if(err) {

						res.sendStatus(500);

						return true;
					}

					var result = results[0];
					result._id = result._id.toString();

					res.send(result);
				});
			}
			else {

				self.getNewFragment(profile, req, res);
			}
		});
	},


	get: function (req, res) {

		if ( !req.params._id || !options.CONST.pattern.fragment.test( req.params._id ) ) {

			res.sendStatus(400);

			return true;
		}

		var collection = options.database.collection('profile');

		collection.find({

			'fragment': req.params._id
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

		var collection = options.database.collection('profile'),
		query = {};

		if ( req.query.fragment && options.CONST.pattern.mongoId.test( req.query.fragment ) ) {

			query.profileId = req.query.fragment;
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
	},


	put: function (req, res) {

		if ( !options.CONST.pattern.mongoId.test( req.params._id ) ) {

			res.sendStatus(400);

			return true;
		}


		var new_json = req.body,
		collection = options.database.collection('profile'),
		model = new ProfileModel(new_json);

		if ( !model.isValid() ) {

			res.sendStatus(400);

			return true;
		}

		delete(new_json._id);
		delete(new_json.fragment);

		collection.update({

			'fragment': req.params._id
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


		var collection = options.database.collection('profile');

		collection.remove({

			'fragment': req.params._id
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
