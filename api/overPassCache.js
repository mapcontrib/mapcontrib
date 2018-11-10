import { spawn } from 'child_process';
import logger from '../lib/logger';
import OverPassCache from '../lib/overPassCache';

let options = {
  CONST: undefined,
  database: undefined,
  fileApi: undefined
};

function setOptions(hash) {
  options = hash;
}

class Api {
  static generate(req, res) {
    if (!options.CONST.pattern.uuid.test(req.params.uuid)) {
      res.sendStatus(400);

      return true;
    }

    const collection = options.database.collection('theme');

    collection
      .find({
        'layers.uuid': req.params.uuid
      })
      .toArray((err, results) => {
        if (err) {
          logger.error(err);
          return res.sendStatus(500);
        }

        if (results.length === 0) {
          return res.sendStatus(404);
        }

        const theme = results[0];

        for (const i in theme.layers) {
          if ({}.hasOwnProperty.call(theme.layers, i)) {
            const layer = theme.layers[i];

            if (layer.uuid === req.params.uuid) {
              res.send('ok');

              return spawn('npm', ['run', 'update-overpass-cache', layer.uuid]);
            }
          }
        }

        return res.sendStatus(404);
      });

    return true;
  }

  static cleanThemeCache(req, res) {
    if (!options.CONST.pattern.fragment.test(req.params.fragment)) {
      res.sendStatus(400);

      return true;
    }

    const collection = options.database.collection('theme');

    collection
      .find({
        fragment: req.params.fragment
      })
      .toArray((err, results) => {
        if (err) {
          logger.error(err);
          return res.sendStatus(500);
        }

        if (results.length === 0) {
          return res.sendStatus(404);
        }

        const theme = results[0];

        theme.layers.forEach(layer =>
          OverPassCache._deleteCacheFile(theme.fragment, layer.uuid)
        );

        return res.sendStatus(200);
      });

    return true;
  }
}

export default {
  setOptions,
  Api
};
