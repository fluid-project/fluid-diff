/* eslint-env node */
/*

    Handlebars helper to determine whether a particular "diff" describes an array value or not.

*/
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.diff.helper.isDiffArray");

gpii.diff.helper.isDiffArray.getHelperFunction = function () {
    return function (diffDef, options) {
        // TODO: Convert this to a single fluid.get check once https://issues.fluidproject.org/browse/FLUID-6217 is resolved.
        if (Array.isArray(diffDef) && diffDef[0] !== undefined && diffDef[0].arrayValue !== undefined && Array.isArray(diffDef[0].arrayValue)) {
            return options.fn(this);
        }
        else {
            return options.inverse(this);
        }
    };
};

fluid.defaults("gpii.diff.helper.isDiffArray", {
    gradeNames: ["gpii.handlebars.helper"],
    helperName: "isDiffArray",
    invokers: {
        "getHelper": {
            "funcName": "gpii.diff.helper.isDiffArray.getHelperFunction",
            "args":     ["{that}"]
        }
    }
});
