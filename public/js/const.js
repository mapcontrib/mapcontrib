let marker1 = '';
let marker2 = '';
let marker3 = '';
let markerBasicCircle = '';
let markerBasicDiamond = '';
let markerBasicDownTriangle = '';
let markerBasicLeftTriangle = '';
let markerBasicRightTriangle = '';
let markerBasicUpTriangle = '';
let markerBasicSquare = '';
let shape = '';

if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  marker1 = require('../img/markers/1.svg');
  marker2 = require('../img/markers/2.svg');
  marker3 = require('../img/markers/3.svg');
  markerBasicCircle = require('../img/markers/basicCircle.svg');
  markerBasicDiamond = require('../img/markers/basicDiamond.svg');
  markerBasicDownTriangle = require('../img/markers/basicDownTriangle.svg');
  markerBasicLeftTriangle = require('../img/markers/basicLeftTriangle.svg');
  markerBasicRightTriangle = require('../img/markers/basicRightTriangle.svg');
  markerBasicUpTriangle = require('../img/markers/basicUpTriangle.svg');
  markerBasicSquare = require('../img/markers/basicSquare.svg');
  shape = require('../img/shape.svg');
  /* eslint-enable */
}

const colors = {
  white: '#fff',
  black: '#000',

  yellow: '#F8DC00',
  lightYellow: '#fce94f',
  darkYellow: '#c4a000',

  orange: '#F8981D',
  lightOrange: '#f9aa45',
  darkOrange: '#db7e07',

  red: '#E85657',
  lightRed: '#ea6364',
  darkRed: '#cc1c1d',

  brown: '#B46F00',
  lightBrown: '#e9b96e',
  darkBrown: '#8f5902',

  purple: '#553445',
  lightPurple: '#5e3a4d',
  darkPurple: '#291921',

  blue: '#38B8E2',
  lightBlue: '#5cc5e7',
  darkBlue: '#1c98c1',

  turquoise: '#00B6AD',
  lightTurquoise: '#00bbb2',
  darkTurquoise: '#00837d',

  green: '#1D9650',
  lightGreen: '#1f9f55',
  darkGreen: '#156b39',

  gray: '#eee',
  lightGray: '#f3f3f3',
  darkGray: '#e4e4e4',

  anthracite: '#3B3F45',
  lightAnthracite: '#4e535b',
  darkAnthracite: '#23262a'
};

