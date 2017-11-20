/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%gpii-diff");
    require("./testDefs-arraysEqual");
    require("./testDefs-objectsEqual");
}

fluid.registerNamespace("gpii.test.diff.extractSegments");
gpii.test.diff.extractSegments.runAllTests = function (that) {
    jqUnit.module("Unit tests for gpii.diff.extractSegments function...");
    fluid.each(that.options.testDefs, gpii.test.diff.extractSegments.runSingleTest);
};

gpii.test.diff.extractSegments.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                gpii.diff.extractSegments(testDef.leftValue, testDef.rightValue);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = gpii.diff.extractSegments(testDef.input);
            jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
        }
    });
};

fluid.defaults("gpii.test.diff.extractSegments", {
    gradeNames: ["fluid.component"],
    testDefs: {
        whitespace: {
            message:  "We should be able to break down a simple phrase with a single space.",
            input:    "this works",
            expected: ["this", " ", "works"]
        },
        contraction: {
            message: "We should be able to deal with a contraction.",
            input:   "This isn't broken up",
            expected: ["This", " ", "isn't", " ", "broken", " ", "up"]
        },
        singularPossessive: {
            message:  "We should be able to handle a singular possessive.",
            input:    "Bob's your uncle",
            expected: ["Bob's", " ", "your", " ", "uncle"]
        },
        pluralPossessive: {
            message:  "We should be able to handle a plural possessive.",
            input:    "The teachers' union",
            expected: ["The", " ", "teachers'", " ", "union"]
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.extractSegments.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.extractSegments();
