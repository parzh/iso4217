import parser from "xml2json";
import type { Primitive } from "./js-xml.type";

export interface Intermediate {
	[key: string]: Primitive | Intermediate | Intermediate[];
	$t?: Primitive;
}

/** @private */
const parseOptions = {
	object: true,
	coerce: true, // TODO: perform coercion manually to preserve raw (string) content
	trim: true,
	reversible: true,
	// arrayNotation: true,
} as const;

export default function convertXmlToIntermediateJson(xml: string): Intermediate {
	const result = parser.toJson(xml, parseOptions);

	return result as Intermediate;
}
