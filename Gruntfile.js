
/* eslint-env node */
/*
 Copyright 2017 Raising the Floor, International

 Licensed under the Educational Community License (ECL), Version 2.0 or the New
 BSD license. You may not use this file except in compliance with one these
 Licenses.

 You may obtain a copy of the ECL 2.0 License and BSD License at
 https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
 */
"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        lintAll: {
            sources: {
                md:    [ "./*.md", "./src/**/*.md", "./tests/**/*.md", "./docs/**/*.md"],
                js:    ["./src/**/*.js", "./tests/**/*.js", "./*.js"],
                json:  ["./src/**/*.json", "tests/**/*.json", "./*.json"],
                json5: ["./src/**/*.json5", "tests/**/*.json5", "./*.json5"],
                other: ["./.*"]
            }
        }
    });

    grunt.loadNpmTasks("fluid-grunt-lint-all");
    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);
};
