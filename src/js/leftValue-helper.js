/* eslint-env node */
/*

    Handlebars helper to return the left side of a single "diff".

*/
"use strict";
var fluid = fluid || require("infusion");
fluid.registerNamespace("fluid.diff.helper.leftValue");

fluid.diff.helper.leftValue.getHelperFunction = function () {
    return function (diffDef) {
        return fluid.diff.leftValue(diffDef);
    };
};

fluid.defaults("fluid.diff.helper.leftValue", {
    gradeNames: ["fluid.handlebars.helper"],
    helperName: "leftValue",
    invokers: {
        "getHelper": {
            "funcName": "fluid.diff.helper.leftValue.getHelperFunction",
            "args":     ["{that}"]
        }
    }
});
