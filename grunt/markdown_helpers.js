const fs = require('fs');


exports.getMarkdownFiles = function(path) {
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

exports.getMarkdownContent = function(src, dest) {
  var md_files = this.getMarkdownFiles(src);
  var articles = [];

  md_files.forEach(
    function(f) {
      articles.push({
        compiled: dest
              + f.substring(0, f.indexOf('.')) + '.html',
        content: fs.readFileSync(src + '/' + f)
      });
    }
  );

  return articles;
};
