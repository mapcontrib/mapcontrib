import path from 'path';


export default {
    'pattern': {
        'integer': /^[0-9]+$/,
        'mongoId': /^[a-z0-9]{24}$/,
        'fragment': /^[a-z0-9]{6}$/,
        'uuid': /^[a-z0-9]{8}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{4}\-[a-z0-9]{12}$/,
    },

    'shapeFileExtensions': [
        'gpx',
        'csv',
        'geojson',
    ],

    'pictureExtensions': [
        'jpg',
        'gif',
        'png',
        'svg',
    ],

    'iDPresetsDirectoryPath': path.join(__dirname, 'data/iD-presets'),
    'iDLocalesDirectoryPath': path.join(__dirname, 'data/iD-presets/locales'),
};
