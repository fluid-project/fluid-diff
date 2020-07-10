/*

    A `gpii-launcher`-based script to launch this package's test harness for manual testing.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("%gpii-diff");
require("./js/lib/harness");

fluid.require("%gpii-launcher");

fluid.defaults("gpii.tests.diff.harness.launcher", {
    gradeNames:  ["gpii.launcher"],
    optionsFile: "%gpii-diff/tests/configs/harness.json",
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

gpii.tests.diff.harness.launcher();
