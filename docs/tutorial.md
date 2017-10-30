


Let's say we have a record like the following:

```json
{
    "title": "This is the old title.",
    "description": "This is the old description.",
    "author": {
        "name": "This is the old author."
    }
}
```

We want to explore the differences between this record and a new version of the same record:

```json
{
    "title": "This is the new title.",
    "description": "This is the new description.",
    "author": {
        "name": "This is the new author."
    }
}
```

The output of [our "diff" function] would look like:

```json
{
    "title": [{ "value": "This is the ", "type": "unchanged"}, { "value": "old", "type": "deleted"}, { "value": "new", "type": "added"}, { "value": "title.", "type": "unchanged"}]
}
```

# JSON "diff"


<!-- TODO: write the function and then expand this -->

## Example 1:  A Deep Structure with Strings

Let's say we have a record like the following:

```json
{
    "title": "This is the old title.",
    "description": "This is the old description.",
    "author": {
        "name": "This is the old author."
    }
}
```

We want to explore the differences between this record and a new version of the same record:

```json
{
    "title": "This is the new title.",
    "description": "This is the new description.",
    "author": {
        "name": "This is the new author."
    }
}
```

The output of [our "diff" function] would look like:

```json
{
    "title": [{ "value": "This is the ", "type": "unchanged"}, { "value": "old", "type": "deleted"}, { "value": "new", "type": "added"}, { "value": "title.", "type": "unchanged"}]
}
```

## Example 2: Array Comparisons