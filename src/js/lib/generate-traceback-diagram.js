/*

    GitHub does not allow background colors in HTML tables, so we generate SVG images to illustrate our traceback
    strategy.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");


fluid.require("%gpii-diff");
gpii.diff.loadTestingSupport();

var fs = require("fs");

fluid.registerNamespace("gpii.diff.diagrams");

gpii.diff.diagrams.generate = function (that) {
    fluid.each(that.options.diagrams, function (diagramDef) {
        var tracebackTable = gpii.diff.generateTracebackTable(diagramDef.leftValue, diagramDef.rightValue, diagramDef.tracebackOptions);
        var svgAsText = gpii.test.diff.diagramTracebackAsSvg(diagramDef.leftValue, diagramDef.rightValue, tracebackTable, diagramDef.diagramOptions);

        var resolvedOutputPath = fluid.module.resolvePath(diagramDef.outputPath);
        fs.writeFileSync(resolvedOutputPath, svgAsText, "utf8");
    });
};

fluid.defaults("gpii.diff.diagrams", {
    gradeNames: ["fluid.component"],
    diagrams: {
        wikipediaDefault: {
            outputPath: "%gpii-diff/docs/diagrams/wikipedia-full-traceback.svg",
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
            outputPath: "%gpii-diff/docs/diagrams/wikipedia-full-traceback-ga.svg",
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
            outputPath: "%gpii-diff/docs/diagrams/wikipedia-full-traceback-gc.svg",
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
            outputPath: "%gpii-diff/docs/diagrams/wikipedia-full-traceback-ac.svg",
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
            outputPath: "%gpii-diff/docs/diagrams/wikipedia-full-traceback-heat-map.svg",
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
            outputPath: "%gpii-diff/docs/diagrams/wikipedia-single-traceback.svg",
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
            funcName: "gpii.diff.diagrams.generate",
            args:     ["{that}"]
        }
    }
});

gpii.diff.diagrams();
