module.exports = function(grunt) {
  var config = grunt.file.readJSON('config.json');
  grunt.initConfig({
      watch: {
        pug: {
          files: ['pug/*.pug'],
          tasks: ['pug']
        },
        sass: {
          files: ['sass/*.scss'],
          tasks: ['sass']
        }
      },
      pug: {
        options: {
          pretty: true,
        data: {
          articles: function(articles) {
            if(config.articles.json) {
              return require('./pug/articles/articles.json');
            }else if(config.articles.markdown) {
              return grunt.file.read('./pug/articles/article.md');
            }
          },
          require: require
        }
        },
        compile: {
          files: [{
            cwd: 'pug/',
            src: '**/*.pug',
            dest: 'public/',
            expand: true,
            ext: '.html'
          }]
        }
      },
      sass: {
        dist: {
          files: [{
            cwd: 'sass/',
            src: '**/*.scss',
            dest: 'public/css/',
            expand: true,
            ext: '.css'
          }]
        }
      },
      shell: {
        options: {
          stderr: false
        },
        target: {
          command: [
            'if [ ! -d "signatures" ]; then mkdir signatures; fi',
            'if [ ! -d "signatures/css" ]; then mkdir signatures/css; fi',
            'gpg2 --batch --yes --armor --detach-sig public/*.html',
            'mv public/*.html.asc signatures/',
                  'gpg2 --batch --yes --armor --detach-sig public/css/*.css',
                  'mv public/css/*.css.asc signatures/css/',
          ].join('&&')
        },
      }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('build', ['pug', 'sass', 'shell']);
};
