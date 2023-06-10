// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports[`convertXmlToJSXml > should convert XML to the custom data format (JSXml) > intermediate 1`] = `
{
  "foo": {
    "bar": {
      "$t": "baz",
    },
  },
}
`;

exports[`convertXmlToJSXml > should convert XML to the custom data format (JSXml) > result 1`] = `
{
  "$attr": {},
  "$data": [
    {
      "$attr": {},
      "$data": "baz",
      "$name": "bar",
    },
  ],
  "$name": "foo",
}
`;
