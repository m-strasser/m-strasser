module.exports = function(grunt) {
  grunt.config('shell', {
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
    }
  });
};
