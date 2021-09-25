import httpGet from "./http-get.impl";
import convertXmlToIntermediateJson from "./convert-xml-to-intermediate-json.impl";
import convertIntermediateJsonToJSXml from "./convert-intermediate-json-to-js-xml.impl";
import writeToFile, { writeJsonToFile } from "./write-to-file";

/** @private */
// FIXME: there's a typo here: "currrency"
const ISO4217_XML_URL =
	"https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/amendments/lists/list_one.xml";

async function buildISO4217Json() {
	const xml = await httpGet(ISO4217_XML_URL);

	writeToFile("iso4217.xml", xml);

	const intermediateJson = convertXmlToIntermediateJson(xml);

	writeJsonToFile("iso4217.intermediate.json", intermediateJson);

	const jsXml = convertIntermediateJsonToJSXml(intermediateJson, "ISO_4217");

	await writeJsonToFile("iso4217.json", jsXml);
}

buildISO4217Json();
