/* eslint-env node */
"use strict";
var fluid = require("infusion");
var my    = fluid.registerNamespace("my");

fluid.require("%fluid-handlebars");
fluid.require("%fluid-diff");

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

var diff = fluid.diff.compare(oldVersion, newVersion);

fluid.defaults("my.renderer", {
    gradeNames: ["fluid.handlebars.standaloneRenderer"],
    templateDirs: ["%fluid-diff/tests/templates", "%fluid-diff/src/templates"],
    components: {
        isDiffArray: {
            type: "fluid.diff.helper.isDiffArray"
        }
    }
});

var renderer = my.renderer();
var text = renderer.render("tutorial-text", diff);
fluid.log(text);
