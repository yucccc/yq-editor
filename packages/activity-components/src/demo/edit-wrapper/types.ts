export interface EditPropsType {
  on: {
    [key: string]: (...args: any[]) => any
  }
  props: {
    [key: string]: any
  }
}
