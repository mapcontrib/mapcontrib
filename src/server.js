
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
format = require('util').format,
Promise = require('es6-promise').Promise;




var mongo = require('mongodb'),
mongo_client = new mongo.MongoClient(new mongo.Server(db.host, db.port), db.options),
database = mongo_client.db(db.name);

database.open(function (err, db) {

	if(err) throw err;
});





var ejs = require('ejs'),
express = require('express'),
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

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
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
settings = requirejs('settings'),
_ = requirejs('underscore');



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
		'callbackURL': '/auth/callback',
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

						req.session.user = user;

						return done(err, user);
					}

					return done(err);
				});
			}
			else {

				collection.insert(userData, {'safe': true}, function (err, results) {

					if (results) {

						result = results[0];
						result._id = result._id.toString();

						req.session.user = result;

						return done(err, result);
					}

					return done(err);
				});
			}
		});
	}
));




app.get('/', function (req, res) {

	res.redirect('/profile-s8c2d4');
});

app.get('/auth', function (req, res) {

	if ( req.query.authCallback ) {

		req.session.authCallback = req.query.authCallback;
	}

	passport.authenticate('openstreetmap')(req, res);
});


app.get('/auth/callback', function (req, res) {

	var callbackUrl = '/';

	if ( req.session.authCallback ) {

		callbackUrl = req.session.authCallback;
	}

	passport.authenticate('openstreetmap', {

		'successRedirect': callbackUrl,
		'failureRedirect': callbackUrl +'/#oups'
	})(req, res);
});


app.get('/connect', function (req, res) {

	if ( req.query.authCallback ) {

		req.session.authCallback = req.query.authCallback;
	}

	passport.authorize('openstreetmap')(req, res);
});


app.get('/connect/callback', function (req, res) {

	var callbackUrl = '/';

	if ( req.session.authCallback ) {

		callbackUrl = req.session.authCallback;
	}

	passport.authorize('openstreetmap', {

		'successRedirect': callbackUrl,
		'failureRedirect': callbackUrl +'/#oups'
	})(req, res);
});







function isLoggedIn (req, res, next) {

	if ( req.isAuthenticated() ) {

		return next();
	}

	res.sendStatus(401);
}



var CONST = requirejs('const'),
userApi = require('./api/user.js'),
profileApi = require('./api/profile.js'),
poiLayerApi = require('./api/poiLayer.js'),
options = {

	'CONST': CONST,
	'database': database,
};


userApi.setOptions( options );
profileApi.setOptions( options );
poiLayerApi.setOptions( options );


app.get('/api/user/logout', userApi.api.logout);
// app.get('/api/user', userApi.api.getAll);
app.get('/api/user/:_id', userApi.api.get);
app.post('/api/user', isLoggedIn, userApi.api.post);
app.put('/api/user/:_id', isLoggedIn, userApi.api.put);
// app.delete('/api/user/:_id', isLoggedIn, userApi.api.delete);

app.get('/api/profile', profileApi.api.getAll);
app.get('/api/profile/:_id', profileApi.api.get);
app.post('/api/profile', isLoggedIn, profileApi.api.post);
app.put('/api/profile/:_id', isLoggedIn, profileApi.api.put);
// app.delete('/api/profile/:_id', isLoggedIn, profileApi.api.delete);

app.get('/api/poiLayer', poiLayerApi.api.getAll);
app.get('/api/profile/:profileId/poiLayers', poiLayerApi.api.getAll);
app.get('/api/poiLayer/:_id', poiLayerApi.api.get);
app.post('/api/poiLayer', isLoggedIn, poiLayerApi.api.post);
app.put('/api/poiLayer/:_id', isLoggedIn, poiLayerApi.api.put);
app.delete('/api/poiLayer/:_id', isLoggedIn, poiLayerApi.api.delete);


app.get('/profile-:fragment', function (req, res) {

	var json = {};

	if ( req.session.user ) {

		json.user = JSON.stringify( req.session.user );
	}
	else {

		json.user = '{}';
	}

	profileApi.api.findFromFragment( req, res, req.params.fragment, function ( profileObject ) {

		poiLayerApi.api.findFromProfileId( req, res, profileObject._id, function ( poiLayerObject ) {

			json.profile = JSON.stringify( profileObject );
			json.poiLayers = JSON.stringify( poiLayerObject );

			res.render('profileMap', json);
		});
	});
});




if ('development' == app.get('env')) {

	app.use(errorHandler());
}

app.listen(app.get('port'), function(){

	console.log('Express server listening on port ' + app.get('port'));
});
