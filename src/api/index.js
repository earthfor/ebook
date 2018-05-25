const EventEmitter = require('events')

class API {
  static wrap (func) {
    const cancel = new EventEmitter()
    return (...args) => {
      const promiseHandle = new Promise((resolve, reject) => {
        const f = func(...args)
        f.then(res => resolve(res)).catch(err => reject(err))
        cancel.on('cancel', (e) => {
          //  Call their own cancel
          f.cancel && f.cancel()
          reject(new Error(e))
        })
      })
      return Object.assign(promiseHandle, {
        cancel () {
          cancel.emit('cancel', 'abort')
        }
      })
    }
  }

  static request (url, { method = 'GET', user = null, passwd = null, body, headers = {}, timeout = 5000 }) {
    const xhr = new window.XMLHttpRequest()

    xhr.timeout = timeout
    xhr.open(method, url, true, user, passwd)
    Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value))

    const promiseHandle = new Promise((resolve, reject) => {
      xhr.send(body)
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          const firstNumber = parseInt(this.status.toString().slice(0, 1), 10)

          if (firstNumber < 4 && firstNumber > 0) {
            resolve(xhr)
            return
          }

          reject(xhr)
        }
      }
    })

    return Object.assign(promiseHandle, {
      cancel () {
        xhr.abort()
        return true
      }
    })
  }

  static proxyReq ({ url, config, data }) {
    const proxyURL = 'https://pkindle.herokuapp.com/cors'
    return this.request(proxyURL, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        url,
        config,
        data
      })
    })
  }

  static suggestion (word) {
    const baseURL = 'https://www.qidian.com/ajax/Search/AutoComplete'
    const params = new URLSearchParams()
    params.append('_csrfToken', '')
    params.append('siteid', 1)
    params.append('query', word)

    let func = () => {
      const promiseHandle = this.proxyReq({
        url: baseURL,
        config: {
          search: params.toString(),
          timeout: 5000
        }
      })

      const promiseResult = promiseHandle.then((xhr) => Promise.resolve(xhr.status))

      const cancel = () => promiseHandle.cancel()
      return Object.assign(promiseResult, { cancel })
    }

    func = this.wrap(func)
    return func()
  }
}

export default API
