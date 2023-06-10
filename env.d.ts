import 'vitest/globals'

declare global {
  namespace App {
    type Data = typeof import('./data.json')
  }
}
