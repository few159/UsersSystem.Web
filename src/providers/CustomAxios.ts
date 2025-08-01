import axios, { AxiosRequestConfig, AxiosResponse } from "axios"

const customAxios = axios.create({
  // httpsAgent : new https.Agent({ rejectUnauthorized: false,})
})

export const httpRequest = {
  get: <T>(url: string, config?: AxiosRequestConfig<T>) => {
    return customAxios.get<T>(url, config)
  },
  post: <T = never, R = AxiosResponse<T>>(url: string, data? : T, config?: AxiosRequestConfig<T>) : Promise<R> => {
    return customAxios.post<T,R>(url, data, config)
  },
  put: <T = never, R = AxiosResponse<T>>(url: string, data? : T, config?: AxiosRequestConfig<T>) : Promise<R> => {
    return customAxios.put<T, R>(url, data, config)
  },
  patch: <T>(url: string, data? :T, config?: AxiosRequestConfig<T>) => {
    return customAxios.patch<T>(url, data, config)
  },
  delete: <T>(url: string, config?: AxiosRequestConfig<T>) => {
    return customAxios.delete<T>(url, config)
  }
}