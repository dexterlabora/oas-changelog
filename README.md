# An attempt at a swagger changelog generator for the Meraki API.

Generates a `changelog.md` and `changelog.json` file based on differences of two swagger / OAS v2 docs. 


**Run**
```
node index
```

**View**
Generated files are in the `output` directory


## Dev Notes

based on `swagger-diff` and `swagger-changelog`
most modifications are with the `message` parameter formatting. 