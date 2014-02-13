module.exports = function(grunt) {
  grunt.initConfig({
    sprite: {
      all: {
        src: ['app/img/icons/*.png'],
        imgPath: '../img/sprite2.png',
        destImg: 'app/img/sprite2.png',
        destCSS: 'app/styl/base/icons.css',
        algorithm: 'binary-tree',
        cssFormat: 'css',
        padding: 1
      }
    }
});

  grunt.loadNpmTasks('grunt-spritesmith');

  grunt.registerTask('sprites', ['sprite']);
};
