/* eslint-env node */
/*

    Handlebars helper to return the right side of a single "diff".

*/
"use strict";
var fluid = fluid || require("infusion");
fluid.registerNamespace("fluid.diff.helper.rightValue");

fluid.diff.helper.rightValue.getHelperFunction = function () {
    return function (diffDef) {
        return fluid.diff.rightValue(diffDef);
    };
};

fluid.defaults("fluid.diff.helper.rightValue", {
    gradeNames: ["fluid.handlebars.helper"],
    helperName: "rightValue",
    invokers: {
        "getHelper": {
            "funcName": "fluid.diff.helper.rightValue.getHelperFunction",
            "args":     ["{that}"]
        }
    }
});
