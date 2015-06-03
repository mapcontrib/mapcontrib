
module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jst');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-concat');



	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		clean: {

			build: [

				'dist/public/bower_components',
				'dist/public/templates',
			]
		},

		copy: {

			requirejs: {

				src: 'src/public/bower_components/requirejs/require.js',
				dest: 'src/public/js/require.js'
			},

			font_awesome: {

				expand: true,
				cwd: 'src/public/bower_components/font-awesome/fonts',
				src: [

					'*'
				],
				dest: 'src/public/fonts/'
			},
		},

		concat: {

			libraries_css: {

				options: {

					separator: '\n',
				},
				src: [
					'src/public/bower_components/font-awesome/css/font-awesome.min.css',
					'src/public/bower_components/bootstrap/dist/css/bootstrap.min.css',
					'src/public/bower_components/bootstrap-more/bootstrap-more.css',
					'src/public/bower_components/leaflet/dist/leaflet.css',
				],
				dest: 'src/public/css/libraries.css'
			}
		},

		less: {

			default: {

				files: {

					'src/public/css/app.css': 'src/public/css/app.less',
				}
			},
		},

		jshint: {

			options: {

				'laxbreak': true, // W014
				ignores: [

					'src/public/js/require.js'
				]
			},

			files: [

				'src/public/js/**/*.js',
			]
		},

		jst: {

			compile: {

				options: {

					processName: function(filename) {

						filename = filename.replace(/src\/public\/templates\//g, '');

						return filename;
					}
				},
				files: {

					'src/public/templates/templates.js': ['src/public/templates/**/*.html'],
				}
			},
		},

		requirejs: {

			build: {

				options: {

					appDir: 'src',
					baseUrl: 'public/js',
					dir: 'dist',
					mainConfigFile: 'src/public/js/requireConfig.js',
					findNestedDependencies: true,
					removeCombined: true,
					skipDirOptimize: true,
					logLevel: 1,
					modules: [

						{ 'name': 'app' },
					],
				}
			}
		},

		watch: {

			copy_require_js: {

				files: [

					'src/public/bower_components/requirejs/require.js'
				],
				tasks: ['copy:requirejs']
			},
			copy_font_awesome: {

				files: [

					'src/public/bower_components/font-awesome/**/*'
				],
				tasks: ['copy:font_awesome']
			},
			css: {

				files: [

					'src/public/css/*.less',
				],
				tasks: ['less:default']
			},
			templates: {

				files: [

					'src/public/templates/**/*.html',
				],
				tasks: ['jst']
			},
			libraries_css: {

				files: [

					'src/bower_components/**/*.css'
				],
				tasks: [

					'concat:libraries_css'
				]
			}
		},
	});



	grunt.registerTask('default', [

		'less:default',
		'jst',
		'jshint',
		'concat:libraries_css',
		'copy:requirejs',
		'copy:font_awesome',
	]);

	grunt.registerTask('pre-commit', [

		'jshint',
	]);

	grunt.registerTask('build', [

		'default',
		'requirejs:build',
		'clean:build',
	]);
};
