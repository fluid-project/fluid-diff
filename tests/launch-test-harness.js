/*

    A `fluid-launcher`-based script to launch this package's test harness for manual testing.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-diff");
require("./js/lib/harness");

fluid.require("%fluid-launcher");

fluid.defaults("fluid.tests.diff.harness.launcher", {
    gradeNames:  ["fluid.launcher"],
    optionsFile: "%fluid-diff/tests/configs/harness.json",
    yargsOptions: {
        env: true,
        describe: {
            "ports":      "The port express should bind to.",
            "setLogging": "The logging level to use.  Set to `false` (only errors and warnings) by default."
        },
        defaults: {
            "setLogging":  true,
            "optionsFile": "{that}.options.optionsFile"
        },
        coerce: {
            "setLogging": JSON.parse
        },
        help: true
    }
});

fluid.tests.diff.harness.launcher();
