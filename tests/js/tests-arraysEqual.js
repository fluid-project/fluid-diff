/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%gpii-diff");
    require("./testDefs-arraysEqual");
}

jqUnit.module("Unit tests for string diff function...");

fluid.registerNamespace("gpii.test.diff.arraysEqual");
gpii.test.diff.arraysEqual.runAllTests = function (that) {
    fluid.each([that.options.testDefs.arrays, that.options.testDefs.nonArrays], function (testDefs) {
        fluid.each(testDefs, gpii.test.diff.arraysEqual.runSingleTest);
    });
};

gpii.test.diff.arraysEqual.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                gpii.diff.arraysEqual(testDef.leftValue, testDef.rightValue);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = gpii.diff.arraysEqual(testDef.leftValue, testDef.rightValue);
            jqUnit.assertEquals("The results should be as expected...", testDef.expected, result);
        }
    });
};

fluid.defaults("gpii.test.diff.arraysEqual", {
    gradeNames: ["gpii.test.diff.testDefs.arraysEqual"],
    testDefs: {
        nonArrays: {
            nonArrayValues: {
                message:       "Non-arrays should result in an error...",
                leftValue:      true,
                rightValue:      false,
                expectedError: "Cannot compare non-arrays"
            }
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.arraysEqual.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.arraysEqual();
