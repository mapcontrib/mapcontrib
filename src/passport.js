
var passport = require('passport'),
OpenStreetMapStrategy = require('passport-openstreetmap').Strategy,
ObjectID = require('mongodb').ObjectID;


function connect(passportConnectMethod, req, res) {
    if ( req.query.successRedirect ) {
        req.session.successRedirect = req.query.successRedirect;
    }

    if ( req.query.failRedirect ) {
        req.session.failRedirect = req.query.failRedirect;
    }

    passportConnectMethod('openstreetmap')(req, res);
}

function connectCallback(passportConnectMethod, req, res) {

    var successRedirect = '/';
    var failRedirect = '/';

    if ( req.session.successRedirect ) {
        successRedirect = req.session.successRedirect;
    }

    if ( req.session.failRedirect ) {
        failRedirect = req.session.failRedirect;
    }

    passportConnectMethod('openstreetmap', {
        'successRedirect': successRedirect,
        'failureRedirect': failRedirect
    })(req, res);
}



module.exports = function Passport(app, db, settings) {

    app.use(passport.initialize());
    app.use(passport.session());


    passport.serializeUser(function(user, done) {
        done(null, user._id.toString());
    });


    passport.deserializeUser(function(userId, done) {

        var collection = db.collection('user');

        collection.findOne({
            '_id': new ObjectID(userId)
        }, function (err, user) {

            if (user) {
                return done(null, userId);
            }

            return done(err);
        });
    });



    passport.use(
        new OpenStreetMapStrategy({
            'consumerKey': settings.oauthConsumerKey,
            'consumerSecret': settings.oauthSecret,
            'callbackURL': '/auth/callback',
            'passReqToCallback': true,
        },
        function(req, token, tokenSecret, profile, done) {

            var collection = db.collection('user'),
            userData = {
                'osmId': profile.id,
                'displayName': profile.displayName,
				'avatar': (profile._xml2json.user.img !== undefined) ? profile._xml2json.user.img['@'].href : undefined,
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

                    collection.updateOne({
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
                    collection.insertOne(userData, {'safe': true}, function (err, results) {
                        if (results) {
                            result = results.ops[0];
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


    var authenticate = passport.authenticate.bind(passport);
    var authorize = passport.authorize.bind(passport);

    app.get('/auth', connect.bind(this, authenticate));
    app.get('/connect', connect.bind(this, authorize));

    app.get('/auth/callback', connectCallback.bind(this, authenticate));
    app.get('/connect/callback', connectCallback.bind(this, authorize));
};
