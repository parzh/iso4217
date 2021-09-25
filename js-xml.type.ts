export type Primitive = string | number | boolean;

export type JSXmlAttr = Record<string, Primitive>;

export type JSXmlData = Primitive | JSXml[];

export interface JSXml<Data extends JSXmlData = JSXmlData> {
	$name: string;
	$attr: JSXmlAttr;
	$data: Data;
}

export default JSXml;
