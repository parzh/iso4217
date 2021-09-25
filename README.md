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
  [4]: https://github.com/parzh/iso-4217
  [5]: https://github.com/parzh/iso-4217/issues

## Usage:

#### TypeScript:

```ts
import { json } from "@iso4217/json";
import json from "@iso4217/json/data";
```

#### JavaScript (CommonJS):

```ts
const { json } = require("@iso4217/json");
const json = require("@iso4217/json/data.json");
```

#### JavaScript (ESModules):

<pre>To be done</pre>

#### JavaScript (browser, using `<script>` tag):

<pre>To be done</pre>
