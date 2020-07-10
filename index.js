/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.diff");

// Register our content so that it can be referenced in other packages using `fluid.module.resolvePath("%gpii-binder/path/to/content")`
fluid.module.register("gpii-diff", __dirname, require);

require("./src/js/diff");
require("./src/js/hasChanged-helper");
require("./src/js/isDiffArray-helper");
require("./src/js/leftValue-helper");
require("./src/js/rightValue-helper");

// Provide a function to optionally load test support.
gpii.diff.loadMarkdownSupport = function () {
    require("./src/js/markdown-diff");
};

gpii.diff.loadTestingSupport = function () {
    require("./tests/js/lib/performance-helpers");
    require("./tests/js/lib/diagramTracebackTable");
};

module.exports = gpii.diff;
