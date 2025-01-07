import _, { isNil } from 'lodash'

export class BaseUtil {
  static isString(val: any): val is string {
    return val != null && typeof val === 'string'
  }

  static isObject(obj: any): obj is object {
    return obj != null && obj?.constructor?.name === 'Object'
  }

  static isDate(value: any): value is Date {
    const date = new Date(value)
    return !isNaN(date.valueOf())
  }

  static isDefined<T = undefined | unknown>(val: T): val is T extends undefined ? never : T {
    return !isNil(val)
  }

  static isDefinedAndNotEmpty<T = undefined | unknown>(val: T): val is T extends undefined ? never : T {
    return this.isDefined(val) && val !== ''
  }

  static isDev() {
    return process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development'
  }

  static isProd() {
    return process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production'
  }

  static isFunction(value: any): value is (...args: any[]) => any {
    return _.isFunction(value)
  }

  static getEnv() {
    return process.env.ENV || 'local'
  }

  static isArray(value: any) {
    return !!value && Array.isArray(value)
  }
}
