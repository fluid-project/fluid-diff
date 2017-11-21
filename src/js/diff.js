/* eslint-env node */
/*

 Static functions to produce a "diff" report in comparing two values.  See the documentation in this package for
 details.

 */
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.diff");

/**
 *
 * Produce a representation of a "single value" change, with no deeper comparison.  Intended for use when either the
 * left or right side is a numeric, boolean, null, or undefined value.  For array values, `gpii.diff.compareArrays`
 * should be used instead.  For string values, `gpii.diff.compareStrings` should be used instead.  For object values
 * `gpii.diff.compareObjects` should be used instead.
 *
 * @param leftValue {Any} - The left-hand value.
 * @param rightValue {Any} - The right-hand value.
 * @param isArray {Boolean} - Whether we are dealing with arrays or not
 * @return {Array} - An array of segments representing everything that has changed (or not changed).
 *
 */
gpii.diff.singleValueDiff = function (leftValue, rightValue, isArray) {
    var key = isArray ? "arrayValue" : "value";
    var segments = [];
    if ((isArray && gpii.diff.arraysEqual(leftValue, rightValue)) || (!isArray && leftValue === rightValue)) {
        var unchangedSegment = {type: "unchanged"};
        unchangedSegment[key] = leftValue;
        segments.push(unchangedSegment);
    }
    else {
        if ((!isArray && leftValue !== undefined) || (isArray && leftValue.length)) {
            var removedSegment = {type: "removed"};
            removedSegment[key] = leftValue;
            segments.push(removedSegment);
        }
        if ((!isArray && rightValue !== undefined) || (isArray && rightValue.length)) {
            var addedSegment = {type: "added"};
            addedSegment[key] = rightValue;
            segments.push(addedSegment);
        }
    }
    return segments;
};

/**
 *
 * Sort arrays by the highest length, and then by the "tightest" grouping of elements, then by the lowest (average)
 * index of the first segment.
 *
 * @param a {Object} - An array.
 * @param b {Object} - An array to compare with `a`.
 * @returns {number} - -1 if `a` is "first", 1 if `b` is "first", 0 if their position is interchangeable.
 *
 */
gpii.diff.sortByLengthThenTightnessThenIndex = function (a, b) {
    // a is a longer array
    if (a.length > b.length) {
        return -1;
    }
    // the arrays are the same length
    else if (a.length === b.length) {
        var aTightness = gpii.diff.calculateTightness(a);
        var bTightness = gpii.diff.calculateTightness(b);
        if (aTightness < bTightness) {
            return -1;
        }
        else if (aTightness === bTightness) {
            var aIndex = (a[0].leftIndex + a[0].rightIndex) / 2;
            var bIndex = (b[0].leftIndex + b[0].rightIndex) / 2;
            // a has the earliest occurring subsequence
            if (aIndex < bIndex) {
                return -1;
            }
            // It's not possible to reach this through normal operation, but it's included to complete the "sort" contract.
            else if (aIndex === bIndex) {
                return 0;
            }
            // b has the earliest occurring subsequence
            else if (bIndex < aIndex) {
                return 1;
            }
        }
        else if (aTightness > bTightness) {
            return 1;
        }
    }
    // b is a longer array.
    else {
        return 1;
    }
};

/**
 *
 * Calculate the "tightness" of an array of LCS segments, where lower values are "tighter".  An array of adjoining
 * segments has a "tightness" of 0, as when evaluating the following:
 *
 * `[{ leftIndex:0, rightIndex:0 }, { leftIndex:1, rightIndex:1}]`
 *
 * An array that skips a single segment has a "tightness" of 1, as when evaluating the following:
 *
 * `[{ leftIndex:0, rightIndex:0 }, { leftIndex:1, rightIndex:2}]`
 *
 * @param lcsSegments {Array} - An array of LCS segments.
 * @returns {Number} - A number representing the "tightness".
 *
 */
gpii.diff.calculateTightness = function (lcsSegments) {
    if (lcsSegments.length <= 1) {
        return 0;
    }
    else {
        var firstSegment = lcsSegments[0];
        var lastSegment = lcsSegments[lcsSegments.length - 1];

        var leftDistance = lastSegment.leftIndex - firstSegment.leftIndex - (lcsSegments.length - 1);
        var rightDistance = lastSegment.rightIndex - firstSegment.rightIndex - (lcsSegments.length - 1);

        return (leftDistance + rightDistance) / 2;
    }
};

/**
 *
 * Break down a string into an array of "segments" of alternating "word" and "non-word" content.  Treats `null` and
 * `undefined` values the same as empty strings.  Handles contractions and possessives only in the case where a single
 * apostrophe occurs between two blocks of "word" content.
 *
 * @param originalString {String} - A string to break down into segments.
 * @returns {Array} - An array of substrings.
 */
