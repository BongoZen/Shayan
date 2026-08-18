
export interface IWebApiService {
  post<T>(relativeUrl: string, data: unknown): Promise<T>;
}
