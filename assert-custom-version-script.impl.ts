declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly VERSIONING_IS_ALLOWED?: string
		}
	}
}

export class VersionScriptNotCustomError extends Error {
	constructor() {
		super('Please, use a custom script to change the version.')
	}
}

export default function assertCustomVersionScript(): void {
	if (process.env.VERSIONING_IS_ALLOWED !== "true") {
		throw new VersionScriptNotCustomError()
	}
}

if (require.main === module) {
	assertCustomVersionScript();
}
