/* eslint-env node */
/*

    Handlebars helper to determine whether a particular "diff" represents material that has changed.

*/
"use strict";
var fluid = fluid || require("infusion");
fluid.registerNamespace("fluid.diff.helper.hasChanged");

fluid.diff.helper.hasChanged.getHelperFunction = function () {
    return function (diffDef, options) {
        if (fluid.diff.hasChanged(diffDef)) {
            return options.fn(this);
        }
        else {
            return options.inverse(this);
        }
    };
};

fluid.defaults("fluid.diff.helper.hasChanged", {
    gradeNames: ["fluid.handlebars.helper"],
    helperName: "hasChanged",
    invokers: {
        "getHelper": {
            "funcName": "fluid.diff.helper.hasChanged.getHelperFunction",
            "args":     ["{that}"]
        }
    }
});
