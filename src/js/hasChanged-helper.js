/* eslint-env node */
/*

    Handlebars helper to determine whether a particular "diff" represents material that has changed.

*/
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.diff.helper.hasChanged");

gpii.diff.helper.hasChanged.getHelperFunction = function () {
    return function (diffDef, options) {
        if (gpii.diff.hasChanged(diffDef)) {
            return options.fn(this);
        }
        else {
            return options.inverse(this);
        }
    };
};

fluid.defaults("gpii.diff.helper.hasChanged", {
    gradeNames: ["gpii.handlebars.helper"],
    helperName: "hasChanged",
    invokers: {
        "getHelper": {
            "funcName": "gpii.diff.helper.hasChanged.getHelperFunction",
            "args":     ["{that}"]
        }
    }
});
