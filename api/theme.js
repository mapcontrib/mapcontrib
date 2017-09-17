import crypto from 'crypto';
import Backbone from 'backbone';
import Sifter from 'sifter';
import { ObjectID } from 'mongodb';
import logger from '../lib/logger';
import ThemeCore from '../public/js/core/theme';
import ThemeModel from '../public/js/model/theme';

let options = {
  CONST: undefined,
  database: undefined,
  fileApi: undefined
};

function setOptions(hash) {
  options = hash;
}

class Api {
  static post(req, res) {
    if (!req.session.user) {
      res.sendStatus(401);
    }

    Api.createTheme(req.session.user)
      .then(result => {
        result._id = result._id.toString();
        res.send(result);
      })
      .catch(errorCode => {
        res.sendStatus(errorCode);
      });
  }

  static createTheme(user) {
    if (!user) {
      return Promise.reject(401);
    }

    Backbone.Relational.store.reset();

    const userId = user._id.toString();
    const osmId = user.osmId.toString();
    const collection = options.database.collection('theme');
    const model = new ThemeModel({
      userId,
      owners: [osmId]
    });

    return new Promise((resolve, reject) => {
      Api.getNewFragment().then(fragment => {
        model.set('fragment', fragment);

        collection.insertOne(model.toJSON(), { safe: true }, (err, results) => {
          if (err) {
            logger.error(err);
            return reject(500);
          }

          const result = results.ops[0];

          return resolve(result);
        });
      });
    });
  }

  static getNewFragment() {
    const collection = options.database.collection('theme');
    const shasum = crypto.createHash('sha1');

    shasum.update([new Date().getTime().toString()].join(''));

    const fragment = shasum.digest('hex').substr(0, 6);

    return new Promise((resolve, reject) => {
      collection
        .find({
          fragment
        })
        .toArray((err, results) => {
          if (err) {
            logger.error(err);
            return reject(500);
          }

          if (results.length === 0) {
            return resolve(fragment);
          }

          return Api.getNewFragment();
        });
    });
  }

  static get(req, res) {
    if (!req.params._id || !options.CONST.pattern.mongoId.test(req.params._id)) {
      res.sendStatus(400);

      return true;
    }

    const collection = options.database.collection('theme');

    collection
      .find({
        _id: new ObjectID(req.params._id)
      })
      .toArray((err, results) => {
        if (err) {
          logger.error(err);
          res.sendStatus(500);

          return true;
        }

        if (results.length === 0) {
          return options.rootApi.sendPageNotFound(req, res);
        }

        const result = results[0];
        result._id = result._id.toString();

        return res.send(result);
      });

    return true;
  }

  static getAll(req, res) {
    const collection = options.database.collection('theme');
    const filters = {};

    if (req.query.hasLayer) {
      filters.layers = {
        $exists: true,
        $not: {
          $size: 0
        }
      };
    }

    if (req.query.fragment) {
      Api.findFromFragment(req.query.fragment)
        .then(theme => {
          res.send(theme);
        })
        .catch(errorCode => {
          if (errorCode === 404) {
            return options.rootApi.sendPageNotFound(req, res);
          }

          return res.sendStatus(errorCode);
        });

      return true;
    }

    collection.find(filters).toArray((err, results) => {
      if (err) {
        logger.error(err);
        res.sendStatus(500);

        return true;
      }

      if (results.length > 0) {
        results.forEach(result => {
          result._id = result._id.toString();
        });
      }

      if (req.query.q) {
        if (req.query.q.length < 3) {
          return res.status(400).send('Query too short');
        }

        const searchFields = [];

        for (const theme of results) {
          const layerfields = [];
          const localefields = [];

          for (const layer of theme.layers) {
            for (const locale in layer.locales) {
              if ({}.hasOwnProperty.call(layer.locales, locale)) {
                localefields.push(
                  [layer.locales[locale].name, layer.locales[locale].description].join(' ')
                );
              }
            }

            layerfields.push([layer.name, layer.description, layer.overpassRequest].join(' '));
          }

          for (const locale in theme.locales) {
            if ({}.hasOwnProperty.call(theme.locales, locale)) {
              localefields.push(
                [theme.locales[locale].name, theme.locales[locale].description].join(' ')
              );
            }
          }

          searchFields.push({
            name: theme.name,
            description: theme.description,
            fragment: theme.fragment,
            layers: layerfields.join(' '),
            locales: localefields.join(' ')
          });
        }

        const searchResults = [];
        const sifter = new Sifter(searchFields);
        const sifterResults = sifter.search(req.query.q, {
          fields: ['name', 'description', 'fragment', 'layers', 'locales'],
          limit: 30
        });

        for (const result of sifterResults.items) {
          searchResults.push(results[result.id]);
        }

        return res.send(searchResults);
      }

      return res.send(results);
    });

    return true;
  }

