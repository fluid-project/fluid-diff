// A testem configuration file in which complete coverage is the expected result.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("%gpii-testem");

require("./js/lib/harness");

var testemComponent = gpii.testem({
    sourceDirs:  ["src"],
    serveDirs:   ["src"],
    testPages:   [
        "tests/static/tests-arraysEqual.html",
        "tests/static/tests-compare.html",
        "tests/static/tests-compareArrays.html",
        "tests/static/tests-compareObjects.html",
        "tests/static/tests-compareMarkdown.html",
        "tests/static/tests-compareStrings.html",
        "tests/static/tests-extractPhraseSegments.html",
        "tests/static/tests-longestCommonArraySegment.html",
        "tests/static/tests-objectsEqual.html",
        "tests/static/tests-singleValueDiff.html",
        "tests/static/tests-templates-browser.html"
    ],
    generateCoverageReport: false, // We will need to generate this ourselves once the entire run is finished...
    coveragePort: 7015,
    components: {
        coverageExpressInstance: {
            type: "gpii.tests.diff.harness"
        }
    }
});

module.exports = testemComponent.getTestemOptions();
