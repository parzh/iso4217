import { defineConfig, defaultExclude } from 'vitest/config'

export default defineConfig({
  test: {
    root: __dirname,
    globals: true,
    unstubEnvs: true,
    mockReset: true,
    exclude: [
      ...defaultExclude,

      // FIXME: upon importing the implementation, the test file throws
      // error 'ERR_DLOPEN_FAILED' ('Module did not self-register')
      'build-grouped-by-data-files.spec.ts',
    ],
    resolveSnapshotPath(testPath, snapshotExtension) {
      return testPath
        .replace('.test', snapshotExtension)
        .replace('.spec', snapshotExtension)
    },
  },
})
