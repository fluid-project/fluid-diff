/*

    GitHub does not allow background colors in HTML tables, so we generate SVG images to illustrate our traceback
    strategy.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("%fluid-diff");
fluid.diff.loadTestingSupport();

var fs = require("fs");

fluid.registerNamespace("fluid.diff.diagrams");

fluid.diff.diagrams.generate = function (that) {
    fluid.each(that.options.diagrams, function (diagramDef) {
        var tracebackTable = fluid.diff.generateTracebackTable(diagramDef.leftValue, diagramDef.rightValue, diagramDef.tracebackOptions);
        var svgAsText = fluid.test.diff.diagramTracebackAsSvg(diagramDef.leftValue, diagramDef.rightValue, tracebackTable, diagramDef.diagramOptions);

        var resolvedOutputPath = fluid.module.resolvePath(diagramDef.outputPath);
        fs.writeFileSync(resolvedOutputPath, svgAsText, "utf8");
    });
};

fluid.defaults("fluid.diff.diagrams", {
    gradeNames: ["fluid.component"],
    diagrams: {
        wikipediaDefault: {
            outputPath: "%fluid-diff/docs/diagrams/wikipedia-full-traceback.svg",
            leftValue: ["G", "A", "C"],
            rightValue: ["A", "G", "C", "A", "T"],
            diagramOptions: {
                title: "A diagram of the LCS example from Wikipedia",
                cellHints: [
                    [{}, {}, {}, {}, {}],
                    [{}, {}, {}, {}, {}],
                    [{}, {}, {}, {}, {}]
                ]
            },
            tracebackOptions: { tracebackStrategy: "full"}
        },
        wikipediaFullGA: {
            outputPath: "%fluid-diff/docs/diagrams/wikipedia-full-traceback-ga.svg",
            leftValue: ["G", "A", "C"],
            rightValue: ["A", "G", "C", "A", "T"],
            diagramOptions: {
                title: "A diagram of the LCS example from Wikipedia with the path to segment G-A highlighted.",
                cellHints: [
                    [{}, { fill: { color: "#ccccff" } }, { fill: { color: "#ccccff" } }, {}, {}],
                    [{}, {}, {}, { fill: { color: "#ccccff" } }, { fill: { color: "#ccccff" } }],
                    [{}, {}, {}, {}, { fill: { color: "#ccccff" } }]
                ]
            },
            tracebackOptions: { tracebackStrategy: "full"}
        },
        wikipediaFullGC: {
            outputPath: "%fluid-diff/docs/diagrams/wikipedia-full-traceback-gc.svg",
            leftValue: ["G", "A", "C"],
            rightValue: ["A", "G", "C", "A", "T"],
            diagramOptions: {
                title: "A diagram of the LCS example from Wikipedia with the path to segment G-C highlighted.",
                cellHints: [
                    [{}, { fill: { color: "#ccccff" } }, {}, {}, {}],
                    [{}, { fill: { color: "#ccccff" } }, {}, {}, {}],
                    [{}, {}, { fill: { color: "#ccccff" } }, { fill: { color: "#ccccff" } }, { fill: { color: "#ccccff" } }]
                ]
            },
            tracebackOptions: { tracebackStrategy: "full"}
        },
        wikipediaFullAC: {
            outputPath: "%fluid-diff/docs/diagrams/wikipedia-full-traceback-ac.svg",
            leftValue: ["G", "A", "C"],
            rightValue: ["A", "G", "C", "A", "T"],
            diagramOptions: {
                title: "A diagram of the LCS example from Wikipedia with the path to segment A-C highlighted.",
                cellHints: [
                    [{}, {}, {}, {}, {}],
                    [{ fill: { color: "#ccccff" } }, { fill: { color: "#ccccff" } }, {}, {}, {}],
                    [{}, {}, { fill: { color: "#ccccff" } }, { fill: { color: "#ccccff" } }, { fill: { color: "#ccccff" } }]
                ]
            },
            tracebackOptions: { tracebackStrategy: "full"}
        },
        wikipediaFullHeatMap: {
            outputPath: "%fluid-diff/docs/diagrams/wikipedia-full-traceback-heat-map.svg",
            leftValue: ["G", "A", "C"],
            rightValue: ["A", "G", "C", "A", "T"],
            diagramOptions: {
                title: "A diagram of the LCS example from Wikipedia with the path to segment G-C highlighted.",
                cellHints: [
                    [{}, { fill: { color: "#ff6666" } }, { fill: { color: "#ff6666" } }, {}, {}],
                    [{ fill: { color: "#ffcccc" } }, { fill: { color: "#ffcccc" } }, {}, { fill: { color: "#ff6666" } }, { fill: { color: "#ffcccc" } }],
                    [{}, {}, { fill: { color: "#ffcccc" } }, { fill: { color: "#ffcccc" } }, { fill: { color: "#ffcccc" } }]
                ]
            },
            tracebackOptions: { tracebackStrategy: "full"}
        },
        wikipediaSingle: {
            outputPath: "%fluid-diff/docs/diagrams/wikipedia-single-traceback.svg",
            leftValue: ["G", "A", "C"],
            rightValue: ["A", "G", "C", "A", "T"],
            diagramOptions: {
                title: "A diagram of the LCS example from Wikipedia with the path to segment G-C highlighted.",
                cellHints: [
                    [{}, { fill: { color: "#ccccff" } }, { fill: { color: "#ccccff" } }, {}, {}],
                    [{}, {}, {}, { fill: { color: "#ccccff" } }, { fill: { color: "#ccccff" } }],
                    [{}, {}, {}, {}, { fill: { color: "#ccccff" } }]
                ]
            },
            tracebackOptions: { tracebackStrategy: "full"}
        }
    },
    listeners: {
        "onCreate.generateDiagrams": {
            funcName: "fluid.diff.diagrams.generate",
            args:     ["{that}"]
        }
    }
});

fluid.diff.diagrams();
