
module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');



    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        copy: {

            font_awesome: {

                expand: true,
                cwd: 'src/public/bower_components/font-awesome/fonts',
                src: [

                    '*'
                ],
                dest: 'src/public/fonts/'
            },

            ionicons: {

                expand: true,
                cwd: 'src/public/bower_components/ionicons/fonts',
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
                    'src/public/bower_components/ionicons/css/ionicons.min.css',
                    'src/public/bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'src/public/bower_components/bootstrap-more/bootstrap-more.css',
                    'src/public/bower_components/awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css',
                    'src/public/bower_components/leaflet/dist/leaflet.css',
                ],
                dest: 'src/public/css/libraries.css'
            }
        },

        less: {

            default: {

                options: {

                    plugins: [

                        new (require('less-plugin-autoprefix'))({ 'browsers': ['last 4 versions'] }),
                    ],
                },
                files: {

                    'src/public/css/app.css': 'src/public/css/app.less',
                }
            },
        },

        jshint: {

            options: {

                'laxbreak': true, // W014
            },

            files: [

                'src/public/js/**/*.js',
            ]
        },

        watch: {

            copy_font_awesome: {

                files: [

                    'src/public/bower_components/font-awesome/**/*'
                ],
                tasks: ['copy:font_awesome']
            },
            copy_ionicons: {

                files: [

                    'src/public/bower_components/ionicons/fonts/**/*'
                ],
                tasks: ['copy:ionicons']
            },
            css: {

                files: [

                    'src/public/css/*.less',
                ],
                tasks: ['less:default']
            },
            libraries_css: {

                files: [

                    'src/public/bower_components/**/*.css'
                ],
                tasks: [

                    'concat:libraries_css'
                ]
            }
        },
    });



    grunt.registerTask('default', [

        'less:default',
        'jshint',
        'concat:libraries_css',
        'copy:font_awesome',
        'copy:ionicons',
    ]);

    grunt.registerTask('pre-commit', [

        'jshint',
    ]);
};
