
import { spawn } from 'child_process';


let options = {
    'CONST': undefined,
    'database': undefined,
    'fileApi': undefined,
};


function setOptions (hash) {
    options = hash;
}


class Api {
    static generate (req, res) {
        if ( !options.CONST.pattern.uuid.test( req.params.uuid ) ) {
            res.sendStatus(400);

            return true;
        }

        const collection = options.database.collection('theme');

        collection.find({
            'layers.uuid': req.params.uuid
        })
        .toArray((err, results) => {
            if(err) {
                return res.sendStatus(500);
            }

            if (results.length === 0) {
                return res.sendStatus(404);
            }

            const theme = results[0];

            if ( !Api.isThemeOwner(req, theme._id.toString()) ) {
                return res.sendStatus(401);
            }

            for (const i in theme.layers) {
                const layer = theme.layers[i];

                if ( layer.uuid === req.params.uuid ) {
                    res.send('ok');

                    return spawn('npm', ['run', 'updateOverPassCache', layer.uuid]);
                }
            }

            return res.sendStatus(404);
        });
    }


    static isThemeOwner (req, themeId) {
        if ( !req.session.user || !req.session.themes ) {
            return false;
        }

        if ( req.session.themes.indexOf( themeId ) === -1 ) {
            return false;
        }

        return true;
    }
}



export default {
    setOptions,
    Api
};
