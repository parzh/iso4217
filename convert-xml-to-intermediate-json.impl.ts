import parser from "xml2json";
import type { Primitive } from "./iso-4217-json.type";

export interface Intermediate {
	[key: string]: Primitive | Intermediate | Intermediate[];
	$t?: Primitive;
}

/** @private */
const parseOptions = {
	object: true,
	coerce: true, // TODO: perform coercion manually
	trim: true,
	reversible: true,
	// arrayNotation: true,
} as const;

export default function convertXmlToIntermediateJson(xml: string): Intermediate {
	const result = parser.toJson(xml, parseOptions);

	return result as Intermediate;
}
