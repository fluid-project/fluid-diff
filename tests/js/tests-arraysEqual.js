/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%gpii-diff");

jqUnit.module("Unit tests for string diff function...");

fluid.registerNamespace("gpii.test.diff.arraysEqual");
gpii.test.diff.arraysEqual.runAllTests = function (that) {
    fluid.each(that.options.testDefs, gpii.test.diff.arraysEqual.runSingleTest);
};

gpii.test.diff.arraysEqual.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        if (testDef.expectedError) {
            jqUnit.expectFrameworkDiagnostic(testDef.message, function () {
                gpii.diff.arraysEqual(testDef.arrayOne, testDef.arrayTwo);
            }, fluid.makeArray(testDef.expectedError));
        }
        else {
            var result = gpii.diff.arraysEqual(testDef.arrayOne, testDef.arrayTwo);
            jqUnit.assertEquals("The results should be as expected...", testDef.expected, result);
        }
    });
};

fluid.defaults("gpii.test.diff.arraysEqual", {
    gradeNames: ["fluid.component"],
    testDefs: {
        emptyArrays: {
            message:  "Empty arrays should be equal...",
            arrayOne: [],
            arrayTwo: [],
            expected: true
        },
        unequalEqualLength: {
            message:  "Unequal arrays of the same length should not be equal...",
            arrayOne: [0, 1],
            arrayTwo: [2, 3],
            expected: false
        },
        unequalUnequalLength: {
            message:  "Unequal arrays of different lengths should not be equal...",
            arrayOne: [0, 1],
            arrayTwo: [2],
            expected: false
        },
        equalArrays: {
            message:  "Equal arrays should be equal...",
            arrayOne: [0, false, "a string", undefined, null],
            arrayTwo: [0, false, "a string", undefined, null],
            expected: true
        },
        nestedEqualArrays: {
            message:  "Nested equal arrays should be equal...",
            arrayOne: [[]],
            arrayTwo: [[]],
            expected: true
        },
        nestedUnequalArrays: {
            message:  "Nested unequal arrays should be unequal...",
            arrayOne: [[0]],
            arrayTwo: [[1]],
            expected: false
        },
        nestedEqualObjects: {
            message:  "Nested equal objects should be equal...",
            arrayOne: [{}],
            arrayTwo: [{}],
            expected: true
        },
        nestedUnequalObjects: {
            message:  "Nested unequal objects should be unequal...",
            arrayOne: [{ foo: "bar" }],
            arrayTwo: [{ baz: "quux"}],
            expected: false
        },
        compareArrayToUndefined: {
            message:  "An array should not be equal to undefined...",
            arrayOne: [1, 2, 3],
            arrayTwo: undefined,
            expected: false
        },
        differentTypes: {
            message:  "Different types of values in array should not be equal...",
            arrayOne: [0],
            arrayTwo: [false],
            expected: false
        },

        longerRightHand: {
            message:  "A longer right-hand array should not be equal...",
            arrayOne: [0],
            arrayTwo: [0, 1, 2],
            expected: false
        },
        nonArrays: {
            message: "Non-arrays should result in an error...",
            expectedError: "Cannot compare non-arrays"
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
