/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%fluid-diff");
    require("./testDefs-compareStrings");
};

jqUnit.module("Unit tests for string diff function...");

fluid.registerNamespace("fluid.test.diff.compareStrings");
fluid.test.diff.compareStrings.runAllTests = function (that) {
    fluid.each(that.options.testDefs.strings, fluid.test.diff.compareStrings.runSingleTest);
};

fluid.test.diff.compareStrings.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = fluid.diff.compareStrings(testDef.leftValue, testDef.rightValue, testDef.options);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });
};

fluid.defaults("fluid.test.diff.compareStrings", {
    gradeNames: ["fluid.test.diff.testDefs.compareStrings"],
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.compareStrings.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.compareStrings();
