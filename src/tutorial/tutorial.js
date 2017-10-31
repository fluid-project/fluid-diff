/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
var my    = fluid.registerNamespace("my");

fluid.require("%gpii-handlebars");
fluid.require("%gpii-diff");

var oldVersion = {
    "title": "This is the old title.",
    "description": "This is the old description.",
    "author": {
        "name": "This is the old author."
    }
};

var newVersion = {
    "title": "This is the new title.",
    "description": "This is the new description.",
    "author": {
        "name": "This is the new author."
    }
};

var diff = gpii.diff.compare(oldVersion, newVersion);

fluid.defaults("my.renderer", {
    gradeNames: ["gpii.handlebars.standaloneRenderer"],
    templateDirs: ["%gpii-diff/tests/templates", "%gpii-diff/src/templates"],
    components: {
        isDiffArray: {
            type: "gpii.diff.helper.isDiffArray"
        }
    }
});

var renderer = my.renderer();
var text = renderer.render("tutorial-text", diff);
console.log(text);
