/* eslint-env node */
"use strict";
// TODO: Remove this once it's committed for posterity
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%gpii-diff");

jqUnit.module("Unit tests for 'longest match' function...");

fluid.registerNamespace("gpii.test.diff.longestCommonStringSegment");
gpii.test.diff.longestCommonStringSegment.runAllTests = function (that) {
    fluid.each(that.options.testDefs, gpii.test.diff.longestCommonStringSegment.runSingleTest);
};

gpii.test.diff.longestCommonStringSegment.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = gpii.diff.longestCommonStringSegment(testDef.stringOne, testDef.stringTwo);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });
};

fluid.defaults("gpii.test.diff.longestCommonStringSegment", {
    gradeNames: ["fluid.component"],
    testDefs: {
        wholeLeft: {
            message:   "We should be able to deal with cases in which the entire 'left' string is itself the longest match...",
            stringOne: "old",
            stringTwo: "new plus old",
            expected:  { segment: "old", leftIndex: 0, rightIndex: 9 }
        },
        wholeRight: {
            message:   "We should be able to deal with cases in which the entire 'right' string is itself the longest match...",
            stringOne: "new plus old",
            stringTwo: "old",
            expected:  { segment: "old", leftIndex: 9, rightIndex: 0 }
        },
        commonMiddle: {
            message:   "We should be able to find common ground in the middle of two strings...",
            stringOne: "this is only the beginning",
            stringTwo: "the beginning is not quite the end",
            expected:  { segment: "the beginning", leftIndex: 13, rightIndex: 0 }
        },
        firstAmongEquals: {
            message:   "If there are two matches of equal length, the first should be returned...",
            stringOne: "foo bar",
            stringTwo: "bar foo",
            expected:  { segment: "foo", leftIndex: 0, rightIndex: 4 }
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.longestCommonStringSegment.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.longestCommonStringSegment();
