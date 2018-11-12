import fs from 'fs-extra';
import path from 'path';
import express from 'express';
import multer from 'multer';
import config from 'config';
import logger from '../lib/logger';
import { basename } from '../public/js/core/utils';

const publicDirectory = path.resolve(__dirname, '..', 'public');
const uploadDirectory = path.resolve(__dirname, '..', 'upload');

let options = {
  CONST: undefined,
  database: undefined
};

function setOptions(hash) {
  options = hash;
}

function initDirectories(app) {
  if (!fs.existsSync(config.get('dataDirectory'))) {
    fs.mkdirpSync(config.get('dataDirectory'));
  }

  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirpSync(uploadDirectory);
  }

  app.use(express.static(publicDirectory));
  app.use('/files', express.static(config.get('dataDirectory')));
  app.use(multer({ dest: uploadDirectory }));
}

function deleteThemeDirectoryFromFragment(fragment) {
  const directory = path.resolve(publicDirectory, 'files', 'theme', fragment);

  return new Promise((resolve, reject) => {
    fs.remove(directory, err => {
      if (err) {
        logger.error(err);
        return reject(err);
      }

      return resolve();
    });
  });
}

function duplicateFilesFromFragments(oldFragment, newFragment) {
  const oldDirectory = path.resolve(
    publicDirectory,
    'files',
    'theme',
    oldFragment
  );
  const newDirectory = path.resolve(
    publicDirectory,
    'files',
    'theme',
    newFragment
  );

  return new Promise((resolve, reject) => {
    fs.copy(oldDirectory, newDirectory, err => {
      if (err) {
        logger.error(err);
        return reject(err);
      }

      return resolve();
    });
  });
}

function cleanObsoleteLayerFilesInThatDirectory(themeModel, directoryName) {
  const fragment = themeModel.get('fragment');
  const layers = themeModel.get('layers').models;
  const directory = path.resolve(
    publicDirectory,
    `files/theme/${fragment}/${directoryName}/`
  );

  try {
    fs.statSync(directory);
  } catch (e) {
    return false;
  }

  const re = new RegExp(`^/files/theme/${fragment}/${directoryName}/`);
  const cacheRe = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}.geojson$/;
  const modelFiles = [];

  for (const layer of layers) {
    const fileUri = layer.get('fileUri');

    if (fileUri && re.test(fileUri)) {
      const fileUriBaseName = basename(fileUri);
      modelFiles.push(fileUriBaseName);

      if (cacheRe.test(fileUriBaseName)) {
        const layerUuid = layer.get('uuid');
        modelFiles.push(`${layerUuid}-archived.json`);
        modelFiles.push(`${layerUuid}-modified.json`);
        modelFiles.push(`${layerUuid}-deleted.json`);
      }
    }
  }

  return fs.readdir(directory, (err, directoryFiles) => {
    if (err) {
      logger.error(err);
      return;
    }

    for (const file of directoryFiles) {
      const filePath = path.resolve(directory, file);

      if (modelFiles.indexOf(file) === -1) {
        fs.unlink(filePath);
        logger.info('The following obsolete file has been removed:', filePath);
      }
    }
  });
}

function cleanObsoleteLayerFiles(themeModel) {
  cleanObsoleteLayerFilesInThatDirectory(themeModel, 'shape');
  cleanObsoleteLayerFilesInThatDirectory(themeModel, 'overPassCache');
}

function uploadFile(req, res, file, directory, osmId, tagName) {
  file.originalname = file.originalname.toLowerCase();

  let i = 2;
  const fullDirectory = `${config.get('dataDirectory')}/${directory}`;
  let publicPath = `/files/${directory}/${file.originalname}`;
  let baseName = path.basename(file.originalname, `.${file.extension}`);
  let fullPath = `${fullDirectory}/${file.originalname}`;

  if (osmId && tagName) {
    baseName = `${osmId}_${tagName}`;
    publicPath = `/files/${directory}/${baseName}.${file.extension}`;
    fullPath = `${fullDirectory}/${baseName}.${file.extension}`;
  }

  if (!fs.existsSync(fullDirectory)) {
    fs.mkdirpSync(fullDirectory);
  }

  while (fs.existsSync(fullPath) === true) {
    const fileName = `${baseName}_${i}.${file.extension}`;

    publicPath = `/files/${directory}/${fileName}`;
    fullPath = `${fullDirectory}/${fileName}`;
    i += 1;
  }

  return new Promise((resolve, reject) => {
    fs.move(file.path, fullPath, err => {
      if (err) {
        logger.error(err);
        return reject(err);
      }

      const result = {};
      result[file.fieldname] = publicPath;
      return resolve(result);
    });
  });
}

class Api {
  static postShapeFile(req, res) {
    const fragment = req.query.fragment;
    const promises = [];

    for (const field in req.files) {
      if ({}.hasOwnProperty.call(req.files, field)) {
        const file = req.files[field];
        const fileSize = file.size / 1024;
        const maxFileSize = config.get('client.uploadMaxShapeFileSize');

        if (fileSize > maxFileSize) {
          return res.sendStatus(413);
        }

        const extension = file.extension.toLowerCase();

        if (options.CONST.shapeFileExtensions.indexOf(extension) === -1) {
          return res.sendStatus(415);
        }

        promises.push(
          uploadFile(req, res, req.files[field], `theme/${fragment}/shape`)
        );
      }
    }

    return Promise.all(promises)
      .then(results => {
        res.send(results);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  }

  static postNonOsmDataFile(req, res) {
    const fragment = req.query.fragment;
    const osmId = req.query.osmId;
    const promises = [];

    for (const field in req.files) {
      if ({}.hasOwnProperty.call(req.files, field)) {
        const file = req.files[field];
        const tagName = field.replace(/^fileInput_\w+_(.*)$/g, '$1');
        const fileSize = file.size / 1024;
        const maxFileSize = config.get('client.uploadMaxNonOsmDataFileSize');

        if (fileSize > maxFileSize) {
          return res.status(413).send({ fileInput: field });
        }

        promises.push(
          uploadFile(
            req,
            res,
            req.files[field],
            `theme/${fragment}/nonOsmData`,
            osmId,
            tagName
          )
        );
      }
    }

    return Promise.all(promises)
      .then(results => {
        res.send(results);
      })
      .catch(() => {
        res.sendStatus(500);
      });
  }
}

export default {
  setOptions,
  initDirectories,
  deleteThemeDirectoryFromFragment,
  duplicateFilesFromFragments,
  cleanObsoleteLayerFiles,
  Api
};
