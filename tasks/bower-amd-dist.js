
module.exports = function(grunt) {

  grunt.registerTask('bower-amd-dist', function() {
    var done = this.async();

    var dist = require("../lib/dist");

    var root = process.cwd(),
      verbose = grunt.option('verbose');

    dist(root, verbose, done);

  });
};
