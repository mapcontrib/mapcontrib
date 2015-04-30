
// Configuration
var secret_key = 'qsqodjcizeiufbvionkjqqsdfjhGJFJR76589964654jkhsdfskqdfglfser8754dgh4hjt54d89s6568765G+=)({}})',
login_pattern = /^[a-zA-Z0-9\-]{3,}$/,
http_port = 8080,
db_host = '127.0.0.1',
db_port = '27017',
db_name = 'openmapper',
db_options = {

	'auto_reconnect': true,
	'safe': true
};


// Dépendances
var mongo = require('mongodb'),
fs = require('fs'),
path = require('path'),
child_process = require('child_process'),

mongo_client = new mongo.MongoClient(new mongo.Server(db_host, db_port), db_options),
database = mongo_client.db(db_name),
format = require('util').format;



database.open(function (err, db) {

	if(err) throw err;
});




var directory = path.join(__dirname, 'upload');

if ( !fs.existsSync( directory ) ) {

	fs.mkdirSync(directory);
}




var express = require('express'),
logger = require('morgan'),
multer = require('multer'),
methodOverride = require('method-override'),
session = require('express-session'),
bodyParser = require('body-parser'),
serveStatic = require('serve-static'),
cookieParser = require('cookie-parser'),
errorHandler = require('errorhandler'),
app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('port', http_port);
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
                  saveUninitialized: true,
                  secret: secret_key }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ 'dest': path.join(__dirname, 'upload') }));
app.use(serveStatic(path.join(__dirname, 'public')));







function authenticate(req, res) {

	if (!req.query.login || !req.query.password) {

		res.status(400).send({

			'error': 'Parametre manquant'
		});

		return true;
	}

	if(!login_pattern.test(req.query.login)) {

		res.status(400).send({

			'error': 'Mauvais parametre'
		});

		return true;
	}


	var collection = database.collection('user');

	collection.find({

		'login': req.query.login,
		'password': req.query.password
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

		delete(user.password);

		req.session.user_id = user._id;
		req.session.structure_id = user.structure_id;
		req.session.is_admin = user.is_admin;

		res.send(user);
	});
};




function deauthenticate(req, res) {

	req.session.destroy();
	res.sendStatus(200);

	return true;
};




function apiPost(req, res, content_type) {

	if (!req.session.user_id || !req.session.structure_id) {

		res.sendStatus(401);

		return true;
	}

	if (req.body.structure_id != req.session.structure_id) {

		res.status(400).send({

			'error': 'Mauvais parametre'
		});

		return true;
	}


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
};




function apiPostStructure(req, res) {

	if (!req.session.user_id || !req.session.is_admin) {

		res.sendStatus(401);

		return true;
	}


	var collection = database.collection('structure');

	collection.insert(req.body, {'safe': true}, function (err, results) {

		if(err) {

			res.sendStatus(500);

			return true;
		}

		var result = results[0];
		result._id = result._id.toString();

		res.send(result);
	});
};




function apiPostUser(req, res) {

	if (!req.session.user_id || !req.session.is_admin) {

		res.sendStatus(401);

		return true;
	}


	var collection = database.collection('user');

	collection.insert(req.body, {'safe': true}, function (err, results) {

		if(err) {

			res.sendStatus(500);

			return true;
		}

		var result = results[0];
		result._id = result._id.toString();

		res.send(result);
	});
};




function apiGetAllUser(req, res) {

	if (!req.session.user_id || !req.session.is_admin) {

		res.sendStatus(401);

		return true;
	}


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
};



function apiGetUser(req, res) {

	if (!req.session.user_id || !req.session.structure_id) {

		res.sendStatus(401);

		return true;
	}


	var _id = req.params._id;

	// Appeler api/user/me permet de vérifier qu'on a une session ouverte ou non
	// C'est normalement la première requête envoyée depuis l'application
	// Cela retourne son propre JSON d'utilisateur
	if (req.params._id == 'me') {

		_id = req.session.user_id;
	}
	else if (req.params._id.length != 24) {

		res.sendStatus(404);

		return true;
	}



	var collection = database.collection('user');

	collection.find({

		'_id': new mongo.ObjectID(_id),
		'structure_id': req.session.structure_id
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

		delete(user.password);

		res.send(user);
	});
};



