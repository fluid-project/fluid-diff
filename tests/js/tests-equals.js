/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%fluid-diff");
    require("./testDefs-arraysEqual");
    require("./testDefs-objectsEqual");
}

fluid.registerNamespace("fluid.test.diff.equals");
fluid.test.diff.equals.runAllTests = function (that) {
    fluid.each(that.options.testDefs, function (testDefs, key) {
        jqUnit.module("Unit tests for fluid.diff.equals function (" + key + ")...");
        fluid.each(testDefs, fluid.test.diff.equals.runSingleTest);
    });
};

fluid.test.diff.equals.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                fluid.diff.equals(testDef.leftValue, testDef.rightValue);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = fluid.diff.equals(testDef.leftValue, testDef.rightValue);
            jqUnit.assertEquals("The results should be as expected...", testDef.expected, result);
        }
    });
};

fluid.defaults("fluid.test.diff.equals", {
    gradeNames: ["fluid.test.diff.testDefs.arraysEqual", "fluid.test.diff.testDefs.objectsEqual"],
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
            funcName: "fluid.test.diff.equals.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.equals();
