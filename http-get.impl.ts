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

export class UnexpectedResponseStatus extends Error {
	constructor(
		public statusCode?: number,
		public statusMessage?: string,
	) {
		super(`Expected a 2xx status code, received "${statusCode} ${statusMessage}"`);
	}
}

export default function httpGet(url: string | URL, options: https.RequestOptions = {}): Promise<string> {
	return new Promise((resolve, reject) => {
		const chunks: Chunk[] = [];

		https.get(url, options, (res) => {
			if (!String(res.statusCode).startsWith("2"))
				return reject(new UnexpectedResponseStatus(res.statusCode, res.statusMessage));

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
