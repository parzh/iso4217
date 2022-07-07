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

	interface StringConstructor {
		(value: boolean): `${boolean}`;
	}
}

/** @private */
const enum BuildStrategy {
	Never = "never",
	Always = "always",
	IfNotExists = "if-not-exists",
	IfExists = "if-exists",
}

/** @private */
const buildStrategyAliasesExact = {
  never: BuildStrategy.Never,
	always: BuildStrategy.Always,
	"if-not-exists": BuildStrategy.IfNotExists,
	"if-exists": BuildStrategy.IfExists,
} as const;

/** @private */
const buildStrategyAliasesBoolean = {
	false: BuildStrategy.Never,
	true: BuildStrategy.Always,
} as const;

/** @private */
const buildStrategyAliasesNumber = {
	0: BuildStrategy.Never,
	1: BuildStrategy.Always,
	2: BuildStrategy.IfNotExists,
	3: BuildStrategy.IfExists,
} as const;

/** @private */
const buildStrategyAliases = {
	...buildStrategyAliasesExact,
	...buildStrategyAliasesBoolean,
	...buildStrategyAliasesNumber,

	hard: BuildStrategy.Always,
	soft: BuildStrategy.IfNotExists,
	"unless-exists": BuildStrategy.IfNotExists,
} as const;

/** @private */
type BuildStrategyAlias = keyof typeof buildStrategyAliases;

/** @private */
function getBuildStrategy(envVarValue: string | undefined): BuildStrategy {
	if (envVarValue && envVarValue in buildStrategyAliases)
		return buildStrategyAliases[envVarValue as BuildStrategyAlias];

	const booleanAlias = String(!!envVarValue);

	return buildStrategyAliasesBoolean[booleanAlias];
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

		if (strategy === BuildStrategy.Never)
			continue;

		const filePathAbsolute = path.resolve(__dirname, fileName);
		const filePathRelative = path.relative(process.cwd(), filePathAbsolute);

		if (strategy !== BuildStrategy.Always) {
			const isIfExists = strategy === BuildStrategy.IfExists;
			const fileExists = fs.existsSync(filePathAbsolute);

			if (isIfExists !== fileExists) {
				log("info", `Skipping file "${filePathRelative}" (strategy "${strategy}")`);
				continue;
			}
		}

		log("info", `Building file "${filePathRelative}" ...`);

		const dataGrouped = getEntriesGroupedBy(envKeyPostfix as EnvKeyPostfix);
		const job = writeJsonToFile(filePathAbsolute, dataGrouped)
			.then(() => {
				log("info", `File "${filePathRelative}" is built successfully`);
			}, (error) => {
				log("error", error);
				log("error", `An error encountered while building "${filePathRelative}" (see above)`);
			});

		jobs.push(job);
	}

	await Promise.all(jobs);
}

if (require.main === module)
	buildGroupedByDataFiles();
