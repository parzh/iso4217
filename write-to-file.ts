import os from "os";
import fs from "fs";

export default function writeToFile(pathToFile: string, content: string): Promise<void> {
	const tailLine = content.endsWith(os.EOL) ? "" : os.EOL;
	const contentPrepared = content + tailLine;
	const promise = fs.promises.writeFile(pathToFile, contentPrepared);

	return promise
}

/** @private */
const voidToNullReplacer = (key: string, value: unknown) => value ?? null;

export function writeJsonToFile(pathToFile: string, json: object): Promise<void> {
	const content = JSON.stringify(json, voidToNullReplacer, 2);
	const promise = writeToFile(pathToFile, content);

	return promise;
}
