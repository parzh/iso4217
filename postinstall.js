"use strict";
const producerPackageName = require("./package.json").name; // expected to see "@iso4217/json"
const consumerPackageName = process.env.npm_package_name ?? ""; // expected to see arbitrary package name

const logPrefix = `${producerPackageName}:`;

/** @param {unknown[]} values @returns {void} */
function log(...values) {
	console.log(logPrefix, "[meta]", ...values);
}

function postinstall() {
	if (consumerPackageName === producerPackageName) {
		const fs = require("fs");

		if (!fs.existsSync("./build-grouped-by-data-files.js")) {
			const { spawnSync } = require("child_process");
			const { platform } = require("os");

			log("Compiling script file ...");

			const npm = platform() === 'win32' ? "npm.cmd" : "npm"

			const { error } = spawnSync(npm, [ "run", "build" ], {
				cwd: process.cwd(),
				timeout: 20000,
				stdio: "inherit",
			});

			if (error)
				throw error;

			log("Script file has been compiled");
		}
	}

	require("./build-grouped-by-data-files").default();
}

postinstall();
