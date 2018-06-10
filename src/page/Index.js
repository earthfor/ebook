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
        searchPanel: false,
        showHistory: true
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
    const { suggestion: sugg, show } = this.state
    const value = v.trim()

    if (value === '') {
      show.showHistory = true
    } else {
      show.showHistory = false
    }

    this.setState({ show })

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

  inputKeyDown (e) {
    const { key } = e

    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
        console.log('2333')
        break
      default:
        break
    }
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

  searchPanelValue () {
    //  Check if search value !== ''
    const { histories, suggestion: sugg, show } = this.state
    const { data: suggData } = sugg
    const { showHistory } = show
    let valueArray
    if (showHistory) {
      valueArray = Array.from(histories).reverse().slice(0, 10).map(history => history)
    } else {
      valueArray = suggData.slice(0, 10)
    }

    return valueArray
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
        <div className='index-logo-container'>
          <div className='index-logo-content'>Hi, Ebooker!</div>
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
          <Search autoFocus change={(v) => this.inputValueChange(v)} keyDown={(e) => this.inputKeyDown(e)} />
          <ul className={`index-search-panel ${this.state.show.searchPanel && this.searchPanelValue().length ? '' : 'hidden'}`}>
            {
              this.searchPanelValue().map((v, i) => {
                return (
                  <li onMouseDown={() => this.search(v, true)} key={i}>
                    <div className='index-search-panel-value'>{v.value}</div>
                    { this.state.show.showHistory && <div className='index-search-panel-remove' onMouseDown={(e) => this.removeHistory(e, v.value)}>Remove</div>}
                    { !this.state.show.showHistory && v.category && <div className='index-search-panel-category'>{v.category}</div>}
                  </li>
                )
              })
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
