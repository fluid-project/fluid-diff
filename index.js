/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.registerNamespace("fluid.diff");

// Register our content so that it can be referenced in other packages using `fluid.module.resolvePath("%fluid-binder/path/to/content")`
fluid.module.register("fluid-diff", __dirname, require);

require("./src/js/diff");
require("./src/js/hasChanged-helper");
require("./src/js/isDiffArray-helper");
require("./src/js/leftValue-helper");
require("./src/js/rightValue-helper");

// Provide a function to optionally load test support.
fluid.diff.loadMarkdownSupport = function () {
    require("./src/js/markdown-diff");
};

fluid.diff.loadTestingSupport = function () {
    require("./tests/js/lib/performance-helpers");
    require("./tests/js/lib/diagramTracebackTable");
};

module.exports = fluid.diff;
