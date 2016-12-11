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
};

module.exports = getMarkdownFiles;
module.exports = getMarkdownContent;
