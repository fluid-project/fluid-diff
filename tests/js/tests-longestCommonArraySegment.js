/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%gpii-diff");

jqUnit.module("Unit tests for 'longest matching array segment' function...");

fluid.registerNamespace("gpii.test.diff.longestCommonArraySegment");
gpii.test.diff.longestCommonArraySegment.runAllTests = function (that) {
    fluid.each(that.options.testDefs, gpii.test.diff.longestCommonArraySegment.runSingleTest);
};

gpii.test.diff.longestCommonArraySegment.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = gpii.diff.longestCommonArraySegment(testDef.arrayOne, testDef.arrayTwo);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });
};

fluid.defaults("gpii.test.diff.longestCommonArraySegment", {
    gradeNames: ["fluid.component"],
    // We want to compare to undefined values, so we need to avoid trying to expand or merge them.
    mergePolicy: {
        testDefs: "nomerge, noexpand"
    },
    testDefs: {
        leadingMatch: {
            message: "A leading match should be detected correctly...",
            arrayOne: [1, 2, 3],
            arrayTwo: [1, 2, 3, 4],
            expected: { segment: [1, 2, 3], leftIndex: 0, rightIndex: 0 }
        },
        singleLeftElementMatch: {
            message: "A single-entry array on the left side of the comparison should match a longer array correctly...",
            arrayOne: [2],
            arrayTwo: [1, 2],
            expected: { segment: [2], leftIndex: 0, rightIndex: 1 }
        },
        singleRightElementMatch: {
            message: "A single-entry array on the right side of the comparison should match a longer array correctly...",
            arrayOne: [1, 2],
            arrayTwo: [2],
            expected: { segment: [2], leftIndex: 1, rightIndex: 0 }
        },
        trailingMatch: {
            message: "A trailing match should be detected correctly...",
            arrayOne: [0, 1, 2, 3],
            arrayTwo: [1, 2, 3],
            expected: { segment: [1, 2, 3], leftIndex: 1, rightIndex :0 }
        },
        staggeredMatch: {
            message: "A staggered match should be detected correctly...",
            arrayOne: [0, 1, 2, 3],
            arrayTwo: [1, 2, 3, 4],
            expected: { segment: [1, 2, 3], leftIndex: 1, rightIndex: 0 }
        },
        intermediateMatch: {
            message: "An intermediate match should be detected correctly...",
            arrayOne: [0, 1, 2, 3, 4],
            arrayTwo: [1, 2, 3],
            expected: { segment: [1, 2, 3], leftIndex: 1, rightIndex: 0 }
        },
        firstLongestMatch: {
            message: "The first longest match should be returned...",
            arrayOne: [1, 1, 0, 0],
            arrayTwo: [0, 0, 1, 1],
            expected: { segment: [1, 1], leftIndex: 0, rightIndex: 2 }
        },
        fullMatch: {
            message: "Two arrays that are equal should return all segments...",
            arrayOne: ["peas", "porridge", "hot"],
            arrayTwo: ["peas", "porridge", "hot"],
            expected: { segment: ["peas", "porridge", "hot"], leftIndex: 0, rightIndex: 0 }
        },
        undefinedRight: {
            message:  "We should be able to handle `undefined` as the right side of the comparison...",
            arrayOne: [],
            arrayTwo: undefined,
            expected: { segment: [], leftIndex: -1, rightIndex: -1 }
        },
        undefinedLeft: {
            message:  "We should be able to handle `undefined` as the left side of the comparison...",
            arrayOne: [],
            arrayTwo: undefined,
            expected: { segment: [], leftIndex: -1, rightIndex: -1 }
        },
        undefinedMatches: {
            message: "We should be able to work with `undefined` array values...",
            arrayOne: [1, undefined, 0],
            arrayTwo: [2, undefined, 0],
            expected: { segment: [undefined, 0], leftIndex: 1, rightIndex: 1 }
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.longestCommonArraySegment.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.longestCommonArraySegment();
