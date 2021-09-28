import type { URL } from "url";
import https from "https";

/** @private */
type Chunk = string | Buffer;

/** @private */
function isChunk(value: unknown): value is Chunk {
	return typeof value === "string" || Buffer.isBuffer(value);
}

export class MalformedChunkError extends Error {
	constructor(
		public chunk: unknown,
	) {
		super("Received a malformed chunk");
	}
}

export default function httpGet(url: string | URL, options: https.RequestOptions = {}): Promise<string> {
	return new Promise((resolve) => {
		const chunks: Chunk[] = [];

		https.get(url, options, (res) => {
			res
				.setEncoding("utf8")
				.on("data", (chunk) => {
					if (isChunk(chunk)) {
						chunks.push(chunk);
					} else {
						res.destroy(new MalformedChunkError(chunk));
					}
				})
				.once("end", () => {
					const result = chunks.map(String).join("");

					resolve(result);
				});
		});
	});
}
