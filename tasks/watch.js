module.exports = function(grunt) {
  grunt.config('watch', {
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
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
};
