

define([

	'text!img/markers/1_optimized.svg',
	'text!img/markers/2_optimized.svg',
	'text!img/markers/3_optimized.svg',
], function (

	marker1,
	marker2,
	marker3
) {

	'use strict';

	return {

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
			}
		},
	};
});
