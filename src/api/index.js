const EventEmitter = require('events')

class API {
  static wrap (func) {
    const cancel = new EventEmitter()
    return (...args) => {
      const promiseHandle = new Promise((resolve, reject) => {
        cancel.on('cancel', () => reject(new Error('Abort')))
        func(...args).then(res => resolve(res)).catch(err => reject(err))
      })
      return Object.assign(promiseHandle, {
        cancel () {
          cancel.emit('cancel')
        }
      })
    }
  }

  static async suggestion (word) {
    return Array.from({ length: 10 }).fill({
      word,
      left: 123
    })
  }
}

export default API
