import fs from "fs";
import path from "path";
import packageJson from "./package.json";
import type { JSXml, Primitive } from "./js-xml.type";
import json from "./data.json";
import { writeJsonToFile } from "./write-to-file";

/** @private */
const envPrefix = "ISO4217_JSON_BUILD_DATA_GROUPED_BY_";

/** @private */
const grouping = {
	COUNTRY_NAME: {
		tagName: "CtryNm",
		fileName: "data-grouped-by-country-name.json",
	},
	CURRENCY_NAME: {
		tagName: "CcyNm",
		fileName: "data-grouped-by-currency-name.json",
	},
	CURRENCY_CODE: {
		tagName: "Ccy",
		fileName: "data-grouped-by-currency-code.json",
	},
	CURRENCY_NUMBER: {
		tagName: "CcyNbr",
		fileName: "data-grouped-by-currency-number.json",
	},
	CURRENCY_MINOR_UNITS: {
		tagName: "CcyMnrUnts",
		fileName: "data-grouped-by-currency-minor-units.json",
	},
} as const;

/** @private */
type Grouping = typeof grouping;

/** @private */
type EnvKeyPostfix = keyof Grouping;

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Partial<Record<`${typeof envPrefix}${EnvKeyPostfix}`, string>> {}
	}
}

const values = {
	0b0: "never",
	0b1: "always",
	0b10: "if-not-exists",
	0b11: "if-exists",

	true: "always",
	false: "never",

	always: "always",
	never: "never",

	hard: "always",
	soft: "if-not-exists",

	"if-exists": "if-exists",
	"if-not-exists": "if-not-exists",
	"unless-exists": "if-not-exists",
} as const;

/** @private */
type SpecialValues = typeof values;

/** @private */
type SpecialValue = keyof SpecialValues;

/** @private */
type BuildStrategy = SpecialValues[SpecialValue];

/** @private */
function getBuildStrategy(value: string | undefined): BuildStrategy {
	if (value && value in values)
		return values[value as SpecialValue];

	return values[String(!!value) as `${boolean}`];
}

/** @private */
type Entry = JSXml<JSXml[]>;

/** @private */
type EntryDataItem = JSXml<Primitive>;

/** @private */
const entries: Entry[] = json.$data[0].$data;

/** @private */
function getEntryDataItem(entry: Entry, itemName: Grouping[EnvKeyPostfix]["tagName"]): EntryDataItem | null {
	for (const item of entry.$data)
		if (item.$name === itemName)
			return item as EntryDataItem;

	return null;
}

/** @private */
function getEntriesGroupedBy(envKeyPostfix: EnvKeyPostfix): Record<string, Entry[]> {
	const { tagName } = grouping[envKeyPostfix];
	const grouped = Object.create(null) as Record<string, Entry[]>;

	for (const entry of entries) {
		const dataItem = getEntryDataItem(entry, tagName);

		if (dataItem == null)
			continue;

		const groupName = String(dataItem.$data);

		if (groupName in grouped)
			grouped[groupName].push(entry);

		else
			grouped[groupName] = [ entry ];
	}

	return grouped;
}

/** @private */
const logPrefix = `${packageJson.name}:`;

/** @private */
function log(level: "info" | "error", ...values: unknown[]) : void {
	console[level](logPrefix, ...values);
}

export default async function buildGroupedByDataFiles() {
	const jobs: Promise<void>[] = [];

	for (const envKeyPostfix in grouping) {
		const { fileName } = grouping[envKeyPostfix as EnvKeyPostfix];
		const envVarKey = envPrefix + envKeyPostfix;
		const envVarValue = process.env[envVarKey];
		const strategy = getBuildStrategy(envVarValue);

		if (strategy === "never")
			continue;

		const filePath = path.relative(process.cwd(), path.resolve(__dirname, fileName));

		if (strategy !== "always") {
			const isIfExists = strategy === "if-exists";
			const fileExists = fs.existsSync(filePath);

			if (isIfExists !== fileExists) {
				log("info", `Skipping file "${filePath}" (strategy "${strategy}")`);
				continue;
			}
		}

		log("info", `Building file "${filePath}" ...`);

		const dataGrouped = getEntriesGroupedBy(envKeyPostfix as EnvKeyPostfix);
		const write = writeJsonToFile(filePath, dataGrouped);
		const job = write.then(() => {
			log("info", `File "${filePath}" is built successfully`);
		}, (error) => {
			log("error", `An error encountered while building "${filePath}":`, error);
		});

		jobs.push(job);
	}

	await Promise.all(jobs);
}

if (require.main === module)
	buildGroupedByDataFiles();
