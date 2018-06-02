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
          cancel.emit('cancel', 'Abort')
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

  static proxyReq ({ url, config, data }, headers) {
    const proxyURL = 'https://pkindle.herokuapp.com/cors'
    return this.request(proxyURL, {
      method: 'post',
      headers: Object.assign({}, {
        'Content-type': 'application/json'
      }, headers),
      body: JSON.stringify({
        url,
        config,
        data
      })
    })
  }

  static suggestion (word) {
    const baseURL = 'https://www.qidian.com/ajax/Search/AutoComplete'
    const timeout = 30000
    const params = new URLSearchParams()
    params.append('_csrfToken', '')
    params.append('siteid', 1)
    params.append('query', word)

    let func = () => {
      const promiseHandle = this.proxyReq({
        url: `${baseURL}?${params.toString()}`,
        config: {
          headers: {
            'Host': 'www.qidian.com',
            'Referer': 'https://www.qidian.com',
            'User-Agent': window.navigator.userAgent
          },
          timeout
        }
      }, {
        timeout
      })

      const promiseResult = promiseHandle.then((xhr) => {
        const res = JSON.parse(xhr.response)
        if (res.data.status !== 200) {
          return Promise.reject(new Error('Response status not 200'))
        }

        const content = JSON.parse(res.data.data)
        const data = content.suggestions.map(v => {
          const { category } = v.data
          const item = {
            value: v.value,
            category
          }

          if (category === '书名') {
            item.category = ''
          }
          return item
        })
        return Promise.resolve(data)
      })

      const cancel = () => promiseHandle.cancel()
      return Object.assign(promiseResult, { cancel })
    }

    func = this.wrap(func)
    return func()
  }
}

export default API
