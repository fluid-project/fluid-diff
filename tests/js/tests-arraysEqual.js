/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%fluid-diff");
    require("./testDefs-arraysEqual");
}

jqUnit.module("Unit tests for string diff function.");

fluid.registerNamespace("fluid.test.diff.arraysEqual");
fluid.test.diff.arraysEqual.runAllTests = function (that) {
    fluid.each([that.options.testDefs.arrays, that.options.testDefs.nonArrays], function (testDefs) {
        fluid.each(testDefs, fluid.test.diff.arraysEqual.runSingleTest);
    });
};

fluid.test.diff.arraysEqual.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                fluid.diff.arraysEqual(testDef.leftValue, testDef.rightValue);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = fluid.diff.arraysEqual(testDef.leftValue, testDef.rightValue);
            jqUnit.assertEquals("The results should be as expected.", testDef.expected, result);
        }
    });
};

fluid.defaults("fluid.test.diff.arraysEqual", {
    gradeNames: ["fluid.test.diff.testDefs.arraysEqual"],
    testDefs: {
        nonArrays: {
            nonArrayValues: {
                message:       "Non-arrays should result in an error.",
                leftValue:      true,
                rightValue:      false,
                expectedError: "Cannot compare non-arrays"
            }
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.arraysEqual.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.arraysEqual();