  static getUserThemes(req, res) {
    Api.findFromUserSession(req.session.user)
      .then(themes => {
        res.send(themes);
      })
      .catch(errorCode => {
        res.sendStatus(errorCode);
      });
  }

  static findFromFragment(fragment) {
    return new Promise((resolve, reject) => {
      const collection = options.database.collection('theme');

      if (!fragment || !options.CONST.pattern.fragment.test(fragment)) {
        reject(400);
        return;
      }

      collection
        .find({
          fragment
        })
        .toArray((err, results) => {
          if (err) {
            logger.error(err);
            reject(500);
            return;
          }

          if (results.length === 0) {
            reject(404);
            return;
          }

          const result = results[0];
          result._id = result._id.toString();

          resolve(result);
        });
    });
  }

  static findFromOwnerId(ownerId) {
    return new Promise((resolve, reject) => {
      const collection = options.database.collection('theme');

      if (!ownerId || !options.CONST.pattern.mongoId.test(ownerId)) {
        reject(400);
        return;
      }

      collection
        .find({
          $or: [{ owners: '*' }, { owners: ownerId }]
        })
        .toArray((err, results) => {
          if (err) {
            logger.error(err);
            reject(500);
            return;
          }

          resolve(
            results.map(result => {
              result._id = result._id.toString();
              return result;
            })
          );
        });
    });
  }

  static findFromUserSession(userSession) {
    return new Promise((resolve, reject) => {
      if (!userSession) {
        resolve([]);
        return;
      }

      const collection = options.database.collection('theme');

      collection
        .find({
          $or: [
            { owners: '*' },
            { owners: userSession._id.toString() },
            { owners: userSession.osmId.toString() }
          ]
        })
        .sort({ creationDate: -1 })
        .toArray((err, results) => {
          if (err) {
            logger.error(err);
            reject(500);
            return;
          }

          resolve(
            results.map(theme => ({
              fragment: theme.fragment,
              name: theme.name,
              color: theme.color
            }))
          );
        });
    });
  }

  static findFavoritesFromUserSession(userSession) {
    return new Promise((resolve, reject) => {
      if (!userSession) {
        resolve([]);
        return;
      }

      const userCollection = options.database.collection('user');
      const themeCollection = options.database.collection('theme');

      userCollection
        .find({
          _id: new ObjectID(userSession._id)
        })
        .toArray((err, results) => {
          if (err) {
            logger.error(err);
            reject(500);
            return;
          }

          const user = results[0];

          if (!user.favoriteThemes) {
            user.favoriteThemes = [];
          }

          themeCollection
            .find({
              fragment: {
                $in: user.favoriteThemes
              }
            })
            .toArray((err, results) => {
              if (err) {
                logger.error(err);
                reject(500);
                return;
              }

              resolve(
                results.map(theme => ({
                  fragment: theme.fragment,
                  name: theme.name,
                  color: theme.color
                }))
              );
            });
        });
    });
  }

