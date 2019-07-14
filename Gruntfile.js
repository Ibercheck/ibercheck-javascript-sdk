(function () {
  "use strict";
}());

const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function (grunt) {
  // Force use of Unix newlines
  grunt.util.linefeed = "\n";

  grunt.initConfig({
    clean: {
      dist: {
        src: [
          "dist"
        ]
      }
    },

    karma: {
      options: {
        configFile: "karma.conf.js"
      },
      desktopCommon: {
        browsers: [
          "Chrome",
          "Firefox"
        ],
        singleRun: true
      },
      unit: {
        browsers: [
          "ChromeHeadless"
        ],
        singleRun: true
      }
    },

    ts: {
      default: {
        tsconfig: {
          passThrough: true
        }
      }
    },

    tslint: {
      options: {
        configuration: "tslint.json"
      },
      dev: {
        files: {
          src: "src/ts/**/*.ts"
        }
      }
    }
  });

  require("load-grunt-tasks")(grunt);
  require("time-grunt")(grunt);

  grunt.registerTask("build_js", ["build_ts"]);
  grunt.registerTask("build_ts", ["tslint", "ts"]);
  grunt.registerTask("default", ["clean:dist", "build_js", "test_js"]);
  grunt.registerTask("test", ["test_full"]);
  grunt.registerTask("test_full", ["karma"]);
  grunt.registerTask("test_js", ["karma:unit"]);
};
