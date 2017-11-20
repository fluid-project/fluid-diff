/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
fluid.logObjectRenderChars = 4096;

var gpii = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%gpii-diff");

    // Included so that we can diagram individual tracebacks in a debugger, as in:
    // console.log(gpii.test.diff.diagramTracebackTable(testDef.leftValue, testDef.rightValue, tracebackTable));
    require("./lib/diagramTracebackTable");
}

jqUnit.module("Unit tests for 'single value' diff function...");

fluid.registerNamespace("gpii.test.diff.generateTracebackTable");
gpii.test.diff.generateTracebackTable.runAllTests = function (that) {
    fluid.each(that.options.testDefs, gpii.test.diff.generateTracebackTable.runSingleTest);
};

gpii.test.diff.generateTracebackTable.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var tracebackTable = gpii.diff.generateTracebackTable(testDef.leftValue, testDef.rightValue);
        jqUnit.assertDeepEq("The results should be as expected...", testDef.expected, tracebackTable);
    });

};

fluid.defaults("gpii.test.diff.generateTracebackTable", {
    gradeNames: ["fluid.component"],
    // We have to do this so that we can specify "undefined" in our expected output, otherwise it is removed by the framework.
    mergePolicy: {
        testDefs: "noexpand, nomerge"
    },
    testDefs: {
        // https://en.wikipedia.org/wiki/Longest_common_subsequence_problem
        wikipedia: {
            message:    "We should be able to complete the example problem from Wikipedia.",
            leftValue:  ["G", "A", "C"],
            rightValue: ["A", "G", "C", "A", "T"],
            expected:   [
                [
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": false,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": false,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": false,
                        "matchLength": 1
                    }
                ],
                [
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": true,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 2
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": false,
                        "matchLength": 2
                    }
                ],
                [
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": true,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": true,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 2
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 2
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 2
                    }
                ]
            ]
        },
        noMatch: {
            message:    "We should be able to complete the table for when there are no matches..",
            leftValue:  [0,1,2],
            rightValue: [3,4,5],
            expected: [
                [
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    }
                ],
                [
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    }
                ],
                [
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    }
                ]
            ]
        },
        manyEqualMatches: {
            message:    "We should be able to complete the table for a comparison with many equal matches.",
            leftValue:  [0,1,2,3,4],
            rightValue: [4,3,2,1,0],
            expected:   [
                [
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 1
                    }
                ],
                [
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    }
                ],
                [
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    }
                ],
                [
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 0
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    }
                ],
                [
                    {
                        "fromUpperLeft": false,
                        "fromLeft": false,
                        "fromAbove": false,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    },
                    {
                        "fromUpperLeft": false,
                        "fromLeft": true,
                        "fromAbove": true,
                        "matchLength": 1
                    }
                ]
            ]
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.test.diff.generateTracebackTable.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.test.diff.generateTracebackTable();
