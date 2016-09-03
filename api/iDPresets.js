
import fs from 'fs';
import Backbone from 'backbone';
import Sifter from 'sifter';
import CONST from '../const';


let options = {
    'CONST': undefined,
    'database': undefined,
};


function setOptions (hash) {
    options = hash;
}


class Api {
    static buildDefaults () {
        return new Promise((resolve, reject) => {
            fs.readFile(CONST.iDPresetsPath, 'utf-8', (err, data) => {
                if (err) {
                    return reject(err);
                }

                const presets = JSON.parse(data);

                if (!presets.defaults) {
                    return reject();
                }

                resolve(presets.defaults);
            });
        });
    }
}



export default {
    setOptions,
    Api
};
