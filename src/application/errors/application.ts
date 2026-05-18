export default abstract class ApplicationError extends Error {
  abstract readonly code: string;
}
