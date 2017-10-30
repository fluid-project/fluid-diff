/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.defaults("gpii.test.diff.testDefs.compareStrings", {
    gradeNames: ["fluid.component"],
    // We need to preserve `undefined` values in our comparisons.
    mergePolicy: {
        "testDefs.strings": "nomerge, noexpand"
    },
    testDefs: {
        strings: {
            addLeadingMaterial: {
                message:   "We should be able to deal with cases in which material is added to the front of the string...",
                leftValue: "old",
                rightValue: "new plus old",
                expected:  [{ value: "new plus ", type: "added"}, { value: "old", type: "unchanged"}]
            },
            addTrailingMaterial: {
                message:   "We should be able to deal with cases in which material is removed from the front of the string...",
                leftValue: "old",
                rightValue: "old plus new",
                expected:  [{ value: "old", type: "unchanged"}, { value: " plus new", type: "added"}]
            },
            addIntermediateMaterial: {
                message:   "We should be able to deal with cases in which material is added to the middle of a string...",
                leftValue: "old string",
                rightValue: "old and new string",
                expected:  [{ value: "old", type: "unchanged"}, { value: " and new", type: "added"}, { value: " string", type: "unchanged"}]
            },
            deleteLeadingMaterial: {
                message:   "We should be able to deal with cases in which material is deleted from the beginning of a string...",
                leftValue: "not at all short string",
                rightValue: "short string",
                expected:  [{ value: "not at all ", type: "removed"}, { value: "short string", type: "unchanged"}]
            },
            deleteTrailingMaterial: {
                message:   "We should be able to deal with cases in which material is deleted from the end of a string...",
                leftValue: "really simple, except when it's not",
                rightValue: "really simple",
                expected:  [{ value: "really simple", type: "unchanged"}, { value: ", except when it's not", type: "removed"}]
            },
            deleteIntermediateMaterial: {
                message:   "We should be able to deal with cases in which material is deleted from the middle of a string...",
                leftValue: "Bacon, avocado, lettuce, and tomato",
                rightValue: "Bacon, lettuce, and tomato",
                expected:  [{ value: "Bacon", type: "unchanged"}, { value: ", avocado", type: "removed"}, { value: ", lettuce, and tomato", type: "unchanged"}]
            },
            completelyDifferent: {
                message:   "We should be able to deal with two strings that do not match at all...",
                leftValue: "foo",
                rightValue: "bar",
                expected:  [{ value: "foo", type: "removed"}, { value: "bar", type: "added"}]
            },
            duplicateInfoAdded: {
                message:   "We should be able to deal with cases in which duplicate information is added to a string...",
                leftValue: "foo",
                rightValue: "foo foo",
                expected:  [{ value: "foo", type: "unchanged"}, { value: " foo", type: "added"}]
            },
            alternateEnding: {
                message:   "We should be able to deal with cases in which only the endings are different...",
                leftValue: "We are now open",
                rightValue: "We are now closed",
                expected:  [{ value: "We are now ", type: "unchanged"}, { value: "open", type: "removed"}, { value: "closed", type: "added"}]
            },
            duplicateInfoRemoved: {
                message:   "We should be able to deal with cases in which duplicate information is removed from a string...",
                leftValue: "foo foo",
                rightValue: "foo",
                expected:  [{ value: "foo", type: "unchanged"}, { value: " foo", type: "removed"}]
            },
            leftHandUndefined: {
                message:   "We should be able to handle `undefined` on the left hand side of a comparison...",
                leftValue: undefined,
                rightValue: "defined",
                expected:  [{ value: "defined", type: "added"}]
            },
            wholeWords: {
                message:   "Our algorithm should err on the side of matching whole words...",
                leftValue: "catapults can throw things high in the air.",
                rightValue: "cats can jump high in the air.",
                expected:  [
                    { value: "catapults", type: "removed"},
                    { value: "cats", type: "added"},
                    { value: " can ", type: "unchanged"},
                    { value: "throw things", type: "removed"},
                    { value: "jump", type: "added"},
                    { value: " high in the air.", type: "unchanged"}
                ]
            },
            multiLine: {
                message:    "We should be able to compare multi-line strings...",
                leftValue:  "On first thought I liked it.\nOn second thought I didn't.",
                rightValue: "On second thought I didn't like it.\nOn third thought I did.",
                expected:  [
                    { value: "On first thought I liked it.\n", type: "removed"},
                    { value: "On second thought I didn't", type: "unchanged"},
                    { value: ".", type: "removed"},
                    { value: " like it.\nOn third thought I did.", type: "added"}
                ]
            },
            rightHandUndefined: {
                message:   "We should be able to handle `undefined` on the right hand side of a comparison...",
                leftValue: "defined",
                rightValue: undefined,
                expected:  [{ value: "defined", type: "removed"}]
            },
            bothUndefined: {
                message:   "We should be able to handle `undefined` on both sides of a comparison...",
                leftValue: undefined,
                rightValue: undefined,
                expected:  {"": [{ value: undefined, type: "unchanged"}] }
            },
            leftEmpty: {
                message:   "We should be able to handle an empty string on the left side of a comparison...",
                leftValue: "",
                rightValue: "not empty",
                expected:  [{value: "", type: "removed"}, { value: "not empty", type: "added"}]
            },
            rightEmpty: {
                message:   "We should be able to handle an empty string on the right side of a comparison...",
                leftValue: "not empty",
                rightValue: "",
                expected:  [{ value: "not empty", type: "removed"}, { value: "", type: "added"}]
            },
            bothEmpty: {
                message:   "We should be able to handle an empty string on both sides of a comparison...",
                leftValue: "",
                rightValue: "",
                expected:  [{ value: "", type: "unchanged"}]
            }
        }
    }
});