export default {
  colors,

  apiPath: '/api',

  osm: {
    changesetCreatedBy: 'MapContrib {version}',
    changesetComment:
      'Contribution sent from the following MapContrib theme: {url}'
  },

  tooltip: {
    showDelay: 500, // ms
    hideDelay: 0 // ms
  },

  map: {
    panPadding: {
      top: 10,
      left: 73,
      bottom: 20,
      right: 73
    },

    wayPolygonOptions: {
      color: colors.orange,
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    },

    wayPolylineOptions: {
      color: colors.orange,
      weight: 8,
      opacity: 0.8
    },

    markerCLusterPolygonOptions: {
      stroke: false,
      color: colors.anthracite,
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5
    },

    markers: {
      marker1: {
        iconSize: [50, 50],
        iconAnchor: [25, 43],
        popupAnchor: [0, -36],
        className: 'marker marker-1',
        html: marker1
      },
      marker2: {
        iconSize: [50, 50],
        iconAnchor: [25, 43],
        popupAnchor: [0, -36],
        className: 'marker marker-2',
        html: marker2
      },
      marker3: {
        iconSize: [50, 50],
        iconAnchor: [25, 43],
        popupAnchor: [0, -36],
        className: 'marker marker-3',
        html: marker3
      },
      markerBasicCircle: {
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -8],
        className: 'marker marker-basic-circle',
        html: markerBasicCircle
      },
      markerBasicDiamond: {
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -8],
        className: 'marker marker-basic-diamond',
        html: markerBasicDiamond
      },
      markerBasicSquare: {
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -8],
        className: 'marker marker-basic-square',
        html: markerBasicSquare
      },
      markerBasicDownTriangle: {
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -8],
        className: 'marker marker-basic-down-triangle',
        html: markerBasicDownTriangle
      },
      markerBasicLeftTriangle: {
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -8],
        className: 'marker marker-basic-left-triangle',
        html: markerBasicLeftTriangle
      },
      markerBasicRightTriangle: {
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -8],
        className: 'marker marker-basic-right-triangle',
        html: markerBasicRightTriangle
      },
      markerBasicUpTriangle: {
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [0, -8],
        className: 'marker marker-basic-up-triangle',
        html: markerBasicUpTriangle
      }
    },

    shape: {
      html: shape
    },

    markerIconType: {
      library: 1,
      external: 2
    },

    tiles: {
      osm: {
        name: 'OpenStreetMap',
        attribution:
          'Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: ['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'],
        minZoom: 0,
        maxZoom: 19
      },
      mapboxStreetsSatellite: {
        name: 'Mapbox Streets Satellite',
        attribution:
          'Données &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a> - Tiles <a href="https://www.mapbox.com" rel="noopener noreferrer" target="_blank">Mapbox</a>',
        urlTemplate: [
          'https://{s}.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwY29udHJpYiIsImEiOiJjaWt6YTd1OTYwMDY3d25tMHN2b2hhaTJuIn0.HtC_5kFI2ZEZs7ouqfXTcw'
        ],
        minZoom: 0,
        maxZoom: 22
      },
      watercolor: {
        name: 'Watercolor',
        attribution:
          'Tiles <a href="http://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a> under <a href="http://creativecommons.org/licenses/by/3.0" rel="noopener noreferrer" target="_blank">CC BY 3.0</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: ['http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'],
        minZoom: 0,
        maxZoom: 18
      },
      osmMonochrome: {
        name: 'OSM Monochrome',
        attribution:
          'Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: ['http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'],
        minZoom: 1,
        maxZoom: 18
      },
      osmOutdoors: {
        name: 'OSM Outdoors',
        attribution:
          'Tiles &copy; <a href="http://www.thunderforest.com/outdoors" rel="noopener noreferrer" target="_blank">Gravitystorm</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: [
          'https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=ef27143f76a7437ca80ab9c0b19e0f49'
        ],
        minZoom: 0,
        maxZoom: 20
      },
      osmRoads: {
        name: 'OSM Roads',
        attribution:
          'Tiles &copy; <a href="http://giscience.uni-hd.de" rel="noopener noreferrer" target="_blank">GIScience Research Group at Heidelberg University</a> - Data &copy;  <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: [
          'http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}'
        ],
        minZoom: 0,
        maxZoom: 19
      },
      landscape: {
        name: 'Landscape',
        attribution:
          'Tiles &copy; <a href="http://www.thunderforest.com/outdoors" rel="noopener noreferrer" target="_blank">Gravitystorm</a> - Data <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: [
          'https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=ef27143f76a7437ca80ab9c0b19e0f49'
        ],
        minZoom: 0,
        maxZoom: 20
      },
      toner: {
        name: 'Toner',
        attribution:
          'Tiles <a href="http://stamen.com" rel="noopener noreferrer" target="_blank">Stamen Design</a> under <a href="http://creativecommons.org/licenses/by/3.0" rel="noopener noreferrer" target="_blank">CC BY 3.0</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: ['http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png'],
        minZoom: 0,
        maxZoom: 20
      },
      transport: {
        name: 'Transport',
        attribution:
          'Tiles &copy; <a href="http://www.thunderforest.com/outdoors" rel="noopener noreferrer" target="_blank">Gravitystorm</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: [
          'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=ef27143f76a7437ca80ab9c0b19e0f49'
        ],
        minZoom: 0,
        maxZoom: 20
      },
      hot: {
        name: 'Humanitarian (HOT)',
        attribution:
          'Tiles &copy; <a href="http://hotosm.org" rel="noopener noreferrer" target="_blank">HOT</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: ['https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'],
        minZoom: 0,
        maxZoom: 20
      },
      openCycleMap: {
        name: 'OpenCycleMap',
        attribution:
          'Tiles &copy; <a href="http://www.opencyclemap.org" rel="noopener noreferrer" target="_blank">OpenCycleMap</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: [
          'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=ef27143f76a7437ca80ab9c0b19e0f49'
        ],
        minZoom: 0,
        maxZoom: 20
      },
      hikeBikeMap: {
        name: 'HikeBikeMap',
        attribution:
          'Tiles &copy; <a href="http://www.hikebikemap.org" rel="noopener noreferrer" target="_blank">HikeBikeMap</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: ['http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png'],
        minZoom: 0,
        maxZoom: 20
      },
      hydda: {
        name: 'Hydda',
        attribution:
          'Tiles &copy; <a href="http://openstreetmap.se" rel="noopener noreferrer" target="_blank">OpenStreetMap Sweden</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: [
          'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'
        ],
        minZoom: 0,
        maxZoom: 18
      },
      openTopoMap: {
        name: 'OpenTopoMap',
        attribution:
          'Tiles &copy; <a href="https://opentopomap.org" rel="noopener noreferrer" target="_blank">OpenTopoMap</a> under <a href="https://creativecommons.org/licenses/by-sa/3.0" rel="noopener noreferrer" target="_blank">CC BY SA 3.0</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: ['https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'],
        minZoom: 1,
        maxZoom: 15
      },
      openRiverboatMap: {
        name: 'OpenRiverboatMap',
        attribution:
          'Tiles &copy; <a href="http://fluv.io" rel="noopener noreferrer" target="_blank">OpenRiverBoatMap</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: [
          'https://{s}.tile.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png'
        ],
        minZoom: 0,
        maxZoom: 20
      },
      osmFr: {
        name: 'OpenStreetMap Français',
        attribution:
          'Données &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: [
          'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png'
        ],
        minZoom: 0,
        maxZoom: 20
      },
      osmFrBano: {
        name: 'OpenStreetMap Français + BANO',
        attribution:
          'Données &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a> et <a href="https://openstreetmap.fr/bano" rel="noopener noreferrer" target="_blank">BANO</a>',
        urlTemplate: [
          'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
          'http://{s}.layers.openstreetmap.fr/bano/{z}/{x}/{y}.png'
        ],
        minZoom: 0,
        maxZoom: 19
      },
      cadastre: {
        name: 'Cadastre Français',
        attribution:
          'Données &copy; <a href="http://www.openstreetmap.org/copyright" rel="noopener noreferrer" target="_blank">OpenStreetMap</a>',
        urlTemplate: [
          'http://tms.cadastre.openstreetmap.fr/*/tout/{z}/{x}/{y}.png'
        ],
        minZoom: 0,
        maxZoom: 22
      },
      osmDe: {
        name: 'OpenStreetMap Deutschland',
        attribution:
          'Karte hergestellt aus <a href="http://osm.org" rel="noopener noreferrer" target="_blank">OpenStreetMap-Daten</a> | Lizenz: <a href="http://opendatacommons.org/licenses/odbl" rel="noopener noreferrer" target="_blank">Open Database License (ODbL)</a> | Courtesy of <a href="http://openstreetmap.de" rel="noopener noreferrer" target="_blank">OpenStreetMap.de</a>',
        urlTemplate: [
          'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
        ],
        minZoom: 0,
        maxZoom: 18
      }
    }
  },

  layerType: {
    overpass: 'overpass',
    osmose: 'osmose',
    gpx: 'gpx',
    csv: 'csv',
    geojson: 'geojson'
  },

  rootLayerType: {
    markerCluster: 'markerCluster',
    heat: 'heat'
  },

  tagType: {
    text: 'text',
    number: 'number',
    email: 'email',
    tel: 'tel',
    url: 'url',
    textarea: 'textarea',
    file: 'file',
    check: 'check',
    defaultCheck: 'defaultCheck',
    combo: 'combo',
    typeCombo: 'typeCombo'
    // multiCombo: 'multiCombo',
  },

  geocoder: {
    nominatim: 'nominatim',
    photon: 'photon'
  },

  infoDisplay: {
    popup: 'popup',
    modal: 'modal',
    column: 'column'
  },

  overPassCacheError: {
    timeout: 'timeout',
    memory: 'memory',
    badRequest: 'badRequest',
    unknown: 'unknown'
  },

  availableLocales: ['de', 'en', 'fr', 'it']
};
