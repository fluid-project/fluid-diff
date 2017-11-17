/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%gpii-diff");
    gpii.diff.loadMarkdownSupport();

    require("./testDefs-compareArrays");
    require("./testDefs-compareMarkdown");
    require("./testDefs-compareObjects");
    require("./testDefs-compareStrings");
    require("./testDefs-compareStringsByLine");
}

fluid.registerNamespace("gpii.test.diff.compare");
gpii.test.diff.compare.runAllTests = function (that) {
    fluid.each(that.options.testDefs, function (testDefs, key) {
        jqUnit.module("Unit tests for gpii.diff.compare function (" + key + ")...");
        fluid.each(testDefs, gpii.test.diff.compare.runSingleTest);
    });
};

gpii.test.diff.compare.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                gpii.diff.compare(testDef.leftValue, testDef.rightValue, testDef.compareStringsAsMarkdown, testDef.markdownitOptions);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = gpii.diff.compare(testDef.leftValue, testDef.rightValue, testDef.compareStringsAsMarkdown, testDef.markdownitOptions);
            jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
        }
    });
};

fluid.defaults("gpii.test.diff.compare", {
    gradeNames: ["gpii.test.diff.testDefs.compareArrays", "gpii.test.diff.testDefs.compareMarkdown", "gpii.test.diff.testDefs.compareObjects", "gpii.test.diff.testDefs.compareStrings", "gpii.test.diff.testDefs.compareStringsByLine"],
    testDefs: {
        markdown: {
            markdownAsString: {
                message:    "Markdown should be treated like a string by default...",
                leftValue:  "**bold**",
                rightValue: "*italic*",
                expected:   [{ value: "**bold**", type: "removed"}, { value: "*italic*", type: "added"}]
            },
            markdownAsMarkdown: {
                message:   "We should be able to compare markdown as markdown using an additional argument...",
                leftValue: "**bold**",
                rightValue: "*italic*",
                compareStringsAsMarkdown: true,
                expected:  [{ value: "bold", type: "removed" }, { value: "italic", type: "added" }]
            }
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.compare.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.compare();
