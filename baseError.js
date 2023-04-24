export default class BaseError extends Error {
  constructor({ name, msg}) {
    super(msg)
    this.name = name
  }
}