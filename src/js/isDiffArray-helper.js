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
        if (Array.isArray(fluid.get(diffDef, "0.arrayValue"))) {
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
