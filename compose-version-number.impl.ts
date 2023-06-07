import data from "./data.json";
import packageJson from "./package.json";

/** @private */
interface DateSimple {
	readonly year: string;
	readonly month: string;
	readonly day: string;
}

/** @private */
function pad(padding: 2 | 4, input: string | number): string {
	const output = String(input).padStart(padding, "0");

	return output
}

/** @private */
function createDateSimple(date: Date): DateSimple {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();

	return {
		year: pad(4, year),
		month: pad(2, month),
		day: pad(2, day),
	};
}

export default function composeVersionNumber(): string {
	const dataVersionDate = new Date(data.$attr.Pblshd)

	const { year, month, day } = createDateSimple(dataVersionDate);
	const [ version ] = packageJson.version.split(/[+-]/, 1);
	const [ , minor, patch ] = version.split(".");

	const result = `${year}${month}${day}.${minor}.${patch}`;

	return result;
}

if (require.main === module) {
	console.log(composeVersionNumber());
}
