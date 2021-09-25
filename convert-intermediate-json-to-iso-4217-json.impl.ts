import type { Intermediate } from "./convert-xml-to-intermediate-json.impl";
import type { ISO4217Json, Primitive } from "./iso-4217-json.type";

/** @private */
function isPrimitive(value: unknown): value is Primitive {
	return typeof value === "string" || typeof value === "number" && !isNaN(value) || typeof value === "boolean";
}

export abstract class ConflictingDataError extends Error {
	abstract readonly node: ISO4217Json;
}

export class CannotSetLiteralContentError extends ConflictingDataError {
	constructor(public node: ISO4217Json) {
		super("Cannot set literal content in a node that has child nodes");
	}
}

export class CannotAddChildNodesError extends ConflictingDataError {
	constructor(public node: ISO4217Json) {
		super("Cannot add child nodes in a node that has literal content");
	}
}

/** @private */
function assertCanSetLiteralContent(node: ISO4217Json): asserts node is ISO4217Json<Primitive> {
	if (node.$data !== "")
		throw new CannotSetLiteralContentError(node);
}

/** @private */
function assertCanAddChildNode(node: ISO4217Json): asserts node is ISO4217Json<ISO4217Json[]> {
	if (node.$data === "")
		node.$data = [];

	else if (!Array.isArray(node.$data))
		throw new CannotAddChildNodesError(node);
}

/** @private */
const _ = {} as const;

/** @private */
function setPrimitiveData(node: ISO4217Json, prop: string, data: Primitive): void {
	if (prop === "$t") {
		assertCanSetLiteralContent(node);
		node.$data = data;
	} else {
		node.$attr[prop] = data;
	}
}

/** @private */
function addChildNode(node: ISO4217Json, prop: string, data: Intermediate): void {
	assertCanAddChildNode(node);

	const childNode: ISO4217Json = {
		$name: prop,
		$attr: {},
		$data: "",
	};

	for (const key in data)
		populateNode(childNode, data, key);

	node.$data.push(childNode);
}

/** @private */
function populateNode(
	node: ISO4217Json,
	host: Intermediate,
	prop: string,
	data = host[prop],
): void {
	if (isPrimitive(data))
		return setPrimitiveData(node, prop, data);

	if (data instanceof Array) {
		for (const item of data)
			populateNode(node, _ /* unused */, prop, item);

		return;
	}

	addChildNode(node, prop, data);
}

export default function convertIntermediateJsonToISO4217Json(intermediate: Intermediate): ISO4217Json {
	const node: ISO4217Json<ISO4217Json[]> = {
		$name: "",
		$attr: {},
		$data: [],
	};

	populateNode(node, intermediate, "ISO_4217");

	return node.$data[0];
}
