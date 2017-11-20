/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.test.diff");
gpii.test.diff.diagramTracebackTable = function (leftValue, rightValue, tracebackTable) {
    var dividerString =  "-".repeat((rightValue.length + 1) * 7) + "\n";
    var tableString = dividerString + "|     |";
    fluid.each(rightValue, function (value) {
        tableString += "|   " + value + " |";
    });
    tableString += "\n";
    fluid.each(tracebackTable, function (row, rowIndex) {
        tableString += dividerString;
        var rowString = "|  " + leftValue[rowIndex] + "  |";
        fluid.each(row, function (cell) {
            var directionMarker = " *";
            if (cell.fromUpperLeft) {
                directionMarker = " \\";
            }
            else if (cell.fromLeft && cell.fromAbove) {
                directionMarker = "_|";
            }
            else if (cell.fromLeft) {
                directionMarker = "_ ";
            }
            else if (cell.fromAbove) {
                directionMarker = " |";
            }
            rowString += "| " + directionMarker + cell.matchLength + " |";
        });
        rowString += "\n";
        tableString += rowString;
    });
    tableString += dividerString;
    return tableString;
};
