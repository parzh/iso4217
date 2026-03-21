import type { Intermediate } from "./convert-xml-to-intermediate-json.impl";
import type { JSXml, Primitive } from "./js-xml.type";

/** @private */
function isPrimitive(value: unknown): value is Primitive {
	return typeof value === "string" || typeof value === "number" && !isNaN(value) || typeof value === "boolean";
}

export abstract class ConflictingDataError extends Error {
	abstract readonly node: JSXml;
}

export class CannotSetLiteralContentError extends ConflictingDataError {
	constructor(public node: JSXml) {
		super("Cannot set literal content in a node that has child nodes");
	}
}

export class CannotAddChildNodesError extends ConflictingDataError {
	constructor(public node: JSXml) {
		super("Cannot add child nodes in a node that has literal content");
	}
}

/** @private */
function assertCanSetLiteralContent(node: JSXml): asserts node is JSXml<Primitive> {
	if (node.$data !== "")
		throw new CannotSetLiteralContentError(node);
}

/** @private */
function assertCanAddChildNode(node: JSXml): asserts node is JSXml<JSXml[]> {
	if (node.$data === "")
		node.$data = [];

	else if (!Array.isArray(node.$data))
		throw new CannotAddChildNodesError(node);
}

/** @private */
const _ = {} as const;

/** @private */
function populateNode(
	node: JSXml,
	host: Intermediate,
	prop: string,
	data = host[prop],
): void {
	if (data == null || Number.isNaN(data))
		return;

	if (isPrimitive(data)) {
		if (prop === "$t") {
			assertCanSetLiteralContent(node);
			node.$data = data;
		} else {
			node.$attr[prop] = data;
		}

		return;
	}

	if (data instanceof Array) {
		for (const item of data)
			populateNode(node, _ /* unused */, prop, item);

		return;
	}

	assertCanAddChildNode(node);

	const childNode: JSXml = {
		$name: prop,
		$attr: {},
		$data: "",
	};

	for (const key in data)
		populateNode(childNode, data, key);

	node.$data.push(childNode);
}

export default function convertIntermediateJsonToJSXml(intermediate: Intermediate, key?: string): JSXml {
	const node: JSXml<JSXml[]> = {
		$name: "",
		$attr: {},
		$data: [],
	};

	if (key != null) {
		populateNode(node, intermediate, key);

		return node.$data[0];
	}

	for (const key in intermediate)
		populateNode(node, intermediate, key);

	return node;
}
