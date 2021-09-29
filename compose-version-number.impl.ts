import data from "./data.json";
import packageJson from "./package.json";

export default function composeVersionNumber(): string {
	const major = data.$attr.Pblshd.replace(/\D/g, "");
	const [ version ] = packageJson.version.split(/[+-]/, 1);
	const [ , minor, patch ] = version.split(".");

	const result = `${major}.${minor}.${patch}`;

	return result;
}

if (require.main === module)
	console.log(composeVersionNumber());
