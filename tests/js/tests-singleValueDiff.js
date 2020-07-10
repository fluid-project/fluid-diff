/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%fluid-diff");

jqUnit.module("Unit tests for 'single value' diff function...");

fluid.registerNamespace("fluid.test.diff.singleValueDiff");
fluid.test.diff.singleValueDiff.runAllTests = function (that) {
    fluid.each(that.options.testDefs, fluid.test.diff.singleValueDiff.runSingleTest);
};

fluid.test.diff.singleValueDiff.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = fluid.diff.singleValueDiff(testDef.leftValue, testDef.rightValue);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });

};

fluid.defaults("fluid.test.diff.singleValueDiff", {
    gradeNames: ["fluid.component"],
    // We have to do this so that we can specify "undefined" in our expected output, otherwise it is removed by the framework.
    mergePolicy: {
        testDefs: "noexpand, nomerge"
    },
    testDefs: {
        compareEqualNumbers: {
            message:    "Comparing different numbers should work as expected...",
            leftValue:  1,
            rightValue: 1,
            expected:   [{ value: 1, type: "unchanged"}]
        },
        compareDifferentNumbers: {
            message:    "Comparing different numbers should work as expected...",
            leftValue:  1,
            rightValue: 2,
            expected:   [{ value: 1, type: "removed"}, { value: 2, type: "added"}]
        },
        compareNumberToUndefined: {
            message:    "Comparing a number to `undefined` should work as expected...",
            leftValue:  1,
            expected:   [{ value: 1, type: "removed"}]
        },
        compareNumberToBoolean: {
            message:    "Comparing a number to a boolean should work as expected...",
            leftValue:  0,
            rightValue: false,
            expected:   [{ value: 0, type: "removed"}, { value: false, type: "added"}]
        },
        compareNumberToString: {
            message:    "Comparing a number to a string should work as expected...",
            leftValue:  0,
            rightValue: "zero",
            expected:   [{ value: 0, type: "removed"}, { value: "zero", type: "added"}]
        },
        compareEqualBooleans: {
            message:    "Comparing equal boolean values should work as expected...",
            leftValue:  true,
            rightValue: true,
            expected:  [{ value: true, type: "unchanged"}]
        },
        compareDifferentBooleans: {
            message:    "Comparing different boolean values should work as expected...",
            leftValue:  true,
            rightValue: false,
            expected:   [{ value: true, type: "removed"}, { value: false, type: "added"}]
        },
        compareBooleanToUndefined: {
            message:    "Comparing a boolean to `undefined` should work as expected...",
            leftValue:  false,
            expected:   [{ value: false, type: "removed"}]
        },
        compareBooleanToNumber: {
            message:    "Comparing a boolean value to a number should work as expected...",
            leftValue:  true,
            rightValue: 1,
            expected:   [{ value: true, type: "removed"}, { value: 1, type: "added"}]
        },
        compareBooleanToString: {
            message:    "Comparing a boolean value to a string should work as expected...",
            leftValue:  true,
            rightValue: "a string",
            expected:   [{ value: true, type: "removed"}, { value: "a string", type: "added"}]
        },
        compareUndefinedToBoolean: {
            message:    "Comparing `undefined` to a number should work as expected...",
            rightValue:  false,
            expected:   [{ value: false, type: "added"}]
        },
        compareUndefinedToNumber: {
            message:    "Comparing `undefined` to a number should work as expected...",
            rightValue:  1,
            expected:   [{ value: 1, type: "added"}]
        },
        compareUndefinedToString: {
            message:    "Comparing `undefined` to a string should work as expected...",
            rightValue: "defined",
            expected:   [{ value: "defined", type: "added"}]
        },
        compareUndefinedToUndefined: {
            message:    "Comparing `undefined` to `undefined` should work as expected...",
            expected:   [{ value: undefined, type: "unchanged"}]
        },
        compareArrayToArray: {
            message:    "Comparing an array to another array should work as expected...",
            leftValue:  [0],
            rightValue: [1],
            expected:   [{ value: [0], type: "removed"}, { value: [1], type: "added"}]
        },
        compareArrayToNonArray: {
            message:    "Comparing an array to a non-array should work as expected...",
            leftValue:  [2],
            rightValue: "a string",
            expected:   [{ value: [2], type: "removed"}, { value: "a string", type: "added"}]
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "fluid.test.diff.singleValueDiff.runAllTests",
            args:     ["{that}"]
        }
    }
});

fluid.test.diff.singleValueDiff();
