import React, { Component } from 'react'
import API from '../api'

import './Index.css'

import Search from '../components/Search'
import Hot from '../components/Hot'

class Index extends Component {
  constructor (props) {
    super(props)

    const history = window.localStorage.getItem('search-history') || ['书本1', '书本2', '书本3']

    this.state = {
      show: {
        searchHover: false,
        searchPanel: false
      },
      searchValue: '',
      history,
      suggestion: {
        last: null,
        key: '',
        data: []
      },
      hot: []
    }
  }

  changeSearchHover (state) {
    this.setState({
      show: {
        searchHover: !!state
      }
    })
  }

  changeSearchPanel (state) {
    this.setState({
      show: {
        searchPanel: !!state
      }
    })
  }

  async inputValueChange (v) {
    const { suggestion: sugg } = this.state
    const value = v.trim()

    if (v === sugg.key) return

    this.setState({
      searchValue: value,
      suggestion: {
        last: null,
        key: v,
        data: []
      }
    })

    const handle = API.suggestion('')
    const data = await handle
    data.cancel()
    console.log(data)
  }

  async componentDidMount () {
    this.changeSearchHover(true)
  }

  search (v) {
    console.log(v)
  }

  render () {
    return (
      <div className='index-container'>
        <div className='index-log-container'>
          <div className='index-log-content'>Hi, Ebooker!</div>
        </div>
        <div
          className={`index-search-container ${this.state.show.searchHover ? 'index-search-container-hover' : ''}`}
          onClick={() => {
            this.changeSearchHover(true)
            this.changeSearchPanel(true)
          }}
          onBlur={() => {
            this.changeSearchHover(false)
            this.changeSearchPanel(false)
          }}
        >
          <Search change={(v) => this.inputValueChange(v)} />
          <ul className={`index-search-panel ${this.state.show.searchPanel ? '' : 'hidden'}`}>
            {
              this.state.searchValue
                ? this.state.suggestion.data.slice(0, 10).map((v, i) => (<li onMouseDown={() => this.search(v)} key={i}><b>{v.word}</b>{v.left}</li>))
                : this.state.history.slice(0, 10).map((v, i) => (<li onMouseDown={() => this.search(v)} key={i}>{v}</li>))
            }
          </ul>
        </div>
        <div className='index-recent-hot'>
          <Hot title='其他人都在搜' data={this.state.hot} />
        </div>
      </div>
    )
  }
}

export default Index
