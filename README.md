# `@iso4217/json`

The original [ISO 4217 XML file][1] converted to JSON.

## Features of `@iso4217/json`
1. All the data from the original XML file is **already converted to JSON ahead of time**, – importing this package is actually **like importing a plain JSON file**.
1. All the data is **guaranteed to be up-to-date** at all times:
    - the data in the original XML file [is maintained by the Swiss Association for Standardization][2] (SNV);
    - the data in the resulting JSON file [is automatically updated by CI/CD script][3] on a daily basis;
1. Thanks to the custom-designed format, no data is lost from the original XML during conversion, – all the information is preserved in the JSON file.
1. The codebase is strongly typed, thanks to using the latest version of TypeScript.
1. The project [is open source][4], and all the contributions [are very welcome][5]!

## Importing data

### TypeScript (NodeJS):

```ts
// import-based approach
import { json } from "@iso4217/json";
```

```ts
// parsing approach
import { getJson } from "@iso4217/json";

const json = await getJson();
```

### JavaScript (CommonJS):

```ts
// require-based approach
const { json } = require("@iso4217/json");
```

```ts
// parsing approach
const { getJson } = require("@iso4217/json");

const json = await getJson();
```

### JavaScript (ESModules):

```
To be done
```

### JavaScript (browser, using `<script>` tag):

```
To be done
```

## Versioning strategy

_TL;DR: Major version repeats XML's `Pblshd` attribute._

Since `@iso4217/json` is an npm package, it follows SemVer versioning strategy, – more precisely, its stricter modification.

Because the information about currencies is a part of public API of the package, whenever the XML is changed by [maintainers][2], the subsequent changes in JSON must be considered a breaking change of this package, i.e., a major package version bump. Thus, the "major" part of a version is basically a copy of the version of the original XML file, stripped of non-numeric characters (e.g., `2018-08-29` becomes `20180829`). This means that the breaking changes are reserved to updates in XML data.

Since the package may also contain other API, and only minor and patch updates are left to use, this additional API (if any) will be updated in a non-breaking manner: bugs will get fixed (with a patch bump), features – either introduced (with a minor bump) or deprecated (with minor or patch update, depending on a feature).

  [1]: https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/amendments/lists/list_one.xml
  [2]: https://www.six-group.com/en/products-services/financial-information/data-standards.html#maintenance-agency
  [3]: https://github.com/parzh/iso4217/blob/28cc291e156b2f648766d7b4fd914d273e985e49/.github/workflows/publish-xml-updates.yml
  [4]: https://github.com/parzh/iso4217
  [5]: https://github.com/parzh/iso4217/issues
