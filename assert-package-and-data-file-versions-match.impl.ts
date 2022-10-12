import { version as actual } from "./package.json";
import composeVersionNumber from "./compose-version-number.impl";

export class VersionMismatchError extends Error {
	constructor(public actual: string, public expected: string) {
		super(`Package version ("${actual}") does not match data version ("${expected}")`);
	}
}

export default function assertPackageAndDataFileVersionsMatch(): void {
	const expected = composeVersionNumber();
	const equals = expected === actual;

	if (!equals)
		throw new VersionMismatchError(actual, expected);
}

if (require.main === module)
	assertPackageAndDataFileVersionsMatch();
