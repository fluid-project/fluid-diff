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

fluid.registerNamespace("gpii.test.diff.equals");
gpii.test.diff.equals.runAllTests = function (that) {
    fluid.each(that.options.testDefs, function (testDefs, key) {
        jqUnit.module("Unit tests for gpii.diff.equals function (" + key + ")...");
        fluid.each(testDefs, gpii.test.diff.equals.runSingleTest);
    });
};

gpii.test.diff.equals.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                gpii.diff.equals(testDef.leftValue, testDef.rightValue);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = gpii.diff.equals(testDef.leftValue, testDef.rightValue);
            jqUnit.assertEquals("The results should be as expected...", testDef.expected, result);
        }
    });
};

fluid.defaults("gpii.test.diff.equals", {
    gradeNames: ["gpii.test.diff.testDefs.arraysEqual", "gpii.test.diff.testDefs.objectsEqual"],
    testDefs: {
        mixedTypes: {
            undefinedAndObject: {
                message:    "We should be able to distinguish undefined from an Object.",
                leftValue:  undefined,
                rightValue: {foo: "bar"},
                expected:   false
            },
            arrayAndObject: {
                message:    "We should be able to distinguish an Array from an Object.",
                leftValue:  [],
                rightValue: {},
                expected:   false
            },
            objectAndUndefined: {
                message:    "We should be able to distinguish an Object from undefined.",
                leftValue:  {foo: "bar"},
                rightValue: undefined,
                expected:   false
            },
            objectAndArray: {
                message:    "We should be able to distinguish an Object from an Array.",
                leftValue:  {},
                rightValue: [],
                expected:   false
            }
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.equals.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.equals();