/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.defaults("gpii.test.diff.testDefs.compareArrays", {
    gradeNames: ["fluid.component"],
    // We need to avoid stripping "undefined" values in our expected output.
    mergePolicy: {
        "testDefs.arrays": "noexpand, nomerge"
    },
    testDefs: {
        arrays: {
            equalSimpleValues: {
                message:    "Arrays containing equal simple values should be treated as 'unchanged'...",
                leftValue:  [0, "a string", false],
                rightValue: [0, "a string", false],
                expected:   [{arrayValue: [0, "a string", false], type: "unchanged"}]
            },
            equalWithNestedArrays: {
                message:    "Arrays containing equal nested arrays should be treated as 'unchanged'...",
                leftValue:  [[0]],
                rightValue: [[0]],
                expected:   [{arrayValue: [[0]], type: "unchanged"}]
            },
            equalWithNestedObjects: {
                message:    "Arrays containing equal nested objects should be be treated as 'unchanged'...",
                leftValue:  [{foo: "bar"}],
                rightValue: [{foo: "bar"}],
                expected:   [{arrayValue: [{foo: "bar"}], type: "unchanged"}]
            },
            disjoint: {
                message:    "Arrays with no overlapping elements should be handled correctly...",
                leftValue:  [0, 1],
                rightValue: [2, 3],
                expected:   [{arrayValue: [0, 1], type: "removed"}, {arrayValue: [2, 3], type: "added"}]
            },
            leadingDeletion: {
                message:    "Deleting a leading element should be handled correctly...",
                leftValue:  [0, 1, 2],
                rightValue: [1, 2],
                expected:   [{arrayValue: [0], type: "removed"}, {arrayValue: [1, 2], type: "unchanged"}]
            },
            trailingDeletion: {
                message:    "Deleting a trailing element should be handled correctly...",
                leftValue:  [0, 1, 2],
                rightValue: [0, 1],
                expected:   [{arrayValue: [0, 1], type: "unchanged"}, {arrayValue: [2], type: "removed"}]
            },
            intermediateDeletion: {
                message:    "Deleting an intermediate element should be handled correctly...",
                leftValue:  [0, 1, 2],
                rightValue: [0, 2],
                expected:   [{arrayValue: [0], type: "unchanged"}, {arrayValue: [1], type: "removed"}, { arrayValue: [2], type: "unchanged"}]
            },
            leadingAddition: {
                message:    "Adding a leading element should be handled correctly...",
                leftValue:  [1, 2],
                rightValue: [0, 1, 2],
                expected:   [{arrayValue: [0], type: "added"}, {arrayValue: [1, 2], type: "unchanged"}]
            },
            trailingAddition: {
                message:    "Adding a trailing element should be handled correctly...",
                leftValue:  [0, 1],
                rightValue: [0, 1, 2],
                expected:   [{arrayValue: [0, 1], type: "unchanged"}, {arrayValue: [2], type: "added"}]
            },
            intermediateAddition: {
                message:    "Adding an intermediate element should be handled correctly...",
                leftValue:  [0, 2],
                rightValue: [0, 1, 2],
                expected:   [{arrayValue: [0], type: "unchanged"}, {arrayValue: [1], type: "added"}, { arrayValue: [2], type: "unchanged"}]
            },
            deleteAll: {
                message:    "Removing all elements should be handled correctly...",
                leftValue:  [0, 1],
                rightValue: [],
                expected:   [{arrayValue: [0, 1], type: "removed"}]
            },
            addAll: {
                message:    "Adding all elements should be handled correctly...",
                leftValue:  [],
                rightValue: [0, 1],
                expected:   [{arrayValue: [0, 1], type: "added"}]
            },
            deleteUndefined: {
                message:    "Removing undefined elements should be handled correctly...",
                leftValue:  [undefined],
                rightValue: [],
                expected:   [{arrayValue: [undefined], type: "removed"}]
            },
            addUndefined: {
                message: "Adding undefined elements should be handled correctly...",
                leftValue:  [],
                rightValue: [undefined],
                expected:   [{arrayValue: [undefined], type: "added"}]
            },
            nonArrays: {
                message:   "Comparing non-arrays should be handled correctly...",
                leftValue:  0,
                rightValue: 1,
                expected:   [{ value: 0, type: "removed"}, { value: 1, type: "added"}]
            }
        }
    }
});
