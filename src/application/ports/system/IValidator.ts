export default interface IValidator<T> {
  validate(data: T): { data: T; errors: { field: string; message: string }[] };
}
