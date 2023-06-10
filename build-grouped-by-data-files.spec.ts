import buildGroupedByDataFiles from "./build-grouped-by-data-files"; // FIXME: import causes error `ERR_DLOPEN_FAILED`

const mockGetData = vi.fn().mockResolvedValue({
	$name: "ISO_4217",
	$attr: {
		"Pblshd": "2023-01-01",
	},
	$data: [
		{
			$name: "CcyTbl",
			$attr: {},
			$data: [
				{
					$name: "CcyNtry",
					$attr: {},
					$data: [
						{
							$name: "CtryNm",
							$attr: {},
							$data: "EUROPEAN UNION",
						},
						{
							$name: "CcyNm",
							$attr: {},
							$data: "Euro",
						},
						{
							$name: "Ccy",
							$attr: {},
							$data: "EUR",
						},
						{
							$name: "CcyNbr",
							$attr: {},
							$data: 978,
						},
						{
							$name: "CcyMnrUnts",
							$attr: {},
							$data: 2,
						},
					],
				},
				{
					$name: "CcyNtry",
					$attr: {},
					$data: [
						{
							$name: "CtryNm",
							$attr: {},
							$data: "UKRAINE",
						},
						{
							$name: "CcyNm",
							$attr: {},
							$data: "Hryvnia",
						},
						{
							$name: "Ccy",
							$attr: {},
							$data: "UAH",
						},
						{
							$name: "CcyNbr",
							$attr: {},
							$data: 980,
						},
						{
							$name: "CcyMnrUnts",
							$attr: {},
							$data: 2,
						},
					],
				},
				{
					$name: "CcyNtry",
					$attr: {},
					$data: [
						{
							$name: "CtryNm",
							$attr: {},
							$data: "UNITED STATES OF AMERICA (THE)",
						},
						{
							$name: "CcyNm",
							$attr: {},
							$data: "US Dollar",
						},
						{
							$name: "Ccy",
							$attr: {},
							$data: "USD",
						},
						{
							$name: "CcyNbr",
							$attr: {},
							$data: 840,
						},
						{
							$name: "CcyMnrUnts",
							$attr: {},
							$data: 2,
						},
					],
				},
			],
		},
	],
})

const mockWriteJsonToFile = vi.fn().mockResolvedValue(undefined)

vi.mock('./get-data.impl', () => ({
	default: (...args: unknown[]) => mockGetData(...args),
}))

vi.mock('./write-to-file', () => ({
	writeJsonToFile: (...args: unknown[]) => mockWriteJsonToFile(...args),
}))

describe(buildGroupedByDataFiles.name, () => {
	it("should group data by country name", async () => {
		vi.stubEnv('ISO4217_JSON_BUILD_DATA_GROUPED_BY_COUNTRY_NAME', 'always')

		await buildGroupedByDataFiles()

		expect(mockWriteJsonToFile).toHaveBeenCalledOnce()

		const { lastCall: lastCallArgs } = mockWriteJsonToFile.mock

		expect(lastCallArgs).toMatchSnapshot()
	})

	it.todo("should group data by currency name", () => {
		// vi.stubEnv('ISO4217_JSON_BUILD_DATA_GROUPED_BY_CURRENCY_NAME', 'always')
	})

	it.todo("should group data by currency code", () => {
		// vi.stubEnv('ISO4217_JSON_BUILD_DATA_GROUPED_BY_CURRENCY_CODE', 'always')
	})

	it.todo("should group data by currency number", () => {
		// vi.stubEnv('ISO4217_JSON_BUILD_DATA_GROUPED_BY_CURRENCY_NUMBER', 'always')
	})

	it.todo("should group data by currency minor units", () => {
		// vi.stubEnv('ISO4217_JSON_BUILD_DATA_GROUPED_BY_CURRENCY_MINOR_UNITS', 'always')
	})
})
