export { default as json } from "./data.json";

/*
	TODO:
	This should be exported through

		export type * from '...';

	which is recently became supported - since TypeScript 5.0.
	But BECAUSE this syntax is supported ONLY since TypeScript 5.0,
	I hesitate to make this change right away. Let's wait a couple
	of months before changing this construct to its modern variant.
*/
export {
	JSXml,
	JSXmlAttr,
	JSXmlData,
	Primitive,
} from "./js-xml.type";
