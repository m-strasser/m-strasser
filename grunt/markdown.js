const fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-then');
  grunt.config('markdown', {
    compile: {
      src: config.articles.src,
      dest: config.publicDir + config.articles.singles_dest
    }
  });

  grunt.registerMultiTask('markdown', 'Create single article pages from markdown', function(){
    if(config.articles.markdown) {
      var helpers = require('./markdown_helpers');
      var index = 0;
      var dest = this.data.dest;
      var src = this.data.src;
      var files = helpers.getMarkdownFiles(src);

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
