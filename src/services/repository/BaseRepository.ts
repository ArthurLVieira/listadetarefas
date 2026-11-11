import type { AxiosInstance, AxiosRequestConfig } from "axios";

export class BaseRepository {
  protected readonly http: AxiosInstance;
  protected readonly basePath: string;

  constructor(http: AxiosInstance, basePath: string) {
    this.http = http;
    this.basePath = basePath;
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.http.get<T>(`${this.basePath}${url}`, config);
    return data;
  }

  protected async post<T, B = unknown>(
    url: string,
    body: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await this.http.post<T>(
      `${this.basePath}${url}`,
      body,
      config,
    );
    return data;
  }

  protected async put<T, B = unknown>(
    url: string,
    body: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await this.http.put<T>(
      `${this.basePath}${url}`,
      body,
      config,
    );
    return data;
  }

  protected async patch<T, B = unknown>(
    url: string,
    body: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await this.http.patch<T>(
      `${this.basePath}${url}`,
      body,
      config,
    );
    return data;
  }

  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await this.http.delete<T>(
      `${this.basePath}${url}`,
      config,
    );
    return data;
  }
}
