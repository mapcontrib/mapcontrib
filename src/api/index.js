
import config from 'config';
import userApi from './user';
import themeApi from './theme';



export default function Api(app, db, CONST){
    let options = {
        'CONST': CONST,
        'database': db,
    };

    userApi.setOptions( options );
    themeApi.setOptions( options );


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
            templateVars.theme = JSON.stringify( themeObject );

            res.render('theme', templateVars);
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



function onPromiseError(res, errorCode) {
    res.sendStatus(errorCode);
}
