/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%gpii-diff");
    require("./testDefs-compareMarkdown");
};

jqUnit.module("Unit tests for markdown diff function...");

fluid.registerNamespace("gpii.test.diff.compareMarkdown");
gpii.test.diff.compareMarkdown.runAllTests = function (that) {
    fluid.each(that.options.testDefs.markdown, gpii.test.diff.compareMarkdown.runSingleTest);
};

gpii.test.diff.compareMarkdown.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = gpii.diff.compareMarkdown(testDef.leftValue, testDef.rightValue, { html: true });
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });
};

fluid.defaults("gpii.test.diff.compareMarkdown", {
    gradeNames: ["gpii.test.diff.testDefs.compareMarkdown"],
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.compareMarkdown.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.compareMarkdown();
