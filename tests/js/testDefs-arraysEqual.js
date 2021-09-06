/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.defaults("fluid.test.diff.testDefs.arraysEqual", {
    gradeNames: ["fluid.component"],
    testDefs: {
        arrays: {
            emptyArrays: {
                message:  "Empty arrays should be equal.",
                leftValue: [],
                rightValue: [],
                expected: true
            },
            unequalEqualLength: {
                message:  "Unequal arrays of the same length should not be equal.",
                leftValue: [0, 1],
                rightValue: [2, 3],
                expected: false
            },
            unequalUnequalLength: {
                message:  "Unequal arrays of different lengths should not be equal.",
                leftValue: [0, 1],
                rightValue: [2],
                expected: false
            },
            equalArrays: {
                message:  "Equal arrays should be equal.",
                leftValue: [0, false, "a string", undefined, null],
                rightValue: [0, false, "a string", undefined, null],
                expected: true
            },
            nestedEqualArrays: {
                message:  "Nested equal arrays should be equal.",
                leftValue: [[]],
                rightValue: [[]],
                expected: true
            },
            nestedUnequalArrays: {
                message:  "Nested unequal arrays should be unequal.",
                leftValue: [[0]],
                rightValue: [[1]],
                expected: false
            },
            nestedEqualObjects: {
                message:  "Nested equal objects should be equal.",
                leftValue: [{}],
                rightValue: [{}],
                expected: true
            },
            nestedUnequalObjects: {
                message:  "Nested unequal objects should be unequal.",
                leftValue: [{ foo: "bar" }],
                rightValue: [{ baz: "quux"}],
                expected: false
            },
            compareArrayToUndefined: {
                message:  "An array should not be equal to undefined.",
                leftValue: [1, 2, 3],
                rightValue: undefined,
                expected: false
            },
            differentTypes: {
                message:  "Different types of values in array should not be equal.",
                leftValue: [0],
                rightValue: [false],
                expected: false
            },
            longerRightHand: {
                message:  "A longer right-hand array should not be equal.",
                leftValue: [0],
                rightValue: [0, 1, 2],
                expected: false
            }
        }
    }
});
