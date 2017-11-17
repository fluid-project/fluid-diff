/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%gpii-diff");
    require("./testDefs-compareStringsByLine");
};

jqUnit.module("Unit tests for string diff function...");

fluid.registerNamespace("gpii.test.diff.compareStringsByLine");
gpii.test.diff.compareStringsByLine.runAllTests = function (that) {
    fluid.each(that.options.testDefs.stringsByLine, gpii.test.diff.compareStringsByLine.runSingleTest);
};

gpii.test.diff.compareStringsByLine.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = gpii.diff.compareStringsByLine(testDef.leftValue, testDef.rightValue, testDef.compareStringsByLineAsMarkdown);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });
};

fluid.defaults("gpii.test.diff.compareStringsByLine", {
    gradeNames: ["gpii.test.diff.testDefs.compareStringsByLine"],
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.compareStringsByLine.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.compareStringsByLine();
