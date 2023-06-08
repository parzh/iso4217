import buildDataFileIfNeeded from './build-data-file-if-needed.impl';

export default async function getData(): Promise<App.Data> {
  await buildDataFileIfNeeded();

  const data = import(
    // @ts-ignore
    './data.json'
  )

  return data
}
