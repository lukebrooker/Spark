'use strict';

module.exports = function(grunt) {

var srcFolder = './src/',
    buildFolder = './build/',
    devFolder = 'dev/',
    prodFolder = 'master/',
    assetsFolder = 'assets/',
    assetsRelease = grunt.option('rel') || false; // Assets release reference

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      vendors: {
        options: {
          jshintrc: srcFolder + assetsFolder + 'js/.jshintrc'
        },
        src: srcFolder + assetsFolder + 'js/vendors/**/*.js'
      },
      components: {
        options: {
          jshintrc: srcFolder + assetsFolder + 'js/.jshintrc'
        },
        src: [srcFolder + assetsFolder + 'js/components/**/*.js']
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      build: {
        src: [srcFolder + assetsFolder + 'js/vendors/**/*.js', srcFolder + assetsFolder + 'js/components/**/*.js'],
        dest: srcFolder + assetsFolder + 'js/script.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      build: {
        src: '<%= concat.build.dest %>',
        dest: srcFolder + assetsFolder + 'js/script.min.js'
      },
    },
    compass: {
      // Temporary, This will get moved and deleted from src
      dev: {
        options: {
          require : ['compass', 'breakpoint', 'rgbapng'],
          basePath: srcFolder + assetsFolder,
          sassDir : 'sass',
          cssDir: 'css',
          imagesDir: 'img',
          fontsDir: 'fonts',
          javascriptsPath: 'js',
          outputStyle: 'expanded',
          noLineComments: false,
          debugInfo: true,
          raw: 'enable_sourcemaps = true'
        }
      },
      styleguide: {
        // Temporary, This will get moved and deleted from src
        options: {
          require : ['compass', 'breakpoint', 'rgbapng'],
          basePath: srcFolder + assetsFolder,
          sassDir : 'sass',
          cssDir: 'css-sg',
          imagesDir: 'img',
          fontsDir: 'fonts',
          javascriptsPath: 'js',
          outputStyle: 'expanded',
          noLineComments: true
        }
      },
      prod: {
        options: {
          require : ['compass', 'breakpoint', 'rgbapng'],
          basePath: srcFolder + assetsFolder,
          sassDir : 'sass',
          cssDir: 'css',
          imagesDir: 'img',
          fontsDir: 'fonts',
          javascriptsPath: 'js',
          outputStyle: 'compressed',
          noLineComments: true,
          environment: 'production',
          debugInfo: false
        }
      },
      clean: {
        options: {
          clean: true,
          basePath: srcFolder + assetsFolder,
          sassDir : 'sass',
          cssDir: 'css',
          imagesDir: 'img',
          fontsDir: 'fonts',
          javascriptsPath: 'js',
          outputStyle: 'compressed',
          noLineComments: true,
          environment: 'production',
          debugInfo: false
        }
      }
    },
    // Only used for watching, thus copies to dev folder
    // Except for assets copy
    copy: {
      css: {
        files: [
          {
            expand: true,
            cwd: srcFolder + assetsFolder + 'css/',
            src: ['**'],
            dest: buildFolder + devFolder + assetsFolder + 'css/'
          }
        ]
      },
      cssSg: {
        files: [
          {
            expand: true,
            cwd: srcFolder + assetsFolder + 'css-sg/',
            src: ['**'],
            dest: buildFolder + devFolder + assetsFolder + 'css-sg/'
          }
        ]
      },
      js: {
        files: [
          {
            expand: true,
            cwd: srcFolder + assetsFolder + 'js/',
            src: ['**'],
            dest: buildFolder + devFolder + assetsFolder + 'js/'
          }
        ]
      },
      images: {
        files: [
          {
            expand: true,
            cwd: srcFolder + assetsFolder + 'img/',
            src: ['**'],
            dest: buildFolder + devFolder + assetsFolder + 'img/'
          }
        ]
      },
      fonts: {
        files: [
          {
            expand: true,
            cwd: srcFolder + assetsFolder + 'fonts/',
            src: ['**'],
            dest: buildFolder + devFolder + assetsFolder + 'fonts/'
          }
        ]
      },
      styleguide: {
        files: [
          {
            expand: true,
            cwd: srcFolder + 'styleguide/',
            src: ['**'],
            dest: buildFolder + devFolder + 'styleguide/'
          }
        ]
      },
      assets: {
        files: [
          {
            expand: true,
            cwd: buildFolder + prodFolder,
            dot: true,
            src: ['**'],
            dest: buildFolder + assetsRelease
          }
        ]
      }
    },
    shell: {
      jekyllDev: {
        command: 'rm -rf ' + buildFolder + '/' + devFolder + '/*; jekyll build --source ' + srcFolder + ' --destination ' + buildFolder + '/' + devFolder
      },
      jekyllProd: {
        command: 'rm -rf ' + buildFolder + '/' + prodFolder + '/*; jekyll build --source ' + srcFolder + ' --destination ' + buildFolder + '/' + prodFolder
      },
      jsdelete: {
        command: 'rm -rf ' + buildFolder + '/' + devFolder + '/assets/js/*'
      }
    },
    connect: {
      options: {
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          port: 5000,
          base: buildFolder + devFolder
        }
      }
    },
    open : {
      server : {
        path: 'http://localhost:5000'
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      sass: {
        files: srcFolder + assetsFolder + 'sass/**/*.scss',
        tasks: ['compass:dev', 'compass:styleguide', 'copy:css', 'copy:cssSg']
      },
      js: {
        files: ['<%= jshint.vendors.src %>', '<%= jshint.components.src %>'],
        tasks: ['jshint:components', 'concat', 'shell:jsdelete', 'copy:js']
      },
      jekyll: {
        files: [srcFolder + '**/*.html', srcFolder + '**/*.md'],
        tasks: ['shell:jekyllDev']
      },
      images: {
        files: srcFolder + assetsFolder + 'img/**/*',
        tasks: ['copy:images']
      },
      fonts: {
        files: srcFolder + assetsFolder + 'fonts/**/*',
        tasks: ['copy:fonts']
      },
      styleguide: {
        files: srcFolder + 'styleguide/**/*',
        tasks: ['copy:styleguide']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-open');

  // Default task.
  grunt.registerTask('default', '-----------------------------------------\nYou should only use tasks from here down.\n-----------------------------------------\n', function() {
    grunt.log.writeln("\n---\nThis does nothing.\nUse `grunt -h` to list available tasks.\n---");
  });

  grunt.registerTask('init', 'The initial tasks need by most others.\nYou shouldn\'t need to run this separately.\n', ['jshint:components', 'concat', 'uglify', 'compass:clean', 'compass:styleguide', 'compass:prod']);

  // Dev
  grunt.registerTask('dev', 'Build a dev version without watching or running a server.\n', ['init', 'shell:jekyllDev']);

  // Watch
  grunt.registerTask('w', 'Start a server and watch all files.\nIf a file changes re-compile and reload browser.\n', ['dev', 'connect', 'watch']);

  // Watch and open server in browser
  grunt.registerTask('wo', 'The same as `w` but also opens the project in your browser.\n', ['dev', 'connect', 'open:server', 'watch']);

  // Build to webassets
  // Use --rel=<release number> for a specific release
  grunt.registerTask('build', 'Builds a production release.\nUse --rel=<#> to add a release number.', function() {
    if (assetsRelease) {
      grunt.task.run(['init', 'shell:jekyllProd', 'copy:assets']);
    }
    else {
      grunt.task.run(['init', 'shell:jekyllProd']);
    }
  });

};

