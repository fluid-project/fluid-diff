/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.defaults("fluid.test.diff.testDefs.objectsEqual", {
    gradeNames: ["fluid.component"],
    mergePolicy: {
        "testDefs.objects": "nomerge, noexpand"
    },
    testDefs: {
        objects: {
            unequalKeyLength: {
                message:   "Objects with a different number of keys should not be equal.",
                leftValue: { foo: "bar", baz: "quuux"},
                rightValue: { foo: "bar"},
                expected:  false
            },
            unequalWithEqualKeyLength: {
                message:  "Unequal objects with the same number of keys should not be equal.",
                leftValue: { foo: "bar", baz: "qux"},
                rightValue: { foo: "bar", qux: "quux"},
                expected:  false
            },
            emptyObjects: {
                message:  "Two empty objects should be equal.",
                leftValue: {},
                rightValue: {},
                expected:  true
            },
            equalObjects: {
                message:  "Equal objects should be equal.",
                leftValue: { foo: "bar", baz: { qux: "quuux"} },
                rightValue: { foo: "bar", baz: { qux: "quuux"} },
                expected:  true
            },
            arrayValuesEqual: {
                message:  "Objects containing equal arrays should be equal.",
                leftValue: { foo: [1] },
                rightValue: { foo: [1] },
                expected:  true
            },
            arrayValuesUnequal: {
                message:  "Objects containing unequal arrays should be unequal.",
                leftValue: { foo: [0] },
                rightValue: { foo: [1] },
                expected:  false
            },
            unEqualShallow: {
                message:  "Shallow inequalities should be handled correctly.",
                leftValue: { foo: 0 },
                rightValue: { foo: 1 },
                expected:  false
            },
            unEqualDeep: {
                message:  "Deep inequalities should be handled correctly.",
                leftValue: { foo: { bar: { baz: 0 } } },
                rightValue: { foo: { bar: { baz: 1 } } },
                expected:  false
            },
            undefinedLeftShallowUnequal: {
                message:  "Shallow undefined values on the left side should be handled correctly.",
                leftValue: undefined,
                rightValue: {},
                expected:  false
            },
            undefinedRightShallowUnequal: {
                message:  "Shallow undefined values on the right side should be handled correctly.",
                leftValue: {},
                rightValue: undefined,
                expected:  false
            },
            undefinedLeftDeepUnequal: {
                message:  "Deep undefined values on the left side should be handled correctly.",
                leftValue: { foo: undefined },
                rightValue: { foo: {} },
                expected:  false
            },
            undefinedRightDeepUnequal: {
                message:  "Deep undefined values on the right side should be handled correctly.",
                leftValue: { foo: {} },
                rightValue: { foo: undefined },
                expected:  false
            },
            nullLeftShallowUnequal: {
                message: "Shallow null values on the left side should be handled correctly.",
                leftValue: null,
                rightValue: {},
                expected: false
            },
            nullRightShallowUnequal: {
                message: "Shallow null values on the right side should be handled correctly.",
                leftValue: {},
                rightValue: null,
                expected: false
            },
            nullLeftDeepUnequal: {
                message: "Shallow null values on the left side should be handled correctly.",
                leftValue: { foo: null },
                rightValue: { foo: {} },
                expected: false
            },
            nullRightDeepUnequal: {
                message: "Shallow null values on the right side should be handled correctly.",
                leftValue: { foo: {} },
                rightValue: { foo: null},
                expected: false
            },
            nullValuesShallowEqual: {
                message: "Shallow null values on both sides should be reported as equal.",
                leftValue: null,
                rightValue: null,
                expected: true
            },
            nullValuesDeepEqual: {
                message: "Deep null values on both sides should be reported as equal.",
                leftValue: { foo: null },
                rightValue: { foo: null},
                expected: true
            }
        }
    }
});