  static findAllOwners() {
    return new Promise((resolve, reject) => {
      const collection = options.database.collection('theme');

      collection
        .find({
          owners: '*'
        })
        .toArray((err, results) => {
          if (err) {
            logger.error(err);
            reject(500);
            return;
          }

          resolve(
            results.map(result => {
              result._id = result._id.toString();
              return result;
            })
          );
        });
    });
  }

  static put(req, res) {
    if (!options.CONST.pattern.mongoId.test(req.params._id)) {
      res.sendStatus(400);

      return true;
    }

    Backbone.Relational.store.reset();

    const newJson = req.body;
    const collection = options.database.collection('theme');
    const model = new ThemeModel(newJson);

    if (!model.isValid()) {
      res.sendStatus(400);

      return true;
    }

    delete newJson._id;

    collection.updateOne(
      {
        _id: new ObjectID(req.params._id)
      },
      newJson,
      { safe: true },
      err => {
        if (err) {
          logger.error(err);
          res.sendStatus(500);

          return true;
        }

        options.fileApi.cleanObsoleteLayerFiles(model);

        return res.send({});
      }
    );

    return true;
  }

  static delete(req, res) {
    if (!options.CONST.pattern.mongoId.test(req.params._id)) {
      res.sendStatus(400);

      return true;
    }

    const collection = options.database.collection('theme');

    collection.remove(
      {
        _id: new ObjectID(req.params._id)
      },
      { safe: true },
      err => {
        if (err) {
          logger.error(err);
          res.sendStatus(500);

          return true;
        }

        return res.send({});
      }
    );

    return true;
  }

  static duplicateFromFragment(req, res) {
    if (!options.CONST.pattern.fragment.test(req.params.fragment)) {
      return res.sendStatus(400);
    }

    if (!req.session.user) {
      return res.sendStatus(401);
    }

    Api.findFromFragment(req.params.fragment)
      .then(theme => {
        Backbone.Relational.store.reset();

        const userId = req.session.user._id.toString();
        const osmId = req.session.user.osmId.toString();
        const model = new ThemeModel({
          ...theme,
          userId,
          owners: [osmId]
        });

        model.get('presets').each(preset => {
          if (!preset.get('parentUuid')) {
            preset.unset('parentUuid');
          }
        });

        model.get('presetCategories').each(presetCategory => {
          if (!presetCategory.get('parentUuid')) {
            presetCategory.unset('parentUuid');
          }
        });

        Api.getNewFragment().then(fragment => {
          model.unset('_id');
          model.set('fragment', fragment);

          model.get('layers').each(layer => {
            const fileUri = layer.get('fileUri');

            if (fileUri) {
              layer.set('fileUri', fileUri.replace(`/${req.params.fragment}/`, `/${fragment}/`));
            }
          });

          options.fileApi.duplicateFilesFromFragments(req.params.fragment, fragment);

          const collection = options.database.collection('theme');

          collection.insertOne(model.toJSON(), { safe: true }, err => {
            if (err) {
              logger.error(err);
              return res.sendStatus(500);
            }

            return res.redirect(ThemeCore.buildPath(model.get('fragment'), model.get('name')));
          });
        });
      })
      .catch(errorCode => {
        res.sendStatus(errorCode);
      });

    return true;
  }

  static deleteFromFragment(req, res) {
    if (!options.CONST.pattern.fragment.test(req.params.fragment)) {
      res.sendStatus(400);

      return true;
    }

    const collection = options.database.collection('theme');

    collection.remove(
      {
        fragment: req.params.fragment
      },
      { safe: true },
      err => {
        if (err) {
          logger.error(err);
          res.sendStatus(500);

          return true;
        }

        options.fileApi.deleteThemeDirectoryFromFragment(req.params.fragment);

        return res.redirect('/');
      }
    );

    return true;
  }
}

export default {
  setOptions,
  Api
};
