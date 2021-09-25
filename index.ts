import fs from "fs";
import path from "path";
import type JSXml from "./js-xml.type";

export { default as json } from "./iso4217.json";

export * from "./js-xml.type";

/**
 * Read JSON from raw file (as opposed to import- / require-based approach).
 */
export async function getJson(): Promise<JSXml> {
	const pathToRawJsonFile = path.resolve(__dirname, "./iso4217.json");
	const rawJson = await fs.promises.readFile(pathToRawJsonFile, "utf8");
	const json = JSON.parse(rawJson) as JSXml;

	return json;
}
