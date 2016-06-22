
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import express from 'express';
import multer from 'multer';
import config from 'config';


const publicDirectory = path.join(__dirname, '..', 'public');
const uploadDirectory = path.join(__dirname, '..', 'upload');

let options = {
    'CONST': undefined,
    'database': undefined,
};


function setOptions (hash) {
    options = hash;
}


function initDirectories (app) {
    if ( !fs.existsSync( config.get('dataDirectory') ) ) {
        mkdirp.sync(config.get('dataDirectory'));
    }

    if ( !fs.existsSync( uploadDirectory ) ) {
        mkdirp.sync(uploadDirectory);
    }

    app.use(
        express.static( publicDirectory )
    );
    app.use(
        '/files',
        express.static( config.get('dataDirectory') )
    );
    app.use(
        multer({ 'dest': uploadDirectory })
    );
}



class Api {
    static postShapeFile (req, res) {
        const fragment = req.query.fragment;
        let promises = [];

        for (let field in req.files) {
            let file = req.files[field];
            const fileSize = file.size / 1024;
            const maxFileSize = config.get('client.uploadMaxShapeFileSize');

            if ( fileSize > maxFileSize) {
                res.sendStatus(413);
            }

            let extension = file.extension.toLowerCase();

            if ( options.CONST.shapeFileExtensions.indexOf(extension) === -1 ) {
                res.sendStatus(415);
            }

            promises.push(
                uploadFile(req, res, req.files[field], `theme/${fragment}/shape`)
            );
        }

        Promise.all(promises)
        .then(results => {
            res.send(results);
        })
        .catch(err => {
            res.sendStatus(500);
        });
    }
}



function uploadFile(req, res, file, directory) {
    file.originalname = file.originalname.toLowerCase();
    
    let i = 2;
    let publicPath = `/files/${directory}/${file.originalname}`;
    let fullDirectory = `${config.get('dataDirectory')}/${directory}`;
    let fullPath = `${fullDirectory}/${file.originalname}`;

    if ( !fs.existsSync( fullDirectory ) ) {
        mkdirp.sync( fullDirectory );
    }

    while (fs.existsSync(fullPath) === true) {
        let baseName = path.basename(
            file.originalname,
            `.${file.extension}`
        );
        let fileName = `${baseName}_${i}.${file.extension}`;

        publicPath = `/files/${directory}/${fileName}`;
        fullPath = `${fullDirectory}/${fileName}`;
        i++;
    }

    return new Promise((resolve, reject) => {
        fs.rename(
            file.path,
            fullPath,
            err => {
                if(err) {
                    return reject(err);
                }

                let result = {};
                result[ file.fieldname ] = publicPath;
                resolve(result);
            }
        );
    });
}



export default {
    setOptions,
    initDirectories,
    Api,
};
