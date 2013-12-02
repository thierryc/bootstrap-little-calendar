// Generated on 2013-12-02 using generator-bootstrap-less 3.2.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  // show elapsed time at the end
  require('time-grunt')(grunt);

  // configurable paths
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    autreplanete: appConfig,
    watch: {
      less: {
        files: ['<%= autreplanete.app %>/less/{,*/}*.less'],
        tasks: ['less']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= autreplanete.app %>/*.html',
          '{.tmp,<%= autreplanete.app %>}/css/{,*/}*.css',
          '{.tmp,<%= autreplanete.app %>}/scripts/{,*/}*.js',
          '<%= autreplanete.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= autreplanete.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= autreplanete.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= autreplanete.dist %>'
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= autreplanete.dist %>/*',
            '!<%= autreplanete.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= autreplanete.app %>/scripts/{,*/}*.js',
        '!<%= autreplanete.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    less: {
      main: {
        files: {
          '<%= autreplanete.app %>/css/main.css': ['<%= autreplanete.app %>/less/main.less'],
        },
        options: {
          sourceMap: true,
          sourceMapFilename: '<%= autreplanete.app %>/less/main.css.map',
          sourceMapBasepath: '<%= autreplanete.app %>/',
          sourceMapRootpath: '/'
        }
      },
      calendar: {
        files: {
          '<%= autreplanete.app %>/css/bootstrap-little-calendar.css': ['<%= autreplanete.app %>/less/bootstrap-little-calendar.less']
        },
        options: {
          sourceMap: true,
          sourceMapFilename: '<%= autreplanete.app %>/less/bootstrap-little-calendar.css.map',
          sourceMapBasepath: '<%= autreplanete.app %>/',
          sourceMapRootpath: '/'
        }
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
      dist: {}
    },*/
    // not enabled since usemin task does concat and uglify
    // check index.html to edit your build targets
    // enable this task if you prefer defining your build targets here
    /*uglify: {
      dist: {}
    },*/
    rev: {
      dist: {
        files: {
          src: [
            '<%= autreplanete.dist %>/scripts/{,*/}*.js',
            '<%= autreplanete.dist %>/css/{,*/}*.css',
            '<%= autreplanete.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= autreplanete.dist %>/fonts/{,*/}*.*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= autreplanete.app %>/index.html',
      options: {
        dest: '<%= autreplanete.dist %>'
      }
    },
    usemin: {
      html: ['<%= autreplanete.dist %>/{,*/}*.html'],
      css: ['<%= autreplanete.dist %>/css/{,*/}*.css'],
      options: {
        dirs: ['<%= autreplanete.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= autreplanete.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= autreplanete.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= autreplanete.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= autreplanete.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= autreplanete.dist %>/css/main.css': [
            '.tmp/css/{,*/}*.css',
            '<%= autreplanete.app %>/css/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= autreplanete.app %>',
          src: '*.html',
          dest: '<%= autreplanete.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= autreplanete.app %>',
          dest: '<%= autreplanete.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'images/{,*/}*.{webp,gif}'
          ]
        }]
      },
      server: {
        files: [{
        }, {
          expand: true,
          dot: true,
          cwd: '<%= autreplanete.app %>/bower_components/bootstrap/fonts/',
          dest: '<%= autreplanete.app %>/fonts/glyphicons',
          src: ['*']
        }]
      }
    },
    concurrent: {
      dist: [
        'less',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'less',
      'copy:server',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'clean:server',
    'less',
    'copy:server',
    'connect:test'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'copy:server',
    'useminPrepare',
    'concurrent',
    //'cssmin',
    'concat',
    'uglify',
    'copy',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
