
var secret_key = 'qsqodjcizeiufbvionkjqqsdfjhGJFJR76589964654jkhsdfskqdfglfser8754dgh4hjt54d89s6568765G+=)({}})',
http_port = 8080,
db = {

	'host': '127.0.0.1',
	'port': '27017',
	'name': 'rudomap',
	'options': {

		'auto_reconnect': true,
		'safe': true
	}
};




var fs = require('fs'),
path = require('path'),
format = require('util').format;




var mongo = require('mongodb'),
mongo_client = new mongo.MongoClient(new mongo.Server(db.host, db.port), db.options),
database = mongo_client.db(db.name);

database.open(function (err, db) {

	if(err) throw err;
});





var express = require('express'),
logger = require('morgan'),
multer = require('multer'),
methodOverride = require('method-override'),
session = require('express-session'),
bodyParser = require('body-parser'),
serveStatic = require('serve-static'),
cookieParser = require('cookie-parser'),
errorHandler = require('errorhandler'),
MongoStore = require('connect-mongo')(session),
app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({

	resave: true,
    saveUninitialized: true,
    secret: secret_key,
	store: new MongoStore({

		'host': db.host,
		'port': db.port,
		'db': db.name,
	}),
}));

app.set('port', http_port);
app.use(logger('dev'));
app.use(methodOverride());
app.use(multer({ 'dest': path.join(__dirname, 'upload') }));
app.use(serveStatic(path.join(__dirname, 'public')));




var requirejs = require('requirejs');

requirejs.config({

	nodeRequire: require,
	baseUrl: path.join( __dirname, 'public', 'js' ),
	paths: {

		'underscore': '../bower_components/underscore/underscore',
		'backbone': '../bower_components/backbone/backbone',
		'text': '../bower_components/text/text',
		'img': '../img',
	}
});

var CONST = requirejs('const'),
settings = requirejs('settings');



var dataDirectory = path.join(__dirname, 'upload');

if ( !fs.existsSync( dataDirectory ) ) {

	fs.mkdirSync(dataDirectory);
}






var passport = require('passport'),
OpenStreetMapStrategy = require('passport-openstreetmap').Strategy;

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function(user, done) {

	done(null, user._id.toString());
});


passport.deserializeUser(function(userId, done) {

	var collection = database.collection('user');

	collection.findOne({

		'_id': new mongo.ObjectID(userId)
	}, function (err, user) {

		if (user) {

			return done(null, userId);
		}

		return done(err);
	});
});



passport.use(new OpenStreetMapStrategy({

		'consumerKey': settings.oauthConsumerKey,
		'consumerSecret': settings.oauthSecret,
		'callbackURL': '/auth/openstreetmap/callback',
		'passReqToCallback': true,
	},
	function(req, token, tokenSecret, profile, done) {

		if (req.user) {

			return done(null, false);
		}


		var collection = database.collection('user'),
		userData = {

			'osmId': profile.id,
			'displayName': profile.displayName,
			'avatar': profile._xml2json.user.img['@'].href,
			'token': token,
			'tokenSecret': tokenSecret,
		};


		collection.findOne({

			'osmId': userData.osmId
		}, function (err, user) {

			if (err) {

				return done(err);
			}

			if (user) {

				for ( var key in userData) {

					user[key] = userData[key];
				}

				collection.update({

					'_id': user._id
				},
				user,
				{ 'safe': true },
				function (err, results) {

					if (results) {

						return done(err, user);
					}

					return done(err);
				});

				return;
			}

			collection.insert(userData, {'safe': true}, function (err, results) {

				if (results) {

					return done(err, results[0]);
				}

				return done(err);
			});
		});
	}
));




app.get('/auth/openstreetmap', passport.authenticate('openstreetmap'));


app.get('/auth/openstreetmap/callback', passport.authenticate('openstreetmap', {

	'successRedirect': '/',
	'failureRedirect': '/#oups'
}));


app.get('/connect/openstreetmap', passport.authorize('openstreetmap'));


app.get('/connect/openstreetmap/callback', passport.authorize('openstreetmap', {

	'successRedirect': '/',
	'failureRedirect': '/#oups'
}));






