import { version as actual } from "./package.json";
import composeVersionNumber from "./compose-version-number.impl";

export class VersionMismatchError extends Error {
	constructor(
		public readonly actual: string,
		public readonly expected: string,
	) {
		super(`Package version ("${actual}") does not match data version ("${expected}")`);
	}
}

export default function assertPackageAndDataFileVersionsMatch(): void {
	const expected = composeVersionNumber();

	if (expected !== actual) {
		throw new VersionMismatchError(actual, expected);
	}
}

if (require.main === module) {
	assertPackageAndDataFileVersionsMatch();
}
