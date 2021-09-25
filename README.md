# `@iso4217/json`

The original [ISO 4217 XML file][1] converted to JSON.

## Features of `@iso4217/json`
1. All the data from the original XML file, but already converted to JSON ahead of time, – **importing this package is actually the same as importing a plain JSON file**.
1. All the data is guaranteed to be up-to-date at all times:
    - the data in the original XML file [is maintained by the Swiss Association for Standardization][2] (SNV);
    - the data in the resulting JSON file [is automatically updated by CI/CD script][3] on a daily basis;
1. Thanks to the custom-defined format, no data is lost from the original XML during conversion, – all the information is preserved in the JSON file.
1. The codebase is strongly typed, thanks to using the latest version of TypeScript.
1. The project [is open source][4], and all the contributions [are very welcome][5]!

  [1]: https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/amendments/lists/list_one.xml
  [2]: https://www.six-group.com/en/products-services/financial-information/data-standards.html#maintenance-agency
  [3]: TODO:
  [4]: https://github.com/parzh/iso4217
  [5]: https://github.com/parzh/iso4217/issues

## Importing data:

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

## Other API:

_Note: all examples here are using TypeScript syntax._

### `getVersion(): string`

Get version of the standard that is used in this package. Version is an ISO date.

```ts
import { getVersion } from "@iso4217/json";

getVersion();
// => "2018-08-29"
```