function isLoggedIn(req, res, next) {

	if ( req.isAuthenticated() ) {

		return next();
	}

	res.sendStatus(401);
}





function logout(req, res) {

	req.logout();
	res.sendStatus(200);
}




function apiPost(req, res, content_type) {

	var collection = database.collection(content_type);

	collection.insert(req.body, {'safe': true}, function (err, results) {

		if(err) {

			res.sendStatus(500);

			return true;
		}

		var result = results[0];
		result._id = result._id.toString();

		res.send(result);
	});
}





function apiGetAllUser(req, res) {

	var collection = database.collection('user');

	collection.find()
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
}



function apiGetUser(req, res) {

	var _id = req.params._id;

	if ( req.params._id === 'me' ) {

		_id = req.user;
	}
	else if ( req.user !== req.params._id ) {

		res.sendStatus(401);

		return true;
	}
	else if ( req.params._id.length !== 24 ) {

		res.sendStatus(404);

		return true;
	}



	var collection = database.collection('user');

	collection.find({

		'_id': new mongo.ObjectID(_id)
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

		var user = results[0];
		user._id = user._id.toString();

		res.send(user);
	});
}


function apiGetPoiLayers(req, res) {

	if ( !req.params.profileId || !CONST.pattern.mongoId.test( req.params.profileId ) ) {

		res.sendStatus(404);

		return true;
	}


	var collection = database.collection('poiLayer');

	collection.find({

		'profileId': req.params.profileId,
	})
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
}



function apiGetAll(req, res, content_type) {

	var collection = database.collection(content_type),
	query = {};

	if ( req.query.profileId && CONST.pattern.mongoId.test( req.query.profileId ) ) {

		query.profileId = req.query.profileId;
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
}



function apiGet(req, res, content_type) {

	if (req.params._id.length != 24) {

		res.sendStatus(400);

		return true;
	}


	var collection = database.collection(content_type);

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
}






function apiPutUser(req, res) {

	if (req.user !== req.params._id) {

		res.sendStatus(401);

		return true;
	}

	if (req.params._id.length != 24) {

		res.sendStatus(404);

		return true;
	}


	var new_json = req.body,
	collection = database.collection('user');

	delete(new_json._id);

	collection.update({

		'_id': new mongo.ObjectID(req.params._id)
	},
	new_json,
	{'safe': true},
	function (err, results) {

		if(err) {

			res.sendStatus(500);

			return true;
		}

		res.send({});
	});
}



function apiPut(req, res, content_type) {

	if (req.params._id.length != 24) {

		res.sendStatus(400);

		return true;
	}


	var new_json = req.body,
	collection = database.collection(content_type);

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
}



function apiDelete(req, res, content_type) {

	if (req.params._id.length != 24) {

		res.sendStatus(400);

		return true;
	}


	var new_json = req.body,
	collection = database.collection(content_type);

	delete(new_json._id);

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




app.get('/api/user', isLoggedIn, apiGetAllUser);
app.get('/api/user/logout',	logout);
app.get('/api/user/:_id', isLoggedIn, apiGetUser);
app.put('/api/user/:_id', isLoggedIn, apiPutUser);

app.get('/api/profile/:profileId/poiLayers', apiGetPoiLayers);


var list_content_types = [

	'profile',
	'poiLayer',
];

list_content_types.forEach(function (content_type) {

	app.post(

		'/api/'+ content_type,
		isLoggedIn,
		function (req, res){ return apiPost(req, res, content_type); }
	);

	app.get(

		'/api/'+ content_type,
		function (req, res){ return apiGetAll(req, res, content_type); }
	);

	app.get(

		'/api/'+ content_type +'/:_id',
		function (req, res){ return apiGet(req, res, content_type); }
	);

	app.put(

		'/api/'+ content_type +'/:_id', isLoggedIn,
		isLoggedIn,
		function (req, res){ return apiPut(req, res, content_type); }
	);

	app.delete(

		'/api/'+ content_type +'/:_id', isLoggedIn,
		isLoggedIn,
		function (req, res){ return apiDelete(req, res, content_type); }
	);

});




if ('development' == app.get('env')) {

	app.use(errorHandler());
}

app.listen(app.get('port'), function(){

	console.log('Express server listening on port ' + app.get('port'));
});
