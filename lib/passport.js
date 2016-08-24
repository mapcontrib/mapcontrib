
import passport from 'passport';
import { Strategy as OpenStreetMapStrategy } from 'passport-openstreetmap';
import { ObjectID } from 'mongodb';
import themeApi from '../api/theme';



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
    let successRedirect = '/';
    let failRedirect = '/';

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



export default function Passport  (app, db, config) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user._id.toString());
    });


    passport.deserializeUser((userId, done) => {
        let collection = db.collection('user');

        collection.findOne({
            '_id': new ObjectID(userId)
        }, (err, user) => {
            if (user) {
                return done(null, userId);
            }

            return done(err);
        });
    });



    passport.use(
        new OpenStreetMapStrategy({
            'consumerKey': config.get('client.oauthConsumerKey'),
            'consumerSecret': config.get('client.oauthSecret'),
            'callbackURL': '/auth/callback',
            'passReqToCallback': true,
        },
        (req, token, tokenSecret, profile, done) => {
            const collection = db.collection('user');
            const userData = {
                'osmId': profile.id,
                'displayName': profile.displayName,
                'avatar': (profile._xml2json.user.img !== undefined) ? profile._xml2json.user.img['@'].href : undefined,
                'token': token,
                'tokenSecret': tokenSecret,
            };

            collection.findOne({
                'osmId': userData.osmId
            }, (err, user) => {
                if (err) {
                    return done(err);
                }

                if (user) {
                    for ( let key in userData) {
                        user[key] = userData[key];
                    }

                    themeApi.Api.findFromOwnerId(user._id.toString())
                    .then((themes) => {
                        req.session.themes = [];

                        for (let i in themes) {
                            let themeId = themes[i]._id.toString();

                            if (
                                req.session.themes.indexOf( themeId ) === -1 ||
                                themes[i].owners.indexOf('*') !== -1
                            ) {
                                req.session.themes.push( themeId );
                            }
                        }

                        collection.updateOne({
                            '_id': user._id
                        },
                        user,
                        { 'safe': true },
                        (err, results) => {
                            if (results) {
                                req.session.user = user;
                                return done(err, user);
                            }

                            return done(err);
                        });
                    });
                }
                else {
                    collection.insertOne(userData, {'safe': true}, (err, results) => {
                        if (results) {
                            const result = results.ops[0];
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


    let authenticate = passport.authenticate.bind(passport);
    let authorize = passport.authorize.bind(passport);

    app.get('/auth', connect.bind(this, authenticate));
    app.get('/connect', connect.bind(this, authorize));

    app.get('/auth/callback', connectCallback.bind(this, authenticate));
    app.get('/connect/callback', connectCallback.bind(this, authorize));
}
