
import config from 'config';
import userApi from './user';
import themeApi from './theme';
import layerApi from './layer';
import presetApi from './preset';



export default function Api(app, db, CONST){
    let options = {
        'CONST': CONST,
        'database': db,
    };

    userApi.setOptions( options );
    themeApi.setOptions( options );
    layerApi.setOptions( options );
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

    app.get('/api/layer', layerApi.api.getAll);
    app.get('/api/theme/:themeId/layers', layerApi.api.getAll);
    app.get('/api/layer/:_id', layerApi.api.get);
    app.post('/api/layer', isLoggedIn, layerApi.api.post);
    app.put('/api/layer/:_id', isLoggedIn, layerApi.api.put);
    app.delete('/api/layer/:_id', isLoggedIn, layerApi.api.delete);

    app.get('/api/preset', presetApi.api.getAll);
    app.get('/api/theme/:themeId/presets', presetApi.api.getAll);
    app.get('/api/preset/:_id', presetApi.api.get);
    app.post('/api/preset', isLoggedIn, presetApi.api.post);
    app.put('/api/preset/:_id', isLoggedIn, presetApi.api.put);
    app.delete('/api/preset/:_id', isLoggedIn, presetApi.api.delete);

    app.get('/', (req, res) => {
        let templateVars = {
            'user': req.session.user ? JSON.stringify(req.session.user) : '{}',
            'config': JSON.stringify( config.get('client') )
        };

        res.render('home', templateVars);
    });


    app.get('/t/:fragment-*', (req, res) => {
        let templateVars = {
            'user': req.session.user ? JSON.stringify(req.session.user) : '{}',
            'config': JSON.stringify( config.get('client') )
        };

        themeApi.api.findFromFragment(req.params.fragment)
        .then(( themeObject ) => {
            let promises = [
                layerApi.api.findFromThemeId(themeObject._id),
                presetApi.api.findFromThemeId(themeObject._id),
            ];

            if ( req.session.user ) {
                promises.push(

                    themeApi.api.findFromOwnerId(req.session.user._id)
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
                    })
                );
            }

            Promise.all(promises)
            .then(( results ) => {
                templateVars.theme = JSON.stringify( themeObject );
                templateVars.layers = JSON.stringify( results[0] );
                templateVars.presets = JSON.stringify( results[1] );

                res.render('theme', templateVars);
            })
            .catch( onPromiseError.bind(this, res) );
        })
        .catch( onPromiseError.bind(this, res) );
    });
}



function isLoggedIn (req, res, next) {
    if ( req.isAuthenticated() ) {
        return next();
    }

    res.sendStatus(401);
}



function onPromiseError(errorCode, res) {
    res.sendStatus(errorCode);
}
