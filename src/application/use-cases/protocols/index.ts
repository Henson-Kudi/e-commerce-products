export default interface IUseCase<Params, ReturnValue> {
  execute(params: Params): ReturnValue;
}
