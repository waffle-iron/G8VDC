module.exports = function(grunt) {
  return {
    options: {
      outputSourceFiles: true,
      dumpLineNumbers: 'all'
    },
    all: {
      files: {
        'css/custom.css': 'less/custom.less'
      }
    }
  };
};
