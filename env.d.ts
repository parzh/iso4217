export {}

declare global {
  namespace App {
    type Data = typeof import('./data.json')
  }
}
