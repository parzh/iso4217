export type Primitive = string | number | boolean;

export type ISO4217JsonAttr = Record<string, Primitive>;

export type ISO4217JsonData = Primitive | ISO4217Json[];

export interface ISO4217Json<Data extends ISO4217JsonData = ISO4217JsonData> {
	$name: string;
	$attr: ISO4217JsonAttr;
	$data: Data;
}

export default ISO4217Json;
