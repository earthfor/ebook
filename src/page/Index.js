import React, { Component } from 'react'
import API from '../api'

import './Index.css'

import Search from '../components/Search'
import Hot from '../components/Hot'

class Index extends Component {
  constructor (props) {
    super(props)

    let histories = window.localStorage.getItem('search-history') || '[]'
    histories = JSON.parse(histories)

    this.state = {
      show: {
        searchHover: false,
        searchPanel: false
      },
      searchValue: '',
      histories,
      suggestion: {
        last: null,
        key: '',
        data: []
      },
      hot: []
    }
  }

  changeSearchHover (state) {
    const { show } = this.state

    show.searchHover = !!state

    this.setState({
      show
    })
  }

  changeSearchPanel (state) {
    const { show } = this.state

    show.searchPanel = !!state

    this.setState({
      show
    })
  }

  async inputValueChange (v) {
    const { suggestion: sugg } = this.state
    const value = v.trim()

    //  Cancel last
    sugg.last && sugg.last.cancel()

    const handle = API.suggestion(value)

    //  First store handle to last for next to cancel
    this.setState({
      searchValue: value,
      suggestion: {
        last: handle,
        key: v,
        data: []
      }
    })

    let data
    try {
      data = await handle
    } catch (e) {
      if (e.message === 'Abort') {
        return
      }
      throw e
    }

    //  So fill value into sugg
    this.setState({
      suggestion: {
        last: null,
        key: v,
        data
      }
    })
  }

  async componentDidMount () {
    this.changeSearchHover(true)
  }

  storeHistory (histories) {
    this.setState({
      histories
    })
    window.localStorage.setItem('search-history', JSON.stringify(histories))
  }

  removeHistory (e, v) {
    const { histories } = this.state
    const idx = histories.findIndex(h => h.value === v)
    idx !== -1 && histories.splice(idx, 1)

    this.storeHistory(histories)

    //  Prevent Event
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  search (v) {
    //  Add to history
    const { histories } = this.state
    const hasItem = histories.some(h => h.value === v.value)

    if (!hasItem) {
      histories.push(v)
      this.storeHistory(histories)
    }

    //  TODO: Emit Search event
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
          <Search change={(v) => this.inputValueChange(v)} keyDown={(e) => this.inputKeyDown(e)} />
          <ul className={`index-search-panel ${this.state.show.searchPanel && (this.state.suggestion.data.length || this.state.histories.length) ? '' : 'hidden'}`}>
            {
              this.state.searchValue
                ? this.state.suggestion.data.slice(0, 10).map((v, i) => (
                  <li onMouseDown={() => this.search(v)} key={i}>
                    <div className='index-search-panel-value'>{v.value}</div>
                    {v.category && <div className='index-search-panel-category'>{v.category}</div>}
                  </li>
                ))
                : this.state.histories.slice(0, 10).map((v, i) => (
                  <li onMouseDown={() => this.search(v, true)} key={i}>
                    <div className='index-search-panel-value'>{v.value}</div>
                    <div className='index-search-panel-remove' onMouseDown={(e) => this.removeHistory(e, v.value)}>Remove</div>
                  </li>
                ))
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