function apiGetAllStructure(req, res) {

	if (!req.session.user_id || !req.session.is_admin) {

		res.sendStatus(401);

		return true;
	}


	var collection = database.collection('structure');

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
};


function apiGetStructure(req, res) {

	if (!req.session.user_id || !req.session.structure_id) {

		res.sendStatus(401);

		return true;
	}

	if (req.params._id.length != 24) {

		res.sendStatus(400);

		return true;
	}



	var collection = database.collection('structure');

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
};



function apiGetAll(req, res, content_type) {

	if (!req.session.user_id || !req.session.structure_id) {

		res.sendStatus(401);

		return true;
	}


	var collection = database.collection(content_type);

	collection.find({

		'structure_id': req.session.structure_id
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
};



function apiGet(req, res, content_type) {

	if (!req.session.user_id || !req.session.structure_id) {

		res.sendStatus(401);

		return true;
	}

	if (req.params._id.length != 24) {

		res.sendStatus(400);

		return true;
	}


	var collection = database.collection(content_type);

	collection.find({

		'_id': new mongo.ObjectID(req.params._id),
		'structure_id': req.session.structure_id
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
};





function apiPutStructure(req, res) {

	if (!req.session.user_id) {

		res.sendStatus(401);

		return true;
	}

	if (req.params._id.length != 24) {

		res.sendStatus(400);

		return true;
	}


	var new_json = req.body,
	collection = database.collection('structure');

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
};


function apiPutUser(req, res) {

	if (!req.session.user_id) {

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
};



function apiPut(req, res, content_type) {

	if (!req.session.user_id || !req.session.structure_id) {

		res.sendStatus(401);

		return true;
	}

	if (req.params._id.length != 24) {

		res.sendStatus(400);

		return true;
	}


	var new_json = req.body,
	collection = database.collection(content_type);

	delete(new_json._id);

	collection.update({

		'_id': new mongo.ObjectID(req.params._id),
		'structure_id': req.session.structure_id
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
};



function apiDelete(req, res, content_type) {

	if (!req.session.user_id || !req.session.structure_id) {

		res.sendStatus(401);

		return true;
	}

	if (req.params._id.length != 24) {

		res.sendStatus(400);

		return true;
	}


	var new_json = req.body,
	collection = database.collection(content_type);

	delete(new_json._id);

	collection.remove({

		'_id': new mongo.ObjectID(req.params._id),
		'structure_id': req.session.structure_id
	},
	{'safe': true},
	function (err) {

		if(err) {

			res.sendStatus(500);

			return true;
		}

		res.send({});
	});
};




app.get		('/api/user/authenticate',		authenticate);
app.get		('/api/user/deauthenticate',	deauthenticate);

app.get		('/api/user',					apiGetAllUser);
app.get		('/api/user/:_id',				apiGetUser);
app.post	('/api/user',					apiPostUser);
app.put		('/api/user/:_id',				apiPutUser);

app.get		('/api/structure',				apiGetAllStructure);
app.get		('/api/structure/:_id',			apiGetStructure);
app.post	('/api/structure',				apiPostStructure);
app.put		('/api/structure/:_id',			apiPutStructure);


var list_content_types = [

	'stuff'
];

list_content_types.forEach(function (content_type) {

	app.post	('/api/'+ content_type,				function (req, res){ return apiPost(req, res, content_type); });
	app.get		('/api/'+ content_type,				function (req, res){ return apiGetAll(req, res, content_type); });
	app.get		('/api/'+ content_type +'/:_id',	function (req, res){ return apiGet(req, res, content_type); });
	app.put		('/api/'+ content_type +'/:_id',	function (req, res){ return apiPut(req, res, content_type); });
	app.delete	('/api/'+ content_type +'/:_id',	function (req, res){ return apiDelete(req, res, content_type); });
});




if ('development' == app.get('env')) {

	app.use(errorHandler());
}

app.listen(app.get('port'), function(){

	console.log('Express server listening on port ' + app.get('port'));
});