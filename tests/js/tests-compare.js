/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%fluid-diff");
    fluid.diff.loadMarkdownSupport();

    require("./testDefs-compareArrays");
    require("./testDefs-compareMarkdown");
    require("./testDefs-compareObjects");
    require("./testDefs-compareStrings");
}

fluid.registerNamespace("fluid.test.diff.compare");
fluid.test.diff.compare.runAllTests = function (that) {
    fluid.each(that.options.testDefs, function (testDefs, key) {
        jqUnit.module("Unit tests for fluid.diff.compare function (" + key + ").");
        fluid.each(testDefs, fluid.test.diff.compare.runSingleTest);
    });
};

fluid.test.diff.compare.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                fluid.diff.compare(testDef.leftValue, testDef.rightValue, testDef.options);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = fluid.diff.compare(testDef.leftValue, testDef.rightValue, testDef.options);
            if (testDef.expected) {
                jqUnit.assertDeepEq("The results should be as expected.", testDef.expected, result);
            }
            else {
                jqUnit.assert("The comparison should complete as expected.");
            }
        }
    });
};

fluid.defaults("fluid.test.diff.compare", {
    gradeNames: ["fluid.test.diff.testDefs.compareArrays", "fluid.test.diff.testDefs.compareMarkdown", "fluid.test.diff.testDefs.compareObjects", "fluid.test.diff.testDefs.compareStrings", "fluid.test.diff.testDefs.compareStringsByLine"],
    testDefs: {
        markdown: {
            markdownAsString: {
                message:    "Markdown should be treated like a string by default.",
                leftValue:  "**bold**",
                rightValue: "*italic*",
                expected:   [{ value: "**bold**", type: "removed"}, { value: "*italic*", type: "added"}]
            },
            markdownAsMarkdown: {
                message:   "We should be able to compare markdown as markdown using an additional argument.",
                leftValue: "**bold**",
                rightValue: "*italic*",
                options: {
                    compareStringsAsMarkdown: true
                },
                expected:  [{ value: "bold", type: "removed" }, { value: "italic", type: "added" }]
            }
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.compare.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.compare();
