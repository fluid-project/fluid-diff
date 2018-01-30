/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.test.diff.performance");

/**
 *
 * A function designed for use with `fluid.generate`.  Generates test data that exactly corresponds to the array index,
 * as in:
 *
 * `fluid.generate(7, gpii.test.diff.performance.generateIndexArray); // [ 0, 1, 2, 3, 4, 5, 6]
 *
 * @param index {Number} - The array index passed by `fluid.generate`.
 * @return {Number} - The value passed to `index`
 */
gpii.test.diff.performance.generateIndexArray = function (index) {
    return index;
};

/**
 *
 * A function designed for use with `fluid.generate`.  Generates test data composed of zero and even numbers,  as in:
 *
 * `fluid.generate(7, gpii.test.diff.performance.generateEvenArray); // [ 0, 2, 2, 4, 4, 6, 6]
 *
 * @param index {Number} - The array index passed by `fluid.generate`.
 * @return {Number} - The next even number, or the number itself if is already even.
 *
 */
gpii.test.diff.performance.generateEvenArray = function (index) {
    return index + (index % 2 ? 1 : 0);
};
