import os from "os";
import fs from "fs";
import path from "path";

export default function writeToFile(pathToFile: string, content: string): Promise<void> {
	const filepath = path.resolve(__dirname, pathToFile);
	const tailLine = content.endsWith(os.EOL) ? "" : os.EOL;

	return fs.promises.writeFile(filepath, content + tailLine);
}

/** @private */
const voidToNullReplacer = (key: string, value: unknown) => value ?? null;

export function writeJsonToFile(pathToFile: string, json: object): Promise<void> {
	const content = JSON.stringify(json, voidToNullReplacer, 2);

	return writeToFile(pathToFile, content);
}
