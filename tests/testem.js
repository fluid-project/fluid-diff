// A testem configuration file in which complete coverage is the expected result.
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-testem");
require("../index");
require("./js/lib/harness");

var testemComponent = fluid.testem.instrumentation({
    coveragePort: 7015,
    coverageDir: "%fluid-diff/coverage",
    sourceDirs: {
        src: "%fluid-diff/src"
    },
    contentDirs: {
        "tests": "%fluid-diff/tests",
        "node_modules": "%fluid-diff/node_modules"
    },
    testPages:   [
        "tests/static/tests-arraysEqual.html",
        "tests/static/tests-calculateTightness.html",
        "tests/static/tests-combineDiff.html",
        "tests/static/tests-compare.html",
        "tests/static/tests-compareArrays.html",
        "tests/static/tests-compareMarkdown.html",
        "tests/static/tests-compareObjects.html",
        "tests/static/tests-compareStrings.html",
        "tests/static/tests-equals.html",
        "tests/static/tests-extractSegments.html",
        "tests/static/tests-hasChanged.html",
        "tests/static/tests-longestCommonSequence.html",
        "tests/static/tests-longestCommonSequences.html",
        "tests/static/tests-objectsEqual.html",
        "tests/static/tests-singleValueDiff.html",
        "tests/static/tests-sort.html",
        "tests/static/tests-timeouts.html"
    ],
    components: {
        express: {
            type: "fluid.tests.diff.harness"
        }
    }
});

module.exports = testemComponent.getTestemOptions();
