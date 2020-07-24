/*

    A common suite of tests for both the HTML and text templates in this package.

 */
/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.require("%fluid-handlebars");

require("./tests-templates-common");

fluid.tests.diff.templates.node();
