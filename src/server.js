
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







function isLoggedIn (req, res, next) {

	if ( req.isAuthenticated() ) {

		return next();
	}

	res.sendStatus(401);
}



var CONST = requirejs('const'),
user = require('./api/user.js'),
profile = require('./api/profile.js'),
poiLayer = require('./api/poiLayer.js'),
options = {

	'CONST': CONST,
	'database': database,
};


user.setOptions( options );
profile.setOptions( options );
poiLayer.setOptions( options );


// app.get('/api/user', user.api.getAll);
app.get('/api/user/:_id', user.api.get);
app.post('/api/user', isLoggedIn, user.api.post);
app.put('/api/user/:_id', isLoggedIn, user.api.put);
// app.delete('/api/user/:_id', isLoggedIn, user.api.delete);

app.get('/api/profile', profile.api.getAll);
app.get('/api/profile/:_id', profile.api.get);
app.post('/api/profile', isLoggedIn, profile.api.post);
app.put('/api/profile/:_id', isLoggedIn, profile.api.put);
// app.delete('/api/profile/:_id', isLoggedIn, profile.api.delete);

app.get('/api/poiLayer', poiLayer.api.getAll);
app.get('/api/profile/:profileId/poiLayers', poiLayer.api.getAll);
app.get('/api/poiLayer/:_id', poiLayer.api.get);
app.post('/api/poiLayer', isLoggedIn, poiLayer.api.post);
app.put('/api/poiLayer/:_id', isLoggedIn, poiLayer.api.put);
app.delete('/api/poiLayer/:_id', isLoggedIn, poiLayer.api.delete);






if ('development' == app.get('env')) {

	app.use(errorHandler());
}

app.listen(app.get('port'), function(){

	console.log('Express server listening on port ' + app.get('port'));
});
