/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.defaults("gpii.test.diff.testDefs.objectsEqual", {
    gradeNames: ["fluid.component"],
    mergePolicy: {
        "testDefs.objects": "nomerge, noexpand"
    },
    testDefs: {
        objects: {
            unequalKeyLength: {
                message:   "Objects with a different number of keys should not be equal...",
                leftValue: { foo: "bar", baz: "quuux"},
                rightValue: { foo: "bar"},
                expected:  false
            },
            unequalWithEqualKeyLength: {
                message:  "Unequal objects with the same number of keys should not be equal...",
                leftValue: { foo: "bar", baz: "qux"},
                rightValue: { foo: "bar", qux: "quux"},
                expected:  false
            },
            emptyObjects: {
                message:  "Two empty objects should be equal...",
                leftValue: {},
                rightValue: {},
                expected:  true
            },
            equalObjects: {
                message:  "Equal objects should be equal...",
                leftValue: { foo: "bar", baz: { qux: "quuux"} },
                rightValue: { foo: "bar", baz: { qux: "quuux"} },
                expected:  true
            },
            arrayValuesEqual: {
                message:  "Objects containing equal arrays should be equal...",
                leftValue: { foo: [1] },
                rightValue: { foo: [1] },
                expected:  true
            },
            arrayValuesUnequal: {
                message:  "Objects containing unequal arrays should be unequal...",
                leftValue: { foo: [0] },
                rightValue: { foo: [1] },
                expected:  false
            },
            unEqualShallow: {
                message:  "Shallow inequalities should be handled correctly...",
                leftValue: { foo: 0 },
                rightValue: { foo: 1 },
                expected:  false
            },
            unEqualDeep: {
                message:  "Deep inequalities should be handled correctly...",
                leftValue: { foo: { bar: { baz: 0 } } },
                rightValue: { foo: { bar: { baz: 1 } } },
                expected:  false
            },
            undefinedShalllowUnequal: {
                message:  "Shallow undefined values should be handled correctly...",
                leftValue: {},
                rightValue: undefined,
                expected:  false
            },
            undefinedDeepUnequal: {
                message:  "Deep undefined values should be handled correctly...",
                leftValue: { foo: {} },
                rightValue: { foo: undefined },
                expected:  false
            }
        }
    }
});
