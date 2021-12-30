import axios, { AxiosResponse, AxiosError } from "axios";

export const Post = async <T>(
  url: string,
  body: object
): Promise<AxiosResponse<T>> => {
  return await axios
    .post(url, body, {
      baseURL: "http://localhost:4000" + "/api/v1",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
    .catch((_e: AxiosError<T>) => {
      return _e.response as AxiosResponse<T>;
    });
};

export const Get = async <T>(url: string): Promise<AxiosResponse<T>> => {
  return await axios
    .get(url, {
      baseURL: "http://localhost:4000" + "/api/v1",
      headers: { "Access-Control-Allow-Origin": "*" },
    })
    .catch((_e: AxiosError<T>) => {
      return _e.response as AxiosResponse<T>;
    });
};
