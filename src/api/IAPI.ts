interface ApiCall<TRequest, TResponse> {
  (body: TRequest): Promise<{ isSuccess: boolean; res: TResponse | null }>;
};