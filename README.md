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
import { json } from "@iso4217/json";
```

### JavaScript (CommonJS):

```ts
const { json } = require("@iso4217/json");
```

### JavaScript (ESModules):

```
To be done
```

### JavaScript (browser, using `<script>` tag):

```
To be done
```

## File-parsing approach of importing the file

In case importing the JSON data using `import` or `require` systems is for some reason not sufficient, the raw file is located at `node_modules/@iso4217/json/data.json`. One can use Node.JS's `fs` module to parse the file into a plain JS object:

```ts
// TypeScript
import fs from "fs";
import type { JSXml } from "@iso4217/json";

async function getData(): JSXml<JSXml[]> {
  const pathToRawJson = require.resolve("@iso4217/json/data.json");
  const rawData = await fs.promises.readFile(pathToRawJson, "utf8");
  const data = JSON.parse(rawData);

  return data;
}
```

## Grouping entries

To group entries by a criterion (see available criteria below), a corresponding environment variable must be set in the process that installs the package (i.e., the process that does `npm i @iso4217/json`, or `npm i`, or `npm ci`). Most values of a environment variable will result in the corresponding file being forcefully rebuild, but special keywords can provide a way to tweak this behavior (see available behaviors below).

### Available groupings

- by country name (by `<CtryNm>` tag):
  - env: `ISO4217_JSON_BUILD_DATA_GROUPED_BY_COUNTRY_NAME`
  - builds file `data-grouped-by-country-name.json`
- by currency name (by `<CcyNm>` tag):
  - env: `ISO4217_JSON_BUILD_DATA_GROUPED_BY_CURRENCY_NAME`
  - builds file `data-grouped-by-currency-name.json`
- by currency code (by `<Ccy>` tag):
  - env: `ISO4217_JSON_BUILD_DATA_GROUPED_BY_CURRENCY_CODE`
  - builds file `data-grouped-by-currency-code.json`
- by currency number (by `<CcyNbr>` tag):
  - env: `ISO4217_JSON_BUILD_DATA_GROUPED_BY_CURRENCY_NUMBER`
  - builds file `data-grouped-by-currency-number.json`
- by currency minor units (by `<CcyMnrUnts>` tag):
  - env: `ISO4217_JSON_BUILD_DATA_GROUPED_BY_CURRENCY_MINOR_UNITS`
  - builds file `data-grouped-by-currency-minor-units.json`

### Available behaviors

- _never build the file_

  Invoked by `"0"`, `"false"`, and `"never"`; default behavior (i.e., when variable is unset or empty)

- _build the file only if it doesn't exist already; otherwise skip_

  Invoked by `"2"`, `"soft"`, `"if-not-exists"`, and `"unless-exists"`;

- _build the file only if it exists already; otherwise skip_

  Invoked by `"3"`, and `"if-exists"`;

- _always build the file, regardless of whether it already exists or not_

  Invoked by `"1"`, `"true"`, `"always"`, and any non-empty string (except for the ones listed here).

### Example

This command:

```sh
# (using bash syntax)

export ISO4217_JSON_BUILD_DATA_GROUPED_BY_CURRENCY_NAME=2 # the file exists
export ISO4217_JSON_BUILD_DATA_GROUPED_BY_CURRENCY_CODE=1
export ISO4217_JSON_BUILD_DATA_GROUPED_BY_CURRENCY_NUMBER=1
npm install
```

&hellip; logs this output (order is not guaranteed):

```sh
# @iso4217/json: Skipping file "@iso4217/json/data-grouped-by-currency-name.json" (strategy "if-not-exists")
# @iso4217/json: Building file "@iso4217/json/data-grouped-by-currency-code.json" ...
# @iso4217/json: Building file "@iso4217/json/data-grouped-by-currency-number.json" ...
# @iso4217/json: File "@iso4217/json/data-grouped-by-currency-number.json" is built successfully
# @iso4217/json: File "@iso4217/json/data-grouped-by-currency-code.json" is built successfully
```

Note, that some groupings don't include particular currencies, – for the most part, exotic ones. For example, Antarctica does not have any universal currency, and the XML file doesn't have `<Ccy>` tag for it. Therefore, Antarctica won't appear anywhere in the "grouped by currency code" file. However, it will appear in "grouped by country name" file, since "ANTARCTICA" is considered a country name by [maintainers][2] of the XML file.

Also note, that to manually build the files after the package is already installed (in case you forgot to set up environment variables, for example), after properly setting the environment, you should then either run `npm i` / `npm ci`, or run `node_modules/@iso4217/json/build-grouped-by-data-files.js` file with Node.JS executable (`node`); usually it looks like this:

```sh
# (using bash syntax)

export ... # setting environment variables
node node_modules/@iso4217/json/build-grouped-by-data-files.js
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
