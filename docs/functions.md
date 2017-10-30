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


### `gpii.diff.compareStrings(leftString, rightObject)`
* `leftString`: A string.
* `rightArray`: A string to compare to `leftString`.
* Returns: `{Array}` - An array of "segments" representing `rightString` as compared to `leftString` (see below).

This function compares two strings and creates a set of segments detailing what has changed (or remained the same)
between the two.  For example:

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

### `gpii.diff.singleValueDiff(leftValue, rightValue)`
* `leftValue`: The left-hand value.
* `rightValue`: The right-hand value.
* Returns: `{Object}` - An array of change segments (see below).

This function returns a representation of a "single value" change, with no deeper comparison.  This function always
produces a two-segment change in which the left value is deleted and the right value is added, for example:

```javascript
gpii.diff.singleValueDiff(0, 1); // [{ value: 0, type: "removed"}, {value: 1, type: "added"}]
```

You are almost always better off using `gpii.diff.compare` or another more specific function, which will call this
function as needed.

## Supporting Functions

### `gpii.diff.arraysEqual(leftObject, rightObject)`
* `leftObject`: An array of values.
* `rightObject`: An array of values to compare to `leftArray`.
* Returns: `{Boolean}` - `true` if all elements in both arrays are equal, `false` otherwise.

Compare two arrays to see if all of their values are equal.

### `gpii.diff.objectsEqual(leftObject, rightObject)`
* `leftObject`: An object.
* `rightObject`: An object to compare to `leftObject`.
* Returns: `{Boolean}` - `true` if the objects are deeply equal, `false` otherwise.

Deeply compare two objects to see if all of their values are equal.


### `gpii.diff.longestCommonArraySegment(leftArray, rightArray)`
* `leftArray`: An array of values.
* `rightArray`: An array of values to compare to `leftArray`.
* Returns: `{Object}` - See below.

A function that returns the (first) longest matching segment found in two arrays.  We use this to tree out from the
best match within an array, so that we can produce a change report with the least changes possible.

The object returned has three keys:

* `leftIndex`:  The position of the matching segment in `leftArray`.  If there is no matching segment, this will be `-1`.
*  `rightIndex`: The position of the matching segment in `rightArray`.  If there is no matching segment, this will be `-1`.
*  `segment`:    The longest set of matching elements (in order) common to both arrays.  If there are multiple sets of the same length, the first is returned.

For example, `gpii.diff.longestCommonArraySegment([0,1],[1,2])` would return:

```json
{
    "segment": [1],
    "leftIndex": 1,
    "rightIndex": 0
}
```

### `gpii.diff.longestCommonStringSegment(leftString, rightString)`
* `leftArray`: A string.
* `rightString`: Another string, which will be compared to `leftString` looking for the (first) longest matching segment.
* Returns: `{Object}` - See below.


Find the longest matching segment in two strings.  If there are two of the same length, the first will be returned.

The object returned has three keys:

* `leftIndex`:  The position of the matching segment in `leftArray`.  If there is no matching segment, this will be `-1`.
* `rightIndex`: The position of the matching segment in `rightArray`.  If there is no matching segment, this will be `-1`.
* `segment`:    The longest matching substring common to both strings.  If there are multiple matching segments of the same length, the first is returned.

For example, `gpii.diff.longestCommonStringSegment("any old iron","this old house")` would return:

```json
{
    "segment": " old ",
    "leftIndex": 4,
    "rightIndex": 5
}
```

Note that the matching is case sensitive, and that whitespace is included in the resulting match.