
var passport = require('passport'),
OpenStreetMapStrategy = require('passport-openstreetmap').Strategy,
ObjectID = require('mongodb').ObjectID;


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



    passport.use(new OpenStreetMapStrategy({

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
};
