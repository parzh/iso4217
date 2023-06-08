import fs from "fs";
import buildDataFile from "./build-data-file.impl";

export default async function buildDataFileIfNeeded(): Promise<void> {
	if (!fs.existsSync('./data.json')) {
		await buildDataFile()
	}
}

if (require.main === module) {
	buildDataFileIfNeeded();
}
