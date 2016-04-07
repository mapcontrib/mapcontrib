
var userApi = require('./user.js'),
themeApi = require('./theme.js'),
poiLayerApi = require('./poiLayer.js'),
presetApi = require('./preset.js');



module.exports = function Api(app, db, CONST){

    var options = {
        'CONST': CONST,
        'database': db,
    };

    userApi.setOptions( options );
    themeApi.setOptions( options );
    poiLayerApi.setOptions( options );
    presetApi.setOptions( options );


    app.get('/api/user/logout', userApi.api.logout);
    // app.get('/api/user', userApi.api.getAll);
    app.get('/api/user/:_id', userApi.api.get);
    app.post('/api/user', isLoggedIn, userApi.api.post);
    app.put('/api/user/:_id', isLoggedIn, userApi.api.put);
    // app.delete('/api/user/:_id', isLoggedIn, userApi.api.delete);

    app.get('/api/theme', themeApi.api.getAll);
    app.get('/api/theme/:_id', themeApi.api.get);
    app.post('/api/theme', isLoggedIn, themeApi.api.post);
    app.put('/api/theme/:_id', isLoggedIn, themeApi.api.put);
    // app.delete('/api/theme/:_id', isLoggedIn, themeApi.api.delete);

    app.get('/api/poiLayer', poiLayerApi.api.getAll);
    app.get('/api/theme/:themeId/poiLayers', poiLayerApi.api.getAll);
    app.get('/api/poiLayer/:_id', poiLayerApi.api.get);
    app.post('/api/poiLayer', isLoggedIn, poiLayerApi.api.post);
    app.put('/api/poiLayer/:_id', isLoggedIn, poiLayerApi.api.put);
    app.delete('/api/poiLayer/:_id', isLoggedIn, poiLayerApi.api.delete);

    app.get('/api/preset', presetApi.api.getAll);
    app.get('/api/theme/:themeId/presets', presetApi.api.getAll);
    app.get('/api/preset/:_id', presetApi.api.get);
    app.post('/api/preset', isLoggedIn, presetApi.api.post);
    app.put('/api/preset/:_id', isLoggedIn, presetApi.api.put);
    app.delete('/api/preset/:_id', isLoggedIn, presetApi.api.delete);

    app.get('/', function (req, res) {

        res.render('home');
    });


    app.get('/t/:fragment-*', function (req, res) {

        var json = {};

        if ( req.session.user ) {

            json.user = JSON.stringify( req.session.user );
        }
        else {

            json.user = '{}';
        }

        themeApi.api.findFromFragment(req.params.fragment)
        .then(function ( themeObject ) {

            var promises = [
                poiLayerApi.api.findFromThemeId(themeObject._id),
                presetApi.api.findFromThemeId(themeObject._id),
            ];

            if ( req.session.user ) {

                promises.push(

                    themeApi.api.findFromOwnerId(req.session.user._id)
                    .then(function (themes) {

                        req.session.themes = [];

                        for (var i in themes) {

                            var themeId = themes[i]._id.toString();

                            if (
                                req.session.themes.indexOf( themeId ) === -1 ||
                                themes[i].owners.indexOf('*') !== -1
                            ) {

                                req.session.themes.push( themeId );
                            }
                        }
                    })
                );
            }

            Promise.all(promises)
            .then(function ( results ) {

                json.theme = JSON.stringify( themeObject );
                json.poiLayers = JSON.stringify( results[0] );
                json.presets = JSON.stringify( results[1] );

                res.render('themeMap', json);
            })
            .catch( onPromiseError.bind(this, res) );
        })
        .catch( onPromiseError.bind(this, res) );
    });
};



function isLoggedIn (req, res, next) {

    if ( req.isAuthenticated() ) {

        return next();
    }

    res.sendStatus(401);
}



function onPromiseError(errorCode, res) {

    res.sendStatus(errorCode);
}
