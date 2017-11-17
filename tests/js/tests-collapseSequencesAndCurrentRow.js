/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

typeof require !== "undefined" && fluid.require("%gpii-diff");

jqUnit.module("Unit tests for 'longest common sequence' function...");

fluid.registerNamespace("gpii.test.diff.collapseSequencesAndCurrentRow");
gpii.test.diff.collapseSequencesAndCurrentRow.runAllTests = function (that) {
    fluid.each(that.options.testDefs, gpii.test.diff.collapseSequencesAndCurrentRow.runSingleTest);
};

gpii.test.diff.collapseSequencesAndCurrentRow.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var result = gpii.diff.collapseSequencesAndCurrentRow(testDef.sequences, testDef.row);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, result);
    });
};

fluid.defaults("gpii.test.diff.collapseSequencesAndCurrentRow", {
    gradeNames: ["fluid.component"],
    // We want to compare to undefined values, so we need to avoid trying to expand or merge them.
    mergePolicy: {
        testDefs: "nomerge, noexpand"
    },
    testDefs: {
        cullOne: {
            message:    "We should be able to cull a single sequence that is not a part of any match.",
            sequences:  [[{ "leftIndex": 0, "rightIndex": 1 }, { "leftIndex": 1, "rightIndex": 2 }], [{ "leftIndex": 2, "rightIndex": 3 }]],
            row:        [[1]],
            expected:   { updatedSequences: [[{ "leftIndex": 2, "rightIndex": 3 }]], updatedRow: [[0]]}
        },
        cullAll: {
            message:    "We should be able to cull all sequences if there are no matches.",
            sequences:  [[{ "leftIndex": 0, "rightIndex": 1 }], [{ "leftIndex": 1, "rightIndex": 2 }], [{ "leftIndex": 2, "rightIndex": 3 }]],
            row:        [[],[],[],[]],
            expected:   { updatedSequences: [], updatedRow: [[], [], [], []]}
        },
        preserveSingleMatch: {
            message:   "We should be able to preserve a single matching sequence.",
            sequences: [[{ "leftIndex": 0, "rightIndex": 1 }]],
            row:       [[],[0],[0],[0], [0]],
            expected:  {
                updatedSequences: [[{ "leftIndex": 0, "rightIndex": 1 }]],
                updatedRow:       [[],[0],[0],[0], [0]]
            }
        },
        preserveAll: {
            message:   "We should be able to preserve all existing sequences if they are all part of a match.",
            sequences: [[{ "leftIndex": 0, "rightIndex": 1 }]],
            row:       [[],[0],[0],[0], [0]],
            expected:  {
                updatedSequences: [[{ "leftIndex": 0, "rightIndex": 1 }]],
                updatedRow:       [[],[0],[0],[0], [0]]
            }
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.collapseSequencesAndCurrentRow.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.collapseSequencesAndCurrentRow();
