

requirejs.config({

	baseUrl: 'js',

	paths: {

		'templates': '../templates/templates',
		'img': '../img',

		'text': '../bower_components/text/text',
		'underscore': '../bower_components/underscore/underscore',
		'backbone': '../bower_components/backbone/backbone',
		'backbone-validation': '../bower_components/backbone-validation/dist/backbone-validation-min',
		'marionette': '../bower_components/marionette/lib/backbone.marionette.min',
		'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
		'bootstrap-more': '../bower_components/bootstrap-more/bootstrap-more',
		'jquery': '../bower_components/jquery/dist/jquery.min',
		'jquery-ui-sortable': '../bower_components/jquery-ui-sortable/jquery-ui-sortable.min',
		'jquery-ui-touch-punch': '../bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min',
		'math.format': '../bower_components/math.format/math.format',
		'leaflet': '../bower_components/leaflet/dist/leaflet',
		'leaflet-layer-overpass': '../bower_components/leaflet-layer-overpass/dist/OverPassLayer.min',
		'animationFrame-polyfill': '../bower_components/animationFrame/AnimationFrame.min',
		'fullscreen-polyfill': '../bower_components/Fullscreen-API-Polyfill/fullscreen-api-polyfill',
		'tools': 'tools',
		'l20n': '../bower_components/l20n/dist/html/l20n.min',
		'markdown': '../bower_components/markdown/lib/markdown',
		'osm-auth': '../bower_components/osm-auth/osmauth.min',
	},

	shim: {

		'backbone-validation': {

			deps: ['backbone']
		},
		'bootstrap': {

			deps: ['jquery']
		},
		'bootstrap-more': {

			deps: ['jquery']
		},
		'leaflet-layer-overpass': {

			deps: ['leaflet']
		},
		'jquery-ui-sortable': {

			deps: ['jquery']
		},
		'jquery-ui-touch-punch': {

			deps: ['jquery-ui-sortable']
		},
		'markdown': {

			exports: 'markdown'
		},
	}
});
