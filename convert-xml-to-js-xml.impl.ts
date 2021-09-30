import convertXmlToIntermediateJson, { Intermediate } from "./convert-xml-to-intermediate-json.impl";
import convertIntermediateJsonToJSXml from "./convert-intermediate-json-to-js-xml.impl";
import type JSXml from "./js-xml.type";

/** @private */
interface ConvertXmlToJSXmlResult {
	result: JSXml;
	intermediate: Intermediate;
}

export default function convertXmlToJSXml(xml: string, key?: string): ConvertXmlToJSXmlResult {
	const intermediate = convertXmlToIntermediateJson(xml);
	const result = convertIntermediateJsonToJSXml(intermediate, key);

	return { result, intermediate };
}
