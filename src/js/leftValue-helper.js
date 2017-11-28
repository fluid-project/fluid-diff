/* eslint-env node */
/*

    Handlebars helper to return the left side of a single "diff".

*/
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.diff.helper.leftValue");

gpii.diff.helper.leftValue.getHelperFunction = function () {
    return function (diffDef) {
        return gpii.diff.leftValue(diffDef);
    };
};

fluid.defaults("gpii.diff.helper.leftValue", {
    gradeNames: ["gpii.handlebars.helper"],
    helperName: "leftValue",
    invokers: {
        "getHelper": {
            "funcName": "gpii.diff.helper.leftValue.getHelperFunction",
            "args":     ["{that}"]
        }
    }
});
