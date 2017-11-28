/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var jqUnit = jqUnit || require("node-jqunit");

if (typeof require !== "undefined") {
    fluid.require("%gpii-diff");
    gpii.diff.loadTestingSupport();
}

jqUnit.module("Testing traceback function timeouts...");

fluid.registerNamespace("gpii.tests.diff.timeouts");
gpii.tests.diff.timeouts.runAllTests = function (that) {
    fluid.each(that.options.testDefs, gpii.tests.diff.timeouts.runSingleTest);
};

gpii.tests.diff.timeouts.runSingleTest = function (testDef) {
    jqUnit.test(testDef.message, function () {
        var startTime = Date.now();
        if (testDef.shouldFail) {
            try {
                testDef.testFn.apply(null, fluid.makeArray(testDef.args));
                jqUnit.fail("We should have received an error.");
            }
            catch (error) {
                var timeElapsed = Date.now() - startTime;
                jqUnit.assertTrue("We should have completed the run before the timeout.", timeElapsed < testDef.timeout);
            }
        }
        else {
            var result = testDef.testFn.apply(null, fluid.makeArray(testDef.args));
            if (testDef.expected) {
                jqUnit.assertDeepEq("The results should be as expected.", testDef.expected, result);
            }
        }
    });
};

fluid.defaults("gpii.tests.diff.timeouts", {
    gradeNames: ["fluid.component"],
    massiveLeftArray:  fluid.generate(100000, gpii.test.diff.performance.generateIndexArray, true),
    massiveRightArray: fluid.generate(100000, gpii.test.diff.performance.generateEvenArray, true),
    testDefs: {
        tableGeneration: {
            message:    "The traceback generation table should timeout as expected.",
            testFn:     gpii.diff.generateTracebackTable,
            args:       ["{that}.options.massiveLeftArray", "{that}.options.massiveRightArray", {timeout: 250} ],
            shouldFail: true,
            timeout:    500 // Allow just a little but of wiggle room.
        },
        fullTraceback: {
            message:    "A full traceback should timeout as expected.",
            testFn:     gpii.diff.longestCommonSequences,
            args:       ["{that}.options.massiveLeftArray", "{that}.options.massiveRightArray", { tracebackStrategy: "full", timeout: 1000} ],
            shouldFail: true,
            timeout:    1250 // Allow just a little but of wiggle room.
        },
        singleTraceback: {
            message:    "A single traceback should timeout as expected.",
            testFn:     gpii.diff.longestCommonSequences,
            args:       ["{that}.options.massiveLeftArray", "{that}.options.massiveRightArray", { tracebackStrategy: "single", timeout: 1000} ],
            shouldFail: true,
            timeout:    1250 // Allow just a little but of wiggle room.
        }
    },
    listeners: {
        "onCreate.runTests": {
            funcName: "gpii.tests.diff.timeouts.runAllTests",
            args:     ["{that}"]
        }
    }
});

gpii.tests.diff.timeouts();
