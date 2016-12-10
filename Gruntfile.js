module.exports = function(grunt) {
  var config = grunt.file.readJSON('config.json');
  var single_articles_dest = 'articles/';
  const fs = require('fs');

  var getMarkdownFiles = function(path) {
    var files = fs.readdirSync(path);
    var md_files = [];

    files.forEach(
      function(f) {
        if(f.substring(f.indexOf('.')) == '.md')
          md_files.push(f);
      }
    );

    return md_files;
  };

  var getMarkdownContent = function(path) {
    var md_files = getMarkdownFiles(path);
    var articles = [];

    md_files.forEach(
      function(f) {
        articles.push({
          compiled: single_articles_dest
                          + f.substring(0, f.indexOf('.')) + '.html',
                content: fs.readFileSync(path + '/' + f)
        });
      }
    );

    return articles;
  };

  grunt.initConfig({
      watch: {
        pug: {
          files: ['pug/*.pug'],
          tasks: ['pug:compile']
        },
        sass: {
          files: ['sass/*.scss'],
          tasks: ['sass']
        },
        markdown: {
          files: ['articles/*.md'],
          tasks: ['pug:compile', 'markdown']
        }
      },
      pug: {
        compile: {
          options: {
            pretty: true,
            data: {
              articles: function(articles) {
                if(config.articles.json) {
                  return require('./articles/articles.json');
                }else if(config.articles.markdown) {
                  return getMarkdownContent('./articles/');
                }
              },
              require: require,
              config: config
            }
          },
          files: [{
            cwd: 'pug/',
            src: ['*.pug', '!single.pug'],
            dest: 'public/',
            expand: true,
            ext: '.html'
          }],
        },
        singles: {
          options: {
            pretty: true,
            data: {
              article: '<%= singleContent %>',
              require: require,
              config: config
            }
          },
          files: {
            '<%= singleFP %>' : 'pug/single.pug'
          }
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
      },
      markdown: {
        compile:{
          src: 'articles/',
          dest: single_articles_dest
        }
      }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-then');
    grunt.registerTask('build', ['pug', 'sass', 'shell']);
    grunt.registerMultiTask('markdown', 'Create single article pages from markdown', function(){
      if(config.articles.markdown) {
        var files = getMarkdownFiles('./articles/');
        var index = 0;
        var dest = this.data.dest;
        var src = this.data.src;

        var buildSingle = function(index) {
          grunt.log.writeln('Building article #' + index);
          var f = files[index];

          if(index < files.length) {
            grunt.config('singleFP',
              dest + f.substring(0, f.indexOf('.')) + '.html');
            grunt.config('singleContent',
              fs.readFileSync(src + f));
            grunt.log.writeln(grunt.config('singleFP'));
            grunt.task.run('pug:singles')
              .then("Building next single task", function() {
                buildSingle(index+1);
              }
            );
          }
        }

        if(files.length > 0) {
          grunt.log.writeln('Starting to build single articles...');
          buildSingle(0);
        }else{
          grunt.log.writeln('No articles found...');
        }
      }
    });
};
