/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%gpii-diff");
    require("./testDefs-compareStrings");
};

jqUnit.module("Unit tests for string diff function...");

fluid.registerNamespace("gpii.test.diff.compareStrings");
gpii.test.diff.compareStrings.runAllTests = function (that) {
    fluid.each(that.options.testDefs.strings, gpii.test.diff.compareStrings.runSingleTest);
};

gpii.test.diff.compareStrings.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = gpii.diff.compareStrings(testDef.leftValue, testDef.rightValue);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });
};

fluid.defaults("gpii.test.diff.compareStrings", {
    gradeNames: ["gpii.test.diff.testDefs.compareStrings"],
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.compareStrings.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.compareStrings();
