export interface RespData<T = {}> {
  errCode: number
  data: T
  message?: string
}
