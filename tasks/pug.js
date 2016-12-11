const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

module.exports = function(grunt){
  grunt.config('pug', {
    compile: {
      options: {
        pretty: true,
        data: {
          articles: function(articles) {
            if(config.articles.json) {
              return require('./articles/articles.json');
            }else if(config.articles.markdown) {
              return require('./markdown_helpers')
                .getMarkdownContent('./articles/', config.articles.singles_dest);
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
  });

  grunt.loadNpmTasks('grunt-contrib-pug');
};
