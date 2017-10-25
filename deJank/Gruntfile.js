'use strict';

var ngrok = require('ngrok');

module.exports = function(grunt){

//Load Grunt tasks
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-critical');
grunt.loadNpmTasks('grunt-tinyimg');
require('load-grunt-tasks')(grunt);

grunt.initConfig({
cssmin: {
  dist:{
      expand: true,
      src:['src/css/*.css', 'src/css/!*.min.css'],
      dest: 'dist/css/',
      ext: '.min.css'
    }
},
uglify: {
      dist: {
        src:'src/js/perfmatters.js',
        dest: 'dist/js/perfmatters.min.js'
    }
  },
critical: {
    test: {
        options: {
            base: './',
            css: [
                'src/css/style.css',
                'src/css/print.css'
            ],
            width: 1024,
            height: 768,
            minify: true
        },
        src: 'index.html',
        dest: 'index-critical.html'
    }
},
tinyimg: {
      static: {
        files: {
          'dist/img/profilepic.png': 'src/img/profilepic.jpg',
          'dist/img/mobilewebdev.png': 'src/img/mobilewebdev.jpg',
          'dist/img/cam_be_like.png': 'src/img/cam_be_like.jpg',
          'dist/img/2048.png': 'src/img/2048.png',
        }
      },
      dynamic: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.{png,jpg,svg}'],
          dest: 'dist/'
        }]
      }
    },

pagespeed: {
   options: {
    nokey: true,
     locale: 'en_GB',
      threshold: 40
   },
   local: {
    options: {
     strategy: 'desktop'
   }
  },
   mobile: {
    options: {
     strategy: 'mobile'
     }
    }
   }

});

// Register customer task for ngrok
grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
var done = this.async();
var port = 9292;

ngrok.connect(port, function(err, url) {
  if (err !== null) {
    grunt.fail.fatal(err);
    return done();
  }
  grunt.config.set('pagespeed.options.url', url);
  grunt.task.run('pagespeed');
  done();
});
});

//Register default tasks
  grunt.registerTask('default',[
    'cssmin',
    'uglify',
    'critical',
    'tinyimg',
    'psi-ngrok'
  ]);
}
