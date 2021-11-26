import httpGet from "./http-get.impl";
import writeToFile, { writeJsonToFile } from "./write-to-file";
import convertXmlToJSXml from "./convert-xml-to-js-xml.impl";

/** @private */
// FIXME: there's a typo here: "currrency"
const ISO4217_XML_URL =
	"https://www.six-group.com/dam/download/financial-information/data-center/iso-currrency/lists/list_one.xml";

export default async function buildDataFile() {
	const xml = await httpGet(ISO4217_XML_URL);

	writeToFile("data.xml", xml);

	const { result, intermediate } = convertXmlToJSXml(xml, "ISO_4217");

	await Promise.all([
		writeJsonToFile("data.intermediate.json", intermediate),
		writeJsonToFile("data.json", result),
	]);
}

if (require.main === module)
	buildDataFile();
