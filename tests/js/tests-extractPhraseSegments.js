/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%gpii-diff");

jqUnit.module("Unit tests for string diff function...");

fluid.registerNamespace("gpii.test.diff.extractPhraseSegments");
gpii.test.diff.extractPhraseSegments.runAllTests = function (that) {
    fluid.each(that.options.testDefs, gpii.test.diff.extractPhraseSegments.runSingleTest);
};

gpii.test.diff.extractPhraseSegments.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = gpii.diff.extractPhraseSegments(testDef.originalString);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });
};

fluid.defaults("gpii.test.diff.extractPhraseSegments", {
    gradeNames: ["fluid.component"],
    mergePolicy: {
        "testDefs": "nomerge, noexpand"
    },
    testDefs: {
        oneWord: {
            message:        "A single word should only have one segment...",
            originalString: "foo",
            expected:       [{ value: "foo", index: 0}]
        },
        sentence: {
            message:        "A two word sentence should have the right segments in the right order...",
            originalString: "This works.",
            expected:       [
                {value: "This works.", index: 0},
                {value: "This works", index: 0},
                {value: " works.", index: 4},
                {value: " works", index: 4},
                {value: "works.", index: 5},
                {value: "This ", index: 0},
                {value: "works", index: 5},
                {value: "This", index: 0}
            ]
        },
        multiLine: {
            message:        "We should be able to handle multi-line strings...",
            originalString: "This\nworks.",
            expected:       [
                {value: "This\nworks.", index: 0},
                {value: "This\nworks", index: 0},
                {value: "\nworks.", index: 4},
                {value: "\nworks", index: 4},
                {value: "works.", index: 5},
                {value: "This\n", index: 0},
                {value: "works", index: 5},
                {value: "This", index: 0}
            ]
        },
        leadingWhitespace: {
            message:        "Leading whitespace should be handled appropriately...",
            originalString: "...that's okay.",
            expected:       [
                { value: "...that's okay.", index: 0},
                { value: "...that's okay", index: 0},
                { value: "that's okay.", index: 3},
                { value: "that's okay", index: 3},
                { value: "...that's ", index: 0},
                { value: "...that's", index: 0},
                { value: "that's ", index: 3},
                { value: "that's", index: 3},
                { value: " okay.", index: 9},
                { value: " okay", index: 9},
                { value: "okay.", index: 10},
                { value: "okay", index: 10}
            ]
        },
        trailingWhitespace: {
            message:        "Trailing whitespace should be handled appropriately...",
            originalString: "Good.",
            expected:       [
                { value: "Good.", index: 0},
                { value: "Good", index: 0}
            ]
        },
        trailingNonWhitespace: {
            message:        "A two word sentence should have the right segments in the right order...",
            originalString: "foo,bar,baz",
            expected:       [
                {value: "foo,bar,baz", index: 0},
                {value: "foo,bar,", index: 0},
                {value: ",bar,baz", index: 3},
                {value: "foo,bar", index: 0},
                {value: "bar,baz", index: 4},
                {value: ",bar,", index: 3},
                {value: "foo,", index: 0},
                {value: ",bar", index: 3},
                {value: "bar,", index: 4},
                {value: ",baz", index: 7},
                {value: "foo", index: 0},
                {value: "bar", index: 4},
                {value: "baz", index: 8}
            ]
        },
        emptyString: {
            message:        "An empty string should not have any phrase segments...",
            originalString: "",
            expected:       []
        },
        undefined: {
            message:        "An undefined value should not have any phrase segments...",
            originalString: undefined,
            expected:       []
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.extractPhraseSegments.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.extractPhraseSegments();
