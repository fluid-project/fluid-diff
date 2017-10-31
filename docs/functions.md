# Static Functions Provided by This Package

All of the functions provided by this package are static, and do not require you to instantiate a component.

## The "diff" Functions

### `gpii.diff.compare(leftElement, rightElement)`

* `leftElement`: An element (array, object, number, etc.).
* `rightElement`: An element to compare to `leftElement`.
* Returns: `{Object}` - An object that describes the differences between the two elements.

This function compares two elements of any type and returns the most fine-grained comparison possible.  It automatically
calls functions below depending on the variable type and value, and its output exactly matches each of the examples
below for the same inputs.

### `gpii.diff.compareArrays(leftArray, rightObject)`

* `leftArray`: An array of values.
* `rightArray`: An array of values to compare to `leftArray`.
* Returns: `{Array}` - An array of segments representing the changes in order.  May be larger than the original array (see below).

This function compares arrays in a way which is intended to assist in presenting changes to a list of values, in order.
For example:

```javascript
gpii.diff.compareArrays([0,1,2],[2,1,0]);

/* Returns:
[
    { value: 0, type: "removed"},
    { value: 2, type: "added"},
    { value: 1, type: "unchanged"},
    { value: 2, type: "removed"},
    { value: 0, type: "added"}
]
*/
```

### `gpii.diff.compareObjects(leftObject, rightObject)`

* `leftObject`: An object.
* `rightObject`: An object to compare to `leftObject`.
* Returns: `{Object}` - An object that describes the differences (and similarities) between the two objects (see below).

This function compares two objects (including `undefined`) to one another and produces a report regarding their
similarities and differences.  Note that this function does not attempt to represent the addition and deletion of
intermediate tree segments, and errs on the side of describing changes in a place where a "simple" value (string,
number, boolean, etc.) might expect to be found.  For example:

```javascript
gpii.diff.compareObjects({}, { foo: { bar: { baz: true }}});

/* Returns:
{
    foo: {
        bar: {
            baz: [{ value: true, type: "added"}]
        }
    }
}
*/
```

### `gpii.diff.compareStrings(leftString, rightObject)`

* `leftString`: A string.
* `rightArray`: A string to compare to `leftString`.
* Returns: `{Array}` - An array of "segments" representing `rightString` as compared to `leftString` (see below).

This function compares two strings and creates a set of segments detailing what has changed (or remained the same)
between the two.  This function uses `gpii.diff.longestCommonStringPhrase` (see below) to split longer strings up into:

* Material before the longest common "phrase".
* The longest common "phrase".
* Material after the longest common "phrase".

The leading and trailing material from `leftString` and `rightString` is compared, and the process continues to recurse
until there are no common phrases.  Here is an example of the output:

```javascript
gpii.diff.compareStrings("this definitely works", "this also works");
/* Returns:
[
    { value: "this ", type: "unchanged"},
    { value: "definitely", type: "removed"},
    { value: "also", type: "added"},
    { value: " works", type: "unchanged"}
]
*/
```

### `gpii.diff.singleValueDiff(leftValue, rightValue)`

* `leftValue`: The left-hand value.
* `rightValue`: The right-hand value.
* Returns: `{Object}` - An array of change segments (see below).

This function returns a representation of a "single value" change, with no deeper comparison.  This function always
produces a two-segment change in which the left value is removed and the right value is added, for example:

```javascript
gpii.diff.singleValueDiff(0, 1); // [{ value: 0, type: "removed"}, {value: 1, type: "added"}]
```

You are almost always better off using `gpii.diff.compare` or another more specific function, which will call this
function as needed.

## Supporting Functions

These functions are used by the comparison functions above, but are not guaranteed to be preserved as long term
features of this package

### `gpii.diff.arraysEqual(leftObject, rightObject)`

* `leftObject`: An array of values.
* `rightObject`: An array of values to compare to `leftArray`.
* Returns: `{Boolean}` - `true` if all elements in both arrays are equal, `false` otherwise.

Compare two arrays to see if all of their values are equal.

### `gpii.diff.extractPhraseSegments(originalString)`

* `originalString`: A string to break down.
* Returns: `{Array}` - An array of "phrase segments", in order from longest (and first) to shortest (and last).  See below.

