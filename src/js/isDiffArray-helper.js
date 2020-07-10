/* eslint-env node */
/*

    Handlebars helper to determine whether a particular "diff" describes an array value or not.

*/
"use strict";
var fluid = fluid || require("infusion");
fluid.registerNamespace("fluid.diff.helper.isDiffArray");

fluid.diff.helper.isDiffArray.getHelperFunction = function () {
    return function (diffDef, options) {
        if (Array.isArray(fluid.get(diffDef, "0.arrayValue"))) {
            return options.fn(this);
        }
        else {
            return options.inverse(this);
        }
    };
};

fluid.defaults("fluid.diff.helper.isDiffArray", {
    gradeNames: ["fluid.handlebars.helper"],
    helperName: "isDiffArray",
    invokers: {
        "getHelper": {
            "funcName": "fluid.diff.helper.isDiffArray.getHelperFunction",
            "args":     ["{that}"]
        }
    }
});