gpii.diff.extractSegments = function (originalString) {
    var segments = [];

    if (typeof originalString === "string") {
        var matches = originalString.match(/([\w]+'?[\w]*|[\W]+)/mg);
        if (matches) {
            segments = segments.concat(matches);
        }
    }
    else if (originalString !== undefined && originalString !== null) {
        fluid.fail("gpii.diff.extractSegments can only be used with string, undefined, or null values.");
    }

    return segments;
};

/**
 *
 * Go through a string and create a report that can be used to render a "diff" view.  The result is an array of
 * segments, which consist of a segment value and details about whether the segment is unchanged, added, or removed
 * when compared to `leftString`.
 *
 * @param `leftString` {String} - The first string, from whose perspective the "diff" results will be represented.
 * @param `rightString` {String} - The second string, to compare to the first string.
 * @return {Array} - An array of "segments" representing `rightString` as compared to `leftString`.
 *
 */
gpii.diff.compareStrings = function (leftString, rightString) {
    if (typeof leftString !== "string" || typeof rightString !== "string") {
        return gpii.diff.singleValueDiff(leftString, rightString);
    }
    else if (leftString === rightString) {
        return [{ value: leftString, type: "unchanged"}];
    }
    else if (leftString.indexOf("\n") !== -1 && rightString.indexOf("\n") !== -1) {
        return gpii.diff.compareStringsByLine(leftString, rightString);
    }
    else {
        return gpii.diff.compareStringsBySegment(leftString, rightString);
    }
};

/**
 *
 * `gpii.diff.compareStrings` can perform a deeper comparison of {String}, `undefined`, and `null` values.  This
 * function is used to determine whether we can perform that deeper comparison.
 *
 * @param value {Any} - A value to evaluate.
 * @returns {boolean} - Returns `true` if the value is a {String}, `undefined`, or `null`.  Returns `false` otherwise.
 *
 */
gpii.diff.isStringNullOrUndefined = function (value) {
    return typeof value === "string" || value === undefined || value === null;
};

/**
 *
 * Compare two arrays, returning all of the longest common sequences (not necessarily contiguous).  When comparing `[1,3,5,7]`
 * to `[0,1,2,3,4,5,6]`, `[1,3,5,7]` is the longest sequence.  Follows a modified version of the LCS approach outlined
 * here:
 *
 * http://en.wikipedia.org/wiki/Longest_common_subsequence_problem
 *
 * The output returned describes the match in terms of the position of each segment in `leftArray` and `rightArray`.
 * So, for example, when comparing `["foo","bar", "quux"]` to `["bar","baz", "qux", "quux"]`, this function would return:
 *
 * [{ leftIndex: 1, rightIndex: 0 }, { leftIndex: 2, rightIndex: 3} ] // "bar" and "quux"
 *
 * @param leftArray {Array} - An array.
 * @param rightArray {Array} - An array to compare to `leftArray`.
 * @returns {Array} - An array of sequence arrays.  Each entry in a sequence array describes the position of a matching segment in the original arrays.
 *
 */
gpii.diff.longestCommonSequences = function (leftArray, rightArray) {
    var tracebackTable = gpii.diff.generateTracebackTable(leftArray, rightArray);
    var longestSequences = gpii.diff.tracebackLongestSequences(tracebackTable);
    return longestSequences;
};

/**
 *
 * Compare two arrays, returning only the first sequence.  If sequences are of equal length, the "tightest", earliest
 * match is returned.
 *
 * @param leftArray {Array} - An array of values.
 * @param rightArray {Array} - An array of values to compare to `leftArray`.
 * @returns {Array} - A single array representing the matching segments in the longest, "tightest", earliest matching sequence.
 *
 */
gpii.diff.longestCommonSequence = function (leftArray, rightArray) {
    var longestSequences = gpii.diff.longestCommonSequences(leftArray, rightArray);
    if (longestSequences.length === 0) {
        return [];
    }
    else if (longestSequences.length === 1) {
        return longestSequences[0];
    }
    else {
        // Sort the sequences, then return only the first match.
        longestSequences.sort(gpii.diff.sortByLengthThenTightnessThenIndex);
        return longestSequences[0];
    }
};

/**
 *
 * Generate a "traceback table" that can be used to determine the longest common sequence in two arrays.  Adapted from:
 *
 * https://en.wikipedia.org/wiki/Longest_common_subsequence_problem#Traceback_approach
 *
 * The results are an array of sequences. Each sequence segment is an object which indicates the left and right index
 * of the "match", as in this example, where only the first elements in both arrays match:
 *
 * [[{ leftIndex: 0, rightIndex: 0}]]
 *
 * Note: `undefined` values are treated as empty arrays.
 *
 * @param leftArray {Array} - An array of values.
 * @param rightArray {Array} - An array of values to compare to `leftArray`.
 * @returns {Array} - An array of the longest common sequences (see above).
 *
 */
gpii.diff.generateTracebackTable = function (leftArray, rightArray) {
    // We treat "undefined" values as empty arrays.
    leftArray = leftArray !== undefined ? leftArray : [];
    rightArray = rightArray !== undefined ? rightArray : [];
    if (!Array.isArray(leftArray) || !Array.isArray(rightArray)) {
        fluid.fail("I can only generate traceback tables for arrays.");
    }
    var tracebackTable = [];
    if (leftArray.length && rightArray.length) {
        for (var rowIndex = 0; rowIndex < leftArray.length; rowIndex++) {
            tracebackTable[rowIndex] = [];
            for (var colIndex = 0; colIndex < rightArray.length; colIndex++) {
                var isMatch        = gpii.diff.equals(leftArray[rowIndex], rightArray[colIndex]);

                var longestPreviousByRow     = rowIndex > 0 && tracebackTable[rowIndex - 1][colIndex].matchLength ?  tracebackTable[rowIndex - 1][colIndex].matchLength : 0;
                var longestPreviousByColumn  = colIndex > 0 && tracebackTable[rowIndex][colIndex - 1].matchLength ?  tracebackTable[rowIndex][colIndex - 1].matchLength : 0;
                var longestPreviousUpperLeft = colIndex > 0 && rowIndex > 0 ? tracebackTable[rowIndex - 1][colIndex - 1].matchLength : 0;
                var longestPrevious          = isMatch ? longestPreviousUpperLeft : Math.max(longestPreviousByRow, longestPreviousByColumn);

                var fromUpperLeft = isMatch;
                var fromLeft      = !fromUpperLeft && longestPrevious > 0 && longestPreviousByColumn === longestPrevious;
                var fromAbove     = !fromUpperLeft && longestPrevious > 0 && longestPreviousByRow === longestPrevious;

                tracebackTable[rowIndex][colIndex] = {
                    fromUpperLeft: fromUpperLeft,
                    fromLeft:      fromLeft,
                    fromAbove:     fromAbove,
                    matchLength:   isMatch ? longestPrevious + 1 : longestPrevious
                };
            }
        }
    }
    return tracebackTable;
};

/**
 *
 * "Trace back" through the results of an array comparison created by `gpii.diff.generateTracebackTable`.  Starts with
 * the last cell (last row, last column), and follows inherited matches one "wave" at a time until all paths have
 * reached a cell with no inherited matches. Each "wave" accumulates:
 *
 * - the left and right position of the next cell in the "path"
 * - any segments collected thus far along a given "path"
 *
 * As a cell may inherit from both the top and left adjacent cell, the "wave" of cells being evaluated may grow to be
 * as large as the "hypotenuse" of the original arrays, i.e.
 *
 * `Math.sqrt((Math.pow(leftArray.length, 2) + Math.pow(rightArray.length, 2));`
 *
 * @param tracebackTable {Array} - A traceback table created using `gpii.diff.generateTracebackTable`.
 * @returns {Array} - An array of the longest distinct sequences found in the traceback.
 *
 */
gpii.diff.tracebackLongestSequences = function (tracebackTable) {
    var leftLength = tracebackTable.length;
    if (leftLength) {
        var rightLength = tracebackTable[0].length;
        var terminalSequences = [];
        var currentWave = [{leftIndex: leftLength - 1, rightIndex: rightLength - 1, matchingSquares: []}];

        while (currentWave.length) {
            var nextWave = [];
            for (var waveIndex = 0; waveIndex < currentWave.length; waveIndex++) {
                var cellReference = currentWave[waveIndex];
                var currentCell = tracebackTable[cellReference.leftIndex][cellReference.rightIndex];
                // We've hit an edge or corner and can stop.
                if ((!currentCell.fromUpperLeft && !currentCell.fromLeft && !currentCell.fromAbove && currentCell.matchLength > 0) || (currentCell.fromUpperLeft && currentCell.matchLength === 1)) {
                    cellReference.matchingSquares.unshift({leftIndex: cellReference.leftIndex, rightIndex: cellReference.rightIndex});
                    terminalSequences.push(cellReference.matchingSquares);
                    // Special case of late partial matches in the left column.
                    if (currentCell.fromUpperLeft && cellReference.rightIndex === 0 && cellReference.leftIndex > 0) {
                        nextWave.push({ leftIndex: cellReference.leftIndex - 1, rightIndex: 0, matchingSquares: []});
                    }
                }
                else {
                    if (currentCell.fromUpperLeft) {
                        var upperLeftCell = tracebackTable[cellReference.leftIndex - 1][cellReference.rightIndex - 1];
                        var nextCellReference = { leftIndex: cellReference.leftIndex - 1, rightIndex: cellReference.rightIndex - 1, matchingSquares: fluid.copy(cellReference.matchingSquares)};
                        if (upperLeftCell.matchLength < currentCell.matchLength) {
                            nextCellReference.matchingSquares.unshift({ leftIndex: cellReference.leftIndex, rightIndex: cellReference.rightIndex});
                        }
                        nextWave.push(nextCellReference);
                    }
                    else {
                        // `leftIndex` in this case is the "row", and `rightIndex` is the "column.  `fromLeft` here means
                        // we are moving one column to the left, i.e. `rightIndex` - 1.
                        if (currentCell.fromLeft) {
                            var leftCell = tracebackTable[cellReference.leftIndex][cellReference.rightIndex - 1];
                            var nextLeftCellReference = { leftIndex: cellReference.leftIndex, rightIndex: cellReference.rightIndex - 1, matchingSquares: fluid.copy(cellReference.matchingSquares)};
                            if (leftCell.matchLength < currentCell.matchLength) {
                                nextLeftCellReference.matchingSquares.unshift({ leftIndex: cellReference.leftIndex, rightIndex: cellReference.rightIndex});
                            }
                            nextWave.push(nextLeftCellReference);
                        }
                        // `leftIndex` in this case is the "row", and `rightIndex` is the "column.  `fromAbove` here means
                        // we are moving one column upwards , i.e. `leftIndex` - 1.
                        if (currentCell.fromAbove) {
                            var upperCell = tracebackTable[cellReference.leftIndex - 1][cellReference.rightIndex];
                            var nextUpperCellReference = { leftIndex: cellReference.leftIndex - 1, rightIndex: cellReference.rightIndex, matchingSquares: fluid.copy(cellReference.matchingSquares)};
                            if (upperCell.matchLength < currentCell.matchLength) {
                                nextUpperCellReference.matchingSquares.unshift({ leftIndex: cellReference.leftIndex, rightIndex: cellReference.rightIndex});
                            }
                            nextWave.push(nextUpperCellReference);
                        }
                    }
                }
            }
            var dedupedNextWave = gpii.diff.dedupeTracebackResults(nextWave);
            currentWave = dedupedNextWave;
        }

        // Dedupe any sequences that can be reached by multiple paths.
        var uniqueTracebacks = gpii.diff.dedupeTracebackResults(terminalSequences);

        // Return the results as sequences of matching segments with the leftIndex and rightIndex values.
        return uniqueTracebacks;
    }
    else {
        return [];
    }
};

/**
 *
 * Sort two sequences by length, then by left indices, then by right indices.
 * Sort two sequences by length, then by left indices, then by right indices.
 *
 * @param a {Object} - A single sequence, an array of values like `{ leftIndex: 0, rightIndex: 1}`.
 * @param b {Object} - A second sequence to compare to `a`.
 * @returns {number} - Returns `-1` if `a` should appear before `b`, `1` if b should appear before `a`, `0` if their position is interchangeable.
 *
 */
gpii.diff.sortByMatchIndexes = function (a, b) {
    if (a.length > b.length) {
        return -1;
    }
    else if (a.length === b.length) {
        if (a.length > 0) {
            for (var cellIndex = 0; cellIndex < a.length; cellIndex++) {
                var aCell = a[cellIndex];
                var bCell = b[cellIndex];
                if (!gpii.diff.equals(aCell, bCell)) {
                    if (a.leftIndex < b.leftIndex) {
                        return -1;
                    }
                    else if (a.leftIndex === b.leftIndex) {
                        if (a.rightIndex < b.rightIndex) {
                            return -1;
                        }
                        // It's not possible for these to be equal, as they would have been caught by gpii.diff.equals,
                        // so we can safely assume that b.rightIndex is less than a.rightIndex here.
                        else {
                            return 1;
                        }
                    }
                    else {
                        return 1;
                    }
                }
            }
        }

        // If we've made it this far, the entire array is equal.
        return 0;
    }
    else {
        return 1;
    }
};

/**
 *
 * Return only the unique matchSequences from traceback results.  Will only work on data that is sorted by matchSequence,
 * by calling this function the original results will be sorted using  `gpii.diff.sortByMatchIndexes`.
 *
 * @param rawTracebackResults {Array} - Any array of traceback sequences, as generated by `gpii.diff.tracebackLongestSequence`.
 * @returns {Array} - A new array containing only the unique values.
 *
 */
gpii.diff.dedupeTracebackResults = function (rawTracebackResults) {
    var dedupedResults = [];

    if (rawTracebackResults.length) {
        // Order the sequences before deduping.
        rawTracebackResults.sort(gpii.diff.sortByMatchIndexes);

        var lastEntry = {};
        fluid.each(rawTracebackResults, function (sequence) {
            if (!gpii.diff.equals(sequence, lastEntry)) {
                dedupedResults.push(sequence);
            }
            lastEntry = sequence;
        });
    }

    return dedupedResults;
};

/**
 *
 * Compare strings by "segment", where a segment is a block of non-word or word characters.
 *
 * @param `leftString` {String} - The first string, from whose perspective the "diff" results will be represented.
 * @param `rightString` {String} - The second string, to compare to the first string.
 * @return {Array} - An array of "segments" representing `rightString` as compared to `leftString`.
 *
 */
gpii.diff.compareStringsBySegment = function (leftString, rightString) {
    if (leftString === undefined && rightString === undefined) {
        return gpii.diff.singleValueDiff(leftString, rightString);
    }
    else if (gpii.diff.isStringNullOrUndefined(leftString) && gpii.diff.isStringNullOrUndefined(rightString)) {
        var leftSegments = gpii.diff.extractSegments(leftString);
        var rightSegments = gpii.diff.extractSegments(rightString);
        var arrayDiff = gpii.diff.compareArrays(leftSegments, rightSegments);
        var stringDiff = [];
        fluid.each(arrayDiff, function (arrayDiffSegment) {
            stringDiff.push({value: arrayDiffSegment.arrayValue.join(""), type: arrayDiffSegment.type});
        });
        return stringDiff;
    }
    else {
        return gpii.diff.compare(leftString, rightString);
    }
};

/**
 *
 * Compare strings as sequences of "non-carriage returns" and "carriage returns", looking for entire lines that match.
 *
 * @param `leftString` {String} - The first string, from whose perspective the "diff" results will be represented.
 * @param `rightString` {String} - The second string, to compare to the first string.
 * @return {Array} - An array of "segments" representing `rightString` as compared to `leftString`.
 *
 */
gpii.diff.compareStringsByLine = function (leftString, rightString) {
    if (typeof leftString !== "string" || typeof rightString !== "string") {
        return gpii.diff.singleValueDiff(leftString, rightString);
    }
    else if (leftString === rightString) {
        return [{ value: leftString, type: "unchanged"}];
    }
    else if (!leftString.match(/[\r\n]/) && !rightString.match(/[\r\n]/)) {
        return gpii.diff.compareStringsBySegment(leftString, rightString);
    }
    else {
        var leftLines = gpii.diff.stringToLineSegments(leftString);
        var rightLines = gpii.diff.stringToLineSegments(rightString);
        var longestLineSequence = gpii.diff.longestCommonSequence(leftLines, rightLines);

        var segments = [];
        if (longestLineSequence.length) {
            // calculate the real indexes in terms of the string lengths.
            var leftIndices = gpii.diff.calculateStringSegmentIndices(leftLines);
            var rightIndices = gpii.diff.calculateStringSegmentIndices(rightLines);

            var firstSegment = longestLineSequence[0];

            var leadingSegments = [];
            // compare and add the leading material
            if (firstSegment.leftIndex > 0 || firstSegment.rightIndex > 0) {
                var leftLeader = leftString.substring(0, leftIndices[firstSegment.leftIndex]);
                var rightLeader = rightString.substring(0, rightIndices[firstSegment.rightIndex]);
                leadingSegments = gpii.diff.compareStringsByLine(leftLeader, rightLeader);
            }

            // Add all parts of the longest common sequence, and any material between adjoining segments.
            var firstSegmentValue = leftLines[firstSegment.leftIndex];

            if (leadingSegments.length) {
                var lastLeadingSegmentValue = leadingSegments.pop();
                segments = segments.concat(leadingSegments);

                // "knit" together the last piece of leading material with the first segment if their types are the same.
                if (lastLeadingSegmentValue.type === firstSegmentValue.type) {
                    firstSegmentValue = { value: lastLeadingSegmentValue.value + firstSegmentValue.value, type: lastLeadingSegmentValue.type };
                }
                else {
                    segments.push(lastLeadingSegmentValue);
                }
            }

            var adjoiningSegments    = [firstSegmentValue];
            var previousLeftIndex    = firstSegment.leftIndex;
            var previousRightIndex   = firstSegment.rightIndex;
            fluid.each(longestLineSequence.slice(1), function (sequenceSegment) {
                var segmentValue = rightLines[sequenceSegment.rightIndex];
                // adjoining segment
                if ((sequenceSegment.leftIndex === previousLeftIndex + 1) && (sequenceSegment.rightIndex === previousRightIndex + 1)) {
                    adjoiningSegments.push(segmentValue);
                }
                // non-adjoining segment
                else {
                    // Join the previously collected adjoining matching segments together and add them as a single "unchanged" block.
                    segments.push({value: adjoiningSegments.join(""), type: "unchanged"});

                    // Compare material in "the gap" using the "string segment comparison" function.
                    var leftGapString = leftString.substring(leftIndices[previousLeftIndex] + segmentValue.length, leftIndices[sequenceSegment.leftIndex]);
                    var rightGapString = rightString.substring(rightIndices[previousRightIndex] + segmentValue.length, rightIndices[sequenceSegment.rightIndex]);
                    var gapSegments = gpii.diff.compareStringsBySegment(leftGapString, rightGapString);

                    // Knit the first part of the gap into the last existing adjoining segment
                    var lastPregapSegment = segments.pop();
                    var firstGapSegment   = gapSegments.shift();
                    if (lastPregapSegment.type === firstGapSegment.type) {
                        segments.push({ value: lastPregapSegment.value + firstGapSegment.value, type: lastPregapSegment.type });
                    }
                    else {
                        segments.push(lastPregapSegment);
                        segments.push(firstGapSegment);
                    }

                    segments = segments.concat(gapSegments);

                    // Reset the "adjoining segments" accumulator for the next batch.
                    adjoiningSegments = [segmentValue];
                }
                previousLeftIndex    = sequenceSegment.leftIndex;
                previousRightIndex   = sequenceSegment.rightIndex;
            });

            // Add any remaining adjoiningSegments we've accumulated, but do so as a considered "knit", so that we can merge with the trailing edge of a "gap sequence" if needed.
            if (adjoiningSegments.length) {
                var remainingAdjoiningSegmentValue = adjoiningSegments.join("");
                if (segments.length) {
                    var precedingSegment = segments.pop();
                    if (precedingSegment.type === "unchanged") {
                        segments.push({value: precedingSegment.value + remainingAdjoiningSegmentValue, type: "unchanged"});
                    }
                    else {
                        segments.push(precedingSegment);
                        segments.push({value: remainingAdjoiningSegmentValue, type: "unchanged"});
                    }
                }
                else {
                    segments.push({value: remainingAdjoiningSegmentValue, type: "unchanged"});
                }
            }

            // trailing material
            var trailingSegments = [];
            var lastSegment = longestLineSequence[longestLineSequence.length - 1];
            var lastLeftIndex = leftIndices[lastSegment.leftIndex] + leftLines[lastSegment.leftIndex].length;
            var lastRightIndex = rightIndices[lastSegment.rightIndex] + rightLines[lastSegment.rightIndex].length;
            if (lastLeftIndex < leftString.length || lastRightIndex < rightString.length) {
                var leftTrailingString  = leftString.substring(lastLeftIndex);
                var rightTrailingString = rightString.substring(lastRightIndex);
                trailingSegments = gpii.diff.compareStringsBySegment(leftTrailingString, rightTrailingString);
            }

            // "knit" together the last piece of leading material with the first segment if their types are the same.
            if (trailingSegments.length) {
                var lastMiddleSegment = segments.pop();
                var firstTrailingSegmentValue = trailingSegments.shift();
                if (firstTrailingSegmentValue.type === lastMiddleSegment.type) {
                    segments.push({ value: lastMiddleSegment.value + firstTrailingSegmentValue.value, type: lastMiddleSegment.type});
                }
                else {
                    segments.push(lastMiddleSegment);
                    segments.push(firstTrailingSegmentValue);
                }
                segments = segments.concat(trailingSegments);
            }
            return segments;
        }
        else {
            return gpii.diff.compareStringsBySegment(leftString, rightString);
        }
    }
};

/**
 *
 * Split a string into "line segments" so that we can compare longer strings "by line".
 *
 * @param originalString {String} - A string to break down into line segments.
 * @returns {Array} - An array of substrings.
 */
gpii.diff.stringToLineSegments = function (originalString) {
    var segments = [];

    if (typeof originalString === "string") {
        var matches = originalString.match(/(([^\r\n]+[\r\n]+)|([\r\n]+)|([^\r\n]+))/mg);
        if (matches) {
            segments = segments.concat(matches);
        }
    }
    else if (originalString !== undefined && originalString !== null) {
        fluid.fail("gpii.diff.stringToLine can only be used with string, undefined, or null values.");
    }

    return segments;
};

/**
 *
 * Go through the output of `gpii.diff.stringToLineSegments` and figure out what index in the original string each
 * segment corresponds to.
 *
 * @param arrayOfStrings {Array} - An array of string segments, as produced by `gpii.diff.stringToLineSegments`.
 * @returns {Array} - An array of integers representing the position of each segment in the original string.
 *
 */
gpii.diff.calculateStringSegmentIndices = function (arrayOfStrings) {
    var indexValues = [];
    var currentIndex = 0;
    fluid.each(arrayOfStrings, function (string) {
        indexValues.push(currentIndex);
        currentIndex += string.length;
    });
    return indexValues;
};

/**
 *
 * Compare any two elements for equality, including Arrays and Objects.
 *
 * @param leftElement {Any} - An {Object}, {Array}, {String}, or any other type of element.
 * @param rightElement {Any} - A second element of any type to compare to `leftElement`.
 * @returns {Boolean} - `true` if the elements are equal, `false` if they are not.
 *
 */
gpii.diff.equals = function (leftElement, rightElement) {
    if (typeof leftElement !== typeof rightElement) {
        return false;
    }
    // Need to run these checks before the "object" branch because `typeof []` is also `object`.
    else if (Array.isArray(leftElement) && Array.isArray(rightElement)) {
        return gpii.diff.arraysEqual(leftElement, rightElement);
    }
    else if (Array.isArray(leftElement) || Array.isArray(rightElement)) {
        return false;
    }
    // Now that undefined and Array values have been dealt with, anything remaining of type "object" can be handled as such.
    else if (typeof leftElement === "object") {
        return gpii.diff.objectsEqual(leftElement, rightElement);
    }
    else {
        return leftElement === rightElement;
    }
};

/**
 *
 * A function to compare two arrays and report their differences.
 *
 * @param leftArray - An array of values.
 * @param rightArray - An array of values to compare.
 * @return {Array} - An array of segments representing the changes in order.  May be larger than the original array.
 *
 */
gpii.diff.compareArrays = function (leftArray, rightArray) {
    if (!Array.isArray(leftArray) || !Array.isArray(rightArray)) {
        return gpii.diff.singleValueDiff(leftArray, rightArray);
    }
    else {
        var segments = [];

        if (gpii.diff.arraysEqual(leftArray, rightArray)) {
            segments.push({arrayValue: leftArray, type: "unchanged"});
        }
        else {
            // Find the longest match, process it, then process any trailing and leading material.
            var longestCommonSequence = gpii.diff.longestCommonSequence(leftArray, rightArray);
            if (longestCommonSequence.length) {
                var firstSegment = longestCommonSequence[0];
                // Compare the "leaders"
                var leftLeader = leftArray.slice(0, firstSegment.leftIndex);
                var rightLeader = rightArray.slice(0, firstSegment.rightIndex);
                if (leftLeader.length || rightLeader.length) {
                    var leadingSegments = gpii.diff.compareArrays(leftLeader, rightLeader);
                    segments = segments.concat(leadingSegments);
                }

                // Add all parts of the longest common sequence, and any material between adjoining segments.
                var adjoiningSegments = [leftArray[longestCommonSequence[0].leftIndex]];
                var previousLeftIndex = longestCommonSequence[0].leftIndex;
                var previousRightIndex = longestCommonSequence[0].rightIndex;
                fluid.each(longestCommonSequence.slice(1), function (sequenceSegment) {
                    var segmentValue = leftArray[sequenceSegment.leftIndex];
                    // adjoining segment
                    if ((sequenceSegment.leftIndex === previousLeftIndex + 1) && (sequenceSegment.rightIndex === previousRightIndex + 1)) {
                        adjoiningSegments.push(segmentValue);
                    }
                    // non-adjoining segment
                    else {
                        segments.push({arrayValue: adjoiningSegments, type: "unchanged"});
                        adjoiningSegments = [segmentValue];

                        // Iterate through the "removed" left elements.
                        var deletedSegments = leftArray.slice(previousLeftIndex + 1, sequenceSegment.leftIndex);
                        if (deletedSegments.length) {
                            segments.push({arrayValue: deletedSegments, type: "removed"});
                        }

                        // Iterate through the "added" right elements.
                        var addedSegments = rightArray.slice(previousRightIndex + 1, sequenceSegment.rightIndex);
                        if (addedSegments.length) {
                            segments.push({arrayValue: addedSegments, type: "added"});
                        }
                    }
                    previousLeftIndex = sequenceSegment.leftIndex;
                    previousRightIndex = sequenceSegment.rightIndex;
                });
                segments.push({arrayValue: adjoiningSegments, type: "unchanged"});

                // Compare the "trailers"
                var lastSegment = longestCommonSequence[longestCommonSequence.length - 1];
                var leftTrailer = leftArray.slice(lastSegment.leftIndex + 1);
                var rightTrailer = rightArray.slice(lastSegment.rightIndex + 1);
                if (leftTrailer.length || rightTrailer.length) {
                    var trailingSegments = gpii.diff.compareArrays(leftTrailer, rightTrailer);
                    segments = segments.concat(trailingSegments);
                }
            }
            else {
                return gpii.diff.singleValueDiff(leftArray, rightArray, true);
            }
        }

        return segments;
    }
};

/**
 *
 * Compare two arrays to see if their values are equal.
 *
 * @param leftArray {Array} - An array of values.
 * @param rightArray {Array} - An array of values to compare to `leftArray`.
 * @return {Boolean} - Returns `true` if all elements in both arrays are equal, `false` otherwise.
 *
 */
gpii.diff.arraysEqual = function (leftArray, rightArray) {
    if (typeof leftArray !== typeof rightArray) {
        return false;
    }
    else if (!Array.isArray(leftArray)) {
        fluid.fail("Cannot compare non-arrays using `gpii.diff.arraysEqual`...");
    }
    else if (leftArray.length !== rightArray.length) {
        return false;
    }
    else {
        var everythingMatches = rightArray.every(function (rightValue, index) {
            var leftValue = leftArray[index];
            if (typeof leftValue !== typeof rightValue) {
                return false;
            }
            else if (Array.isArray(leftValue)) {
                return gpii.diff.arraysEqual(leftValue, rightValue);
            }
            // We need to check this separately to distinguish null values from actual objects.
            else if (leftValue === null && rightValue === null) {
                return true;
            }
            else if (typeof leftValue === "object") {
                return gpii.diff.objectsEqual(leftValue, rightValue);
            }
            else {
                return rightValue === leftValue;
            }
        });
        return everythingMatches;
    }
};

/**
 *
 * Deeply compare two objects to see if their values are equal.
 *
 * @param leftObject {Object} - An object.
 * @param rightObject {Object} - An object to compare to `leftObject`.
 * @return {Boolean} - Returns `true` if the objects are deeply equal, `false` otherwise.
 *
 */
gpii.diff.objectsEqual = function (leftObject, rightObject) {
    if (typeof leftObject !== typeof rightObject) {
        return false;
    }
    else {
        var leftKeys = Object.keys(leftObject);
        if (leftKeys.length !== Object.keys(rightObject).length) {
            return false;
        }
        else {
            for (var a = 0; a < leftKeys.length; a++) {
                var key = leftKeys[a];
                var leftValue = leftObject[key];
                var rightValue = rightObject[key];
                if (typeof leftValue !== typeof rightValue) {
                    return false;
                }
                else if (Array.isArray(leftValue)) {
                    if (!gpii.diff.arraysEqual(leftValue, rightValue)) {
                        return false;
                    }
                }
                else if (typeof leftValue === "object") {
                    if (!gpii.diff.objectsEqual(leftValue, rightValue)) {
                        return false;
                    }
                }
                else if (leftValue !== rightValue) {
                    return false;
                }
            }

            return true;
        }
    }
};

/**
 *
 * Compare two objects and product a report about their differences.
 *
 * @param leftObject {Object} - An object.
 * @param rightObject {Object} - An object to compare with `leftObject`.
 * @param compareStringsAsMarkdown {Boolean} - Whether to compare strings as markdown.
 * @param markdownitOptions {Object} - Configuration options to pass to markdownit when dealing with markdown.  See their documentation for details.
 * @return results - An object that describes the differences (and similarities) between the two objects.
 *
 */
gpii.diff.compareObjects = function (leftObject, rightObject, compareStringsAsMarkdown, markdownitOptions) {
    var results = {};
    var leftKeys = leftObject !== undefined ? Object.keys(leftObject) : [];
    var rightKeys = rightObject !== undefined ? Object.keys(rightObject) : [];
    var combinedKeys = leftKeys.concat(rightKeys.filter(function (rightKey) {
        return leftKeys.indexOf(rightKey) === -1;
    }));
    if (combinedKeys.length) {
        for (var a = 0; a < combinedKeys.length; a++) {
            var key = combinedKeys[a];
            var leftValue = leftObject !== undefined ? leftObject[key] : undefined;
            var rightValue = rightObject !== undefined ? rightObject[key] : undefined;
            results[key] = gpii.diff.compare(leftValue, rightValue, compareStringsAsMarkdown, markdownitOptions);
        }
    }
    // Both leftObject and rightObject are `undefined`.
    else if ((leftObject === undefined && rightObject === undefined)) {
        results = gpii.diff.singleValueDiff(leftObject, rightObject);
    }
    // Both values are an empty object.
    else if (gpii.diff.objectsEqual(leftObject, rightObject)) {
        results[""] = [{value: leftObject, type: "unchanged"}];
    }
    else {
        results[""] = [{value: leftObject, type: "removed"}, {value: rightObject, type: "added"}];
    }
    return results;
};

/**
 *
 * Compare a single element, using the correct comparison depending on the variable type.
 *
 * @param leftElement {Any} - An element (array, object, number, etc.).
 * @param rightElement {Any} - An element to compare to `leftElement`.
 * @param compareStringsAsMarkdown {Boolean} - Whether to compare strings as markdown.
 * @param markdownitOptions {Object} - Configuration options to pass to markdownit when dealing with markdown.  See their documentation for details.
 * @return {Object} - An object that describes the differences between the two elements.
 *
 */
gpii.diff.compare = function (leftElement, rightElement, compareStringsAsMarkdown, markdownitOptions) {
    var firstDefinedElement = leftElement !== undefined ? leftElement : rightElement;
    // Both are undefined
    if (firstDefinedElement === undefined) {
        return gpii.diff.singleValueDiff(leftElement, rightElement);
    }
    else if (Array.isArray(firstDefinedElement)) {
        return gpii.diff.compareArrays(leftElement, rightElement);
    }
    else if (typeof firstDefinedElement === "string") {
        return compareStringsAsMarkdown ? gpii.diff.compareMarkdown(leftElement, rightElement, markdownitOptions) : gpii.diff.compareStrings(leftElement, rightElement);
    }
    else if (typeof firstDefinedElement === "object") {
        return gpii.diff.compareObjects(leftElement, rightElement, compareStringsAsMarkdown, markdownitOptions);
    }
    else {
        return gpii.diff.singleValueDiff(leftElement, rightElement);
    }
};

// A "stub" function to fail with a meaningful error if markdown support is called when it has not be properly loaded.
gpii.diff.compareMarkdown = function () {
    fluid.fail("You must install the optional required dependencies and call `gpii.diff.loadMarkdownSupport()` to use this function");
};
