import convertXmlToJSXml from "./convert-xml-to-js-xml.impl";

describe(convertXmlToJSXml.name, () => {
	it('should convert XML to the custom data format (JSXml)', () => {
		const xml = `<foo><bar>baz</bar></foo>`;
		const jsXml = convertXmlToJSXml(xml, 'foo')

		expect(jsXml.intermediate).toMatchSnapshot('intermediate')
		expect(jsXml.result).toMatchSnapshot('result')
	})
})
