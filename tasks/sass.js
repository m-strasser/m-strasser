module.exports = function(grunt){
  grunt.config('sass', {
    dist: {
      files: [{
        cwd: 'sass/',
        src: '**/*.scss',
        dest: 'public/css/',
        expand: true,
        ext: '.css'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-sass');
};
