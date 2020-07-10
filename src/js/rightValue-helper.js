/* eslint-env node */
/*

    Handlebars helper to return the right side of a single "diff".

*/
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.diff.helper.rightValue");

gpii.diff.helper.rightValue.getHelperFunction = function () {
    return function (diffDef) {
        return gpii.diff.rightValue(diffDef);
    };
};

fluid.defaults("gpii.diff.helper.rightValue", {
    gradeNames: ["gpii.handlebars.helper"],
    helperName: "rightValue",
    invokers: {
        "getHelper": {
            "funcName": "gpii.diff.helper.rightValue.getHelperFunction",
            "args":     ["{that}"]
        }
    }
});
