
import passport from 'passport';
import { Strategy as OpenStreetMapStrategy } from 'passport-openstreetmap';
import { ObjectID } from 'mongodb';
import themeApi from '../api/theme';


function connect(passportConnectMethod, req, res) {
    if ( req.query.successRedirect ) {
        req.session.successRedirect = req.query.successRedirect;
    }

    if ( req.query.failureRedirect ) {
        req.session.failureRedirect = req.query.failureRedirect;
    }

    passportConnectMethod('openstreetmap')(req, res);
}

function connectCallback(passportConnectMethod, req, res) {
    let successRedirect = '/';
    let failureRedirect = '/';

    if ( req.session.successRedirect ) {
        successRedirect = req.session.successRedirect;
    }

    if ( req.session.failureRedirect ) {
        failureRedirect = req.session.failureRedirect;
    }

    passportConnectMethod('openstreetmap', {
        successRedirect,
        failureRedirect,
    })(req, res);
}


export default class Passport {
    init(app, db, config) {
        app.use(passport.initialize());
        app.use(passport.session());

        passport.serializeUser((user, done) => {
            done(null, user._id.toString());
        });


        passport.deserializeUser((userId, done) => {
            const collection = db.collection('user');

            collection.findOne({
                _id: new ObjectID(userId),
            }, (err, user) => {
                if (user) {
                    return done(null, userId);
                }

                return done(err);
            });
        });


        passport.use(
            new OpenStreetMapStrategy({
                consumerKey: config.get('client.oauthConsumerKey'),
                consumerSecret: config.get('client.oauthSecret'),
                callbackURL: '/auth/callback',
                passReqToCallback: true,
            },
            (req, token, tokenSecret, profile, done) => {
                const collection = db.collection('user');
                const userData = {
                    osmId: profile.id,
                    displayName: profile.displayName,
                    avatar: (profile._xml2json.user.img !== undefined) ? profile._xml2json.user.img['@'].href : undefined,
                    token,
                    tokenSecret,
                };

                collection.findOne({
                    osmId: userData.osmId,
                }, (err, user) => {
                    if (err) {
                        return done(err);
                    }

                    if (user) {
                        for ( const key in userData) {
                            if ({}.hasOwnProperty.call(userData, key)) {
                                user[key] = userData[key];
                            }
                        }

                        themeApi.Api.findFromOwnerId(user._id.toString())
                        .then((themes) => {
                            req.session.themes = [];

                            for (const i in themes) {
                                if ({}.hasOwnProperty.call(themes, i)) {
                                    const themeId = themes[i]._id.toString();

                                    if (
                                        req.session.themes.indexOf( themeId ) === -1 ||
                                        themes[i].owners.indexOf('*') !== -1
                                    ) {
                                        req.session.themes.push( themeId );
                                    }
                                }
                            }

                            collection.updateOne({
                                _id: user._id,
                            },
                            user,
                            { safe: true },
                            (error, results) => {
                                if (results) {
                                    req.session.user = user;
                                    return done(error, user);
                                }

                                return done(error);
                            });
                        });
                    }
                    else {
                        collection.insertOne(userData, { safe: true }, (error, results) => {
                            if (results) {
                                const result = results.ops[0];
                                result._id = result._id.toString();

                                req.session.user = result;

                                return done(error, result);
                            }

                            return done(error);
                        });
                    }

                    return true;
                });
            }
        ));


        const authenticate = passport.authenticate.bind(passport);
        const authorize = passport.authorize.bind(passport);

        app.get('/auth', connect.bind(this, authenticate));
        app.get('/connect', connect.bind(this, authorize));

        app.get('/auth/callback', connectCallback.bind(this, authenticate));
        app.get('/connect/callback', connectCallback.bind(this, authorize));
    }
}
