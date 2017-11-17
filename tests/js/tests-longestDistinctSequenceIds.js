/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%gpii-diff");

jqUnit.module("Unit tests for 'longest common sequence' function...");

fluid.registerNamespace("gpii.test.diff.longestDistinctSequenceIds");
gpii.test.diff.longestDistinctSequenceIds.runAllTests = function (that) {
    fluid.each(that.options.testDefs, gpii.test.diff.longestDistinctSequenceIds.runSingleTest);
};

gpii.test.diff.longestDistinctSequenceIds.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = gpii.diff.longestDistinctSequenceIds(testDef.sequenceIds, testDef.sequences);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });
};

gpii.test.diff.generateMassiveMatch = function (index) {
    return { leftIndex: index, rightIndex: index };
};

fluid.defaults("gpii.test.diff.longestDistinctSequenceIds", {
    gradeNames: ["fluid.component"],
    // We want to compare to undefined values, so we need to avoid trying to expand or merge them.
    mergePolicy: {
        testDefs: "nomerge, noexpand"
    },
    testDefs: {
        clearWinner: {
            message:     "We should be able to cull a longer list down to a single clear winner...",
            sequenceIds: [1, 0],
            sequences:   [[{ leftIndex: 1, rightIndex: 1 }, { leftIndex: 2, rightIndex: 2}],[{ leftIndex: 1, rightIndex: 1 }]],
            expected:    [0]
        },
        tie: {
            message:     "We should be able to handle a tie...",
            sequenceIds: [0, 1],
            sequences:   [[{ leftIndex: 1, rightIndex: 1 }, { leftIndex: 2, rightIndex: 2}],[{ leftIndex: 2, rightIndex: 2 }, { leftIndex: 3, rightIndex: 3 }]],
            expected:    [0, 1]
        },
        sequenceIdsEmpty: {
            message:     "We should be able to handle the case in which there are no sequence IDs...",
            sequenceIds: [],
            sequences:   [[{ leftIndex: 1, rightIndex: 1 }, { leftIndex: 2, rightIndex: 2}]],
            expected:    []
        },
        bothEmpty: {
            message:     "We should be able to handle the case in which there are no sequences or IDs...",
            sequenceIds: [],
            sequences:   [],
            expected:    []
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.longestDistinctSequenceIds.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.longestDistinctSequenceIds();
