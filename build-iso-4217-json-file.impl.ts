import httpGet from "./http-get.impl";
import convertXmlToIntermediateJson from "./convert-xml-to-intermediate-json.impl";
import convertIntermediateJsonToISO4217Json from "./convert-intermediate-json-to-iso-4217-json.impl";
import writeToFile, { writeJsonToFile } from "./write-to-file";

/** @private */
const ISO_4217_XML_URL =
	"https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/amendments/lists/list_one.xml";

async function test() {
	const iso4217Xml = await httpGet(ISO_4217_XML_URL);

	writeToFile("source.xml", iso4217Xml);

	const intermediateJson = convertXmlToIntermediateJson(iso4217Xml);

	writeJsonToFile("intermediate.json", intermediateJson);

	const iso4217Json = convertIntermediateJsonToISO4217Json(intermediateJson);

	await writeJsonToFile("data.json", iso4217Json);
}

test();
