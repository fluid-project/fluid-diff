/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%fluid-diff");
    fluid.diff.loadMarkdownSupport();

    require("./testDefs-compareMarkdown");
    require("./lib/diagramTracebackTable");
};

jqUnit.module("Unit tests for markdown diff function...");

fluid.registerNamespace("fluid.test.diff.compareMarkdown");
fluid.test.diff.compareMarkdown.runAllTests = function (that) {
    fluid.each(that.options.testDefs.markdown, fluid.test.diff.compareMarkdown.runSingleTest);
};

fluid.test.diff.compareMarkdown.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = fluid.diff.compareMarkdown(testDef.leftValue, testDef.rightValue, testDef.options);
        if (testDef.expected) {
            jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
        }
        else {
            jqUnit.assert("The comparison should complete as expected...");
        }
    });
};

fluid.defaults("fluid.test.diff.compareMarkdown", {
    gradeNames: ["fluid.test.diff.testDefs.compareMarkdown"],
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.compareMarkdown.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.compareMarkdown();
