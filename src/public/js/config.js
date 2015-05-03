

requirejs.config({

	baseUrl: 'js',

	paths: {

		'templates': '../templates/templates',

		'underscore': '../bower_components/underscore/underscore',
		'backbone': '../bower_components/backbone/backbone',
		'backbone-validation': '../bower_components/backbone-validation/dist/backbone-validation-min',
		'marionette': '../bower_components/marionette/lib/backbone.marionette.min',
		'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
		'bootstrap-more': '../bower_components/bootstrap-more/bootstrap-more',
		'jquery': '../bower_components/jquery/dist/jquery.min',
		'math.format': '../bower_components/math.format/math.format',
		'leaflet': '../bower_components/leaflet/dist/leaflet',
		'animationFrame': '../bower_components/animationFrame/AnimationFrame.min',
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
	}
});
