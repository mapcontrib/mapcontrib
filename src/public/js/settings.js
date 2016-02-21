

define([], function () {

    'use strict';

    return {

        'debug': false,

        'oauthConsumerKey': 'wPfXjdZViPvrRWSlenSWBsAWhYKarmOkOKk5WS4U',
        'oauthSecret': 'kaBZXTHZHKSk2jvBUr8vzk7JRI1cryFI08ubv7Du',

        'overpassServer': 'http://overpass-api.de/api/',
        // 'overpassServer': 'http://overpass.osm.rambler.ru/cgi/',
        // 'overpassServer': 'http://api.openstreetmap.fr/oapi/',
        'overpassTimeout': 120 * 1000, // Milliseconds

        'defaultAvatar': 'img/default_avatar.png',

        'apiPath': 'api/',

        'largeScreenMinWidth': 400,
        'largeScreenMinHeight': 500,

        'shareIframeWidth': 100,
        'shareIframeWidthUnit': '%',
        'shareIframeHeight': 400,
        'shareIframeHeightUnit': 'px',

        'newPoiMarkerShape': 'marker1',
        'newPoiMarkerIcon': 'star',
        'newPoiMarkerColor': 'gray',
    };
});
