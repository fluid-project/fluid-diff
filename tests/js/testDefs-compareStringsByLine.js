/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.defaults("gpii.test.diff.testDefs.compareStringsByLine", {
    gradeNames: ["fluid.component"],
    // We need to preserve `undefined` values in our comparisons.
    mergePolicy: {
        "testDefs.stringsByLine": "nomerge, noexpand"
    },
    testDefs: {
        stringsByLine: {
            nonStrings: {
                message: "We should be able to handle non-strings.",
                leftValue: 1,
                rightValue: true,
                expected: [{value: 1, type: "removed"}, {value: true, type: "added"}]
            },
            equal: {
                message:    "Equal strings should be handled correctly.",
                leftValue:  "This\nis\nfine.",
                rightValue: "This\nis\nfine.",
                expected:   [{ value: "This\nis\nfine.", type: "unchanged"}]
            },
            leadingAddition: {
                message: "We should be able to handle a leading addition.",
                leftValue:  "Existing content.",
                rightValue: "New content.\nExisting content.",
                expected:   [
                    { value: "New content.\n", type: "added"},
                    { value: "Existing content.", type: "unchanged"}
                ]
            },
            intermediateAddition: {
                message:    "We should be able to handle an intermediate addition.",
                leftValue:  "Let's get started.\nWe're done.",
                rightValue: "Let's get started.\nKeep going.\nWe're done.",
                expected:   [
                    { value: "Let's get started.\n", type: "unchanged"},
                    { value: "Keep going.\n", type: "added"},
                    { value: "We're done.", type: "unchanged"}
                ]
            },
            trailingAddition: {
                message: "We should be able to handle a trailing addition.",
                leftValue:  "The first line is the same.",
                rightValue: "The first line is the same.\nThe second line is new.",
                expected:   [
                    { value: "The first line is the same", type: "unchanged"},
                    { value: ".\nThe second line is new", type: "added"},
                    { value: ".", type: "unchanged"}
                ]
            },
            leadingDeletion: {
                message: "We should be able to handle a leading deletion.",
                leftValue:  "Old content.\nNew enough content.",
                rightValue: "New enough content.",
                expected:   [
                    { value: "Old content.\n", type: "removed"},
                    { value: "New enough content.", type: "unchanged"}
                ]
            },
            intermediateDeletion: {
                message:    "We should be able to handle an intermediate deletion.",
                leftValue:  "Let's get started.\nKeep going.\nWe're done.",
                rightValue: "Let's get started.\nWe're done.",
                expected:   [
                    { value: "Let's get started.\n", type: "unchanged"},
                    { value: "Keep going.\n", type: "removed"},
                    { value: "We're done.", type: "unchanged"}
                ]
            },
            trailingDeletion: {
                message:    "We should be able to handle a trailing deletion.",
                leftValue:  "Let's get started.\nWe're done.",
                rightValue: "Let's get started.",
                expected:   [
                    { value: "Let's get started", type: "unchanged"},
                    { value: ".\nWe're done", type: "removed"},
                    { value: ".", type: "unchanged"}
                ]
            },
            leadingChange: {
                message: "We should be able to handle a leading change.",
                leftValue:  "The first line is the same.\nThe second line is the same.",
                rightValue: "The first line matches.\nThe second line is the same.",
                expected:   [
                    { value: "The first line ", type: "unchanged"},
                    { value: "is the same", type: "removed"},
                    { value: "matches", type:"added"},
                    { value: ".\nThe second line is the same.", type: "unchanged"}
                ]
            },
            intermediateChange: {
                message:    "We should be able to handle an intermediate change.",
                leftValue:  "The first line matches.\nThe second line will change.\nThe third line matches.",
                rightValue: "The first line matches.\nThe second line has changed.\nThe third line matches.",
                expected:   [
                    { value: "The first line matches.\nThe second line ", type: "unchanged"},
                    { value: "will", type: "removed"},
                    { value: "has", type:"added"},
                    { value: " ", type: "unchanged"},
                    { value: "change", type: "removed"},
                    { value: "changed", type:"added"},
                    { value: ".\nThe third line matches.", type: "unchanged"}
                ]
            },
            trailingChange: {
                message: "We should be able to handle a trailing change.",
                leftValue:  "The first line is the same.\nThe second line is the same.",
                rightValue: "The first line is the same.\nThe second line matches.",
                expected:   [
                    { value: "The first line is the same.\nThe second line ", type: "unchanged"},
                    { value: "is the same", type: "removed"},
                    { value: "matches", type:"added"},
                    { value: ".", type: "unchanged"}
                ]
            },
            nonLineContentBoth: {
                message:    "We should be able to handle non-line content.",
                leftValue:  "A string",
                rightValue: "Another string",
                expected: [
                    { value: "A", type: "removed"},
                    { value: "Another", type: "added"},
                    { value: " string", type: "unchanged"}
                ]
            },
            middleMatch: {
                message: "We should be able to handle strings that only match in the middle.",
                leftValue: "It starts.\nIt continues.\nIt ends.",
                rightValue: "It continues.",
                expected: [
                    { value: "It starts.\n", type: "removed"},
                    { value: "It continues", type: "unchanged"},
                    { value: ".\nIt ends", type: "removed"},
                    { value: ".", type: "unchanged"}
                ]
            },
            // We intentionally use \r and \n to avoid lots of matches that are basically just the carriage return.
            noMatch: {
                message:    "We should be able to handle content that has no matches at all.",
                leftValue:  "Longing\rRusted\rSeventeen\rDawn\rStove",
                rightValue: "Nine\nKind-hearted\nHomecoming\nOne\nFreight car",
                expected: [
                    { value: "Longing\rRusted\rSeventeen\rDawn\rStove", type: "removed"},
                    { value: "Nine\nKind-hearted\nHomecoming\nOne\nFreight car", type: "added"}
                ]
            }
        }
    }
});