Break down a string into an array of "phrase segments", ordered from longest (the original string, including all
whitespace) to shortest (the shortest individual word, with no whitespace).  This is used by `gpii.diff.compareStrings`
(see above) to compare two strings starting with the longest contiguous match.

Each "phrase segment" looks like:

```json5
{
    "value": "a word or phrase, possibly including whitespace ",
    "index": 0 // The position of the phrase in `originalString`
}

```

To give a more complete example, the phrase "Hello, world." would be broken down into the following output:

```json
[
    { "value": "Hello, world.", "index": 0 },
    { "value": "Hello, world", "index": 0 },
    { "value": ", world.", "index": 5 },
    { "value": "Hello, ", "index": 0 },
    { "value": ", world", "index": 5 },
    { "value": "world.", "index": 7 },
    { "value": "Hello", "index": 0 },
    { "value": "world", "index": 7 }
]
```

### `gpii.diff.longestCommonArraySegment(leftArray, rightArray)`

* `leftArray`: An array of values.
* `rightArray`: An array of values to compare to `leftArray`.
* Returns: `{Object}` - See below.

A function that returns the (first) longest matching segment found in two arrays.  We use this to tree out from the
best match within an array, so that we can produce a change report with the least changes possible.

The object returned has three keys:

* `leftIndex`:  The position of the matching segment in `leftArray`.  If there is no matching segment, this will be `-1`.
* `rightIndex`: The position of the matching segment in `rightArray`.  If there is no matching segment, this will be `-1`.
* `segment`:    The longest set of matching elements (in order) common to both arrays.  If there are multiple sets of the same length, the first is returned.

For example, `gpii.diff.longestCommonArraySegment([0,1],[1,2])` would return:

```json
{
    "segment": [1],
    "leftIndex": 1,
    "rightIndex": 0
}
```

### `gpii.diff.longestCommonStringPhrase(leftString, rightString)`

* `leftString` The "left" `{String}` in the comparison.
* @param `rightString` `{String}` - The "right" string in the comparison.
* Returns: `{Object}` - An object that describes the longest common phrase (including whitespace) and its position in both `leftString` and `rightString`.  See below.

This function searches for the longest matching "phrase" in two strings.  The object returned has three keys:

* `leftIndex`:  The position of the matching segment in `leftString`.  If there is no matching segment, this will be `-1`.
* `rightIndex`: The position of the matching segment in `rightString`.  If there is no matching segment, this will be `-1`.
* `segment`:    The longest matching string common to both strings.  If there are multiple matching strings of the same length, the first is returned.

A "phrase" consists of at least one block of non-whitespace interleaved with blocks of whitespace. So, for example,
there is no common phrase found in the following comparison:

```javascript
gpii.diff.longestCommonStringPhrase("Yup.", "Nope.");
/*

    Returns:

    {
        "leftIndex": -1,
        "rightIndex": -1,
        "segment": ""
    }

 */
```

Note that both index values are set to `-1`, indicating that there was no match.  The next example demonstrates the
output when there is a leading match:

```javascript
gpii.diff.longestCommonStringPhrase("My hot dog had onions, chili, and ketchup on it.", "My hot dog had onions, mustard, and ketchup on it.");
/*
    Returns:

    {
      "segment": "My hot dog had onions, ",
      "leftIndex": 0,
      "rightIndex": 0
    }

*/
```

Note that the trailing whitespace is included in the match.  Note also that both index values are set to value, as the
match occurs at the beginning of both strings.  The next example demonstrates non-zero index values:

```javascript
JSON.stringify(gpii.diff.longestCommonStringPhrase("My hot dog had ketchup on it.", "Your hot dog had mustard on it."), null, 2);
/*

    Returns;

    {
      "segment": " hot dog had ",
      "leftIndex": 2,
      "rightIndex": 4
    }

*/
```

This function is used by `gpii.diff.compareStrings`, see above for details.

### `gpii.diff.objectsEqual(leftObject, rightObject)`

* `leftObject`: An object.
* `rightObject`: An object to compare to `leftObject`.
* Returns: `{Boolean}` - `true` if the objects are deeply equal, `false` otherwise.

Deeply compare two objects to see if all of their values are equal.
