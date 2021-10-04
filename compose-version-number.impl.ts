import data from "./data.json";
import packageJson from "./package.json";

/** @private */
interface DateSimple {
	year: string;
	month: string;
	day: string;
}

/** @private */
function getDataVersionComponents(dataVersion: string): DateSimple {
	const date = new Date(dataVersion); // assuming that `dataVersion` is a ISO-8601-compliant string 😡

	return {
		year: String(date.getFullYear()),
		month: String(date.getMonth() + 1),
		day: String(date.getDate()),
	};
}

export default function composeVersionNumber(): string {
	const { year, month, day } = getDataVersionComponents(data.$attr.Pblshd);
	const [ version ] = packageJson.version.split(/[+-]/, 1);
	const [ , minor, patch ] = version.split(".");

	const result = `${year}${month}${day}.${minor}.${patch}`;

	return result;
}

if (require.main === module)
	console.log(composeVersionNumber());
