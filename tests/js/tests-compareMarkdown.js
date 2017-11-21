/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%gpii-diff");
    gpii.diff.loadMarkdownSupport();

    require("./testDefs-compareMarkdown");
    require("./lib/diagramTracebackTable");
};

jqUnit.module("Unit tests for markdown diff function...");

fluid.registerNamespace("gpii.test.diff.compareMarkdown");
gpii.test.diff.compareMarkdown.runAllTests = function (that) {
    fluid.each(that.options.testDefs.markdown, gpii.test.diff.compareMarkdown.runSingleTest);
};

gpii.test.diff.compareMarkdown.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = gpii.diff.compareMarkdown(testDef.leftValue, testDef.rightValue, { html: true, breaks: true });
        if (testDef.expected) {
            jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
        }
        else {
            jqUnit.assert("The comparison should complete as expected...");
        }
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
