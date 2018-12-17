import path from 'path';

export default {
  pattern: {
    integer: /^[0-9]+$/,
    mongoId: /^[a-z0-9]{24}$/,
    fragment: /^[a-z0-9]{6}$/,
    uuid: /^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$/,
    osmId: /^(node|way|relation)\/\d+$/,
  },

  shapeFileExtensions: ['gpx', 'csv', 'geojson'],

  pictureExtensions: ['jpg', 'gif', 'png', 'svg'],

  iDPresetsDirectoryPath: path.join(__dirname, 'data/iD-presets'),
  iDPresetsPath: path.join(__dirname, 'data/iD-presets/presets.json'),
  iDLocalesDirectoryPath: path.join(__dirname, 'data/iD-presets/locales'),

  overPassCron: {
    secondsBetweenIterations: 5,
    secondsBetweenIterationsRetries: 60,
    tooManyRequestsTriesInARow: 5
  }
};
