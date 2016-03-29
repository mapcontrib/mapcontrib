
'use strict';


if (typeof window !== 'undefined') {
    var marker1 = require('../img/markers/1.svg');
    var marker2 = require('../img/markers/2.svg');
    var marker3 = require('../img/markers/3.svg');
}
else {
    var marker1 = '';
    var marker2 = '';
    var marker3 = '';
}


module.exports = {

    'osm': {

        'changesetCreatedBy': 'MapContrib',
        'changesetComment': 'Test from MapContrib (developpement in progress)'
    },

    'pattern': {

        'integer': /^[0-9]+$/,
        'mongoId': /^[a-z0-9]{24}$/,
        'fragment': /^[a-z0-9]{6}$/,
    },

    'tooltip': {

        'showDelay': 500, // ms
        'hideDelay': 0, // ms
    },

    'map': {

        'panPadding': {

            'top': 10,
            'left': 73,
            'bottom': 20,
            'right': 73,
        },

        'wayPolygonOptions': {

            'color': '#F8981D',
            'weight': 2,
            'opacity': 1,
            'fillOpacity': 0.5,
        },

        'markers': {

            'marker1': {

                'iconSize':     [36, 42],
                'iconAnchor':   [18, 42],
                'popupAnchor':  [0, -38],
                'className': 'marker marker-1',
                'html': marker1,
            },
            'marker2': {

                'iconSize':     [36, 42],
                'iconAnchor':   [18, 42],
                'popupAnchor':  [0, -38],
                'className': 'marker marker-2',
                'html': marker2,
            },
            'marker3': {

                'iconSize':     [36, 42],
                'iconAnchor':   [18, 42],
                'popupAnchor':  [0, -38],
                'className': 'marker marker-3',
                'html': marker3,
            },
        },

        'markerIconType': {

            'library': 1,
            'external': 2,
        },

        'tiles': {

            'osmFr': {

                'name': 'OpenStreetMap Français',
                'attribution': 'Données &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 20,
            },
            'mapboxStreetsSatellite': {

                'name': 'Mapbox Streets Satellite',
                'attribution': 'Données &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> - Tiles <a href="https://www.mapbox.com" target="_blank">Mapbox</a>',
                'urlTemplate': 'http://{s}.tiles.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwY29udHJpYiIsImEiOiJjaWt6YTd1OTYwMDY3d25tMHN2b2hhaTJuIn0.HtC_5kFI2ZEZs7ouqfXTcw',
                'minZoom': 0,
                'maxZoom': 22,
            },
            'osm': {

                'name': 'OpenStreetMap',
                'attribution': 'Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': '//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 19,
            },
            'osmOutdoors': {

                'name': 'OSM Outdoors',
                'attribution': 'Tiles &copy; <a href="http://www.thunderforest.com/outdoors" target="_blank">Gravitystorm</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 20,
            },
            'osmRoads': {

                'name': 'OSM Roads',
                'attribution': 'Tiles &copy; <a href="http://giscience.uni-hd.de" target="_blank">GIScience Research Group at Heidelberg University</a> - Data &copy;  <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}',
                'minZoom': 0,
                'maxZoom': 19,
            },
            'landscape': {

                'name': 'Landscape',
                'attribution': 'Tiles &copy; <a href="http://www.thunderforest.com/outdoors" target="_blank">Gravitystorm</a> - Data <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 20,
            },
            'toner': {

                'name': 'Toner',
                'attribution': 'Tiles <a href="http://stamen.com" target="_blank">Stamen Design</a> under <a href="http://creativecommons.org/licenses/by/3.0" target="_blank">CC BY 3.0</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 20,
            },
            'transport': {

                'name': 'Transport',
                'attribution': 'Tiles &copy; <a href="http://www.thunderforest.com/outdoors" target="_blank">Gravitystorm</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://{s}.tile2.opencyclemap.org/transport/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 20,
            },
            'mapquestOpen': {

                'name': 'MapQuest Open',
                'attribution': 'Tiles <a href="http://www.mapquest.com" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 19,
            },
            'hot': {

                'name': 'Humanitarian (HOT)',
                'attribution': 'Tiles &copy; <a href="http://hotosm.org" target="_blank">HOT</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 20,
            },
            'openCycleMap': {

                'name': 'OpenCycleMap',
                'attribution': 'Tiles &copy; <a href="http://www.opencyclemap.org" target="_blank">OpenCycleMap</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 20,
            },
            'watercolor': {

                'name': 'Watercolor',
                'attribution': 'Tiles <a href="http://stamen.com" target="_blank">Stamen Design</a> under <a href="http://creativecommons.org/licenses/by/3.0" target="_blank">CC BY 3.0</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
                'minZoom': 0,
                'maxZoom': 18,
            },
            'hikeBikeMap': {

                'name': 'HikeBikeMap',
                'attribution': 'Tiles &copy; <a href="http://www.hikebikemap.org" target="_blank">HikeBikeMap</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://toolserver.org/tiles/hikebike/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 20,
            },
            'lyrk': {

                'name': 'Lyrk',
                'attribution': 'Tiles &copy; <a href="https://geodienste.lyrk.de/copyright" target="_blank">Lyrk</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://tiles.lyrk.org/ls/{z}/{x}/{y}?apikey=982c82cc765f42cf950a57de0d891076',
                'minZoom': 0,
                'maxZoom': 18,
            },
            'osmMonochrome': {

                'name': 'OSM Monochrome',
                'attribution': 'Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png',
                'minZoom': 1,
                'maxZoom': 18,
            },
            'hydda': {

                'name': 'Hydda',
                'attribution': 'Tiles &copy; <a href="http://openstreetmap.se" target="_blank">OpenStreetMap Sweden</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 18,
            },
            'openTopoMap': {

                'name': 'OpenTopoMap',
                'attribution': 'Tiles &copy; <a href="https://opentopomap.org" target="_blank">OpenTopoMap</a> under <a href="https://creativecommons.org/licenses/by-sa/3.0" target="_blank">CC BY SA 3.0</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                'minZoom': 1,
                'maxZoom': 15,
            },
            'openRiverboatMap': {

                'name': 'OpenRiverboatMap',
                'attribution': 'Tiles &copy; <a href="http://fluv.io" target="_blank">OpenRiverBoatMap</a> - Data &copy; <a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
                'urlTemplate': 'http://{s}.tile.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 20,
            },
            'osmDe': {

                'name': 'OpenStreetMap Deutschland',
                'attribution': 'Karte hergestellt aus <a href="http://osm.org" target="_blank">OpenStreetMap-Daten</a> | Lizenz: <a href="http://opendatacommons.org/licenses/odbl" target="_blank">Open Database License (ODbL)</a> | Courtesy of <a href="http://openstreetmap.de" target="_blank">OpenStreetMap.de</a>',
                'urlTemplate': 'http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png',
                'minZoom': 0,
                'maxZoom': 18,
            }
        },
    },
};
