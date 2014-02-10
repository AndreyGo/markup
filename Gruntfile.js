module.exports = function(grunt) {
  grunt.initConfig({
    sprite: {
      all: {
        src: ['app/img/icons/*.png'],
        imgPath: '../img/sprite.png',
        destImg: 'app/img/sprite.png',
        destCSS: 'app/styl/base/icons.styl',
        algorithm: 'binary-tree',
        cssFormat: 'stylus',
        padding: 1
      }
    }
});

  grunt.loadNpmTasks('grunt-spritesmith');

  grunt.registerTask('sprites', ['sprite']);
};
