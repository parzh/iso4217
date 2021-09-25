import json from "./iso4217.json";

/**
 * Get version of the standard that is used in this package.
 * Version is an ISO date.
 *
 * @example
 * getVersion() // => "2018-08-29"
 */
export default function getVersion(): string {
	return json.$attr.Pblshd;
}
